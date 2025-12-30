#!/usr/bin/env node
"use strict";
/**
 * Verbalized Sampling MCP Server
 *
 * Provides tools for generating diverse, probability-weighted options
 * using the Verbalized Sampling technique.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const zod_1 = require("zod");
const generate_js_1 = require("./tools/generate.js");
const select_js_1 = require("./tools/select.js");
const sample_js_1 = require("./tools/sample.js");
const parser_js_1 = require("./utils/parser.js");
// Tool parameter schemas
const VSGenerateSchema = zod_1.z.object({
    prompt: zod_1.z.string().describe('The question or task to explore'),
    k: zod_1.z.number().optional().default(5).describe('Number of options to generate'),
    tau: zod_1.z.number().optional().default(0.10).describe('Maximum probability per option'),
    domain: zod_1.z.enum(['general', 'architecture', 'creative', 'code'])
        .optional()
        .default('general')
        .describe('Domain for specialized prompting'),
    context: zod_1.z.string().optional().describe('Additional context'),
});
const VSSelectSchema = zod_1.z.object({
    distribution_id: zod_1.z.string().describe('ID of the distribution'),
    indices: zod_1.z.array(zod_1.z.number()).describe('Indices of items to select (0-based)'),
});
const VSSampleSchema = zod_1.z.object({
    distribution_id: zod_1.z.string().describe('ID of the distribution'),
    seed: zod_1.z.number().optional().describe('Random seed for reproducibility'),
});
const VSGetSchema = zod_1.z.object({
    distribution_id: zod_1.z.string().describe('ID of the distribution'),
});
const VSProcessResponseSchema = zod_1.z.object({
    response: zod_1.z.string().describe('The LLM response containing JSON with items'),
    original_prompt: zod_1.z.string().describe('The original prompt that was used'),
    config: zod_1.z.object({
        k: zod_1.z.number(),
        tau: zod_1.z.number(),
        domain: zod_1.z.enum(['general', 'architecture', 'creative', 'code']),
    }).describe('Configuration from vs_generate'),
    model: zod_1.z.string().optional().default('claude').describe('Model that generated the response'),
});
const VSTopKSchema = zod_1.z.object({
    distribution_id: zod_1.z.string().describe('ID of the distribution'),
    k: zod_1.z.number().describe('Number of top items to retrieve'),
});
// Create server
const server = new index_js_1.Server({
    name: 'verbalized-sampling',
    version: '1.0.0',
}, {
    capabilities: {
        tools: {},
    },
});
// List available tools
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'vs_generate',
                description: `Generate diverse options with probability weights using Verbalized Sampling.

This tool creates a prompt that asks Claude to generate multiple distinct approaches
to a problem, each with an estimated probability. The tau parameter forces diversity
by capping the maximum probability per option.

Returns the prompt to execute - the actual generation happens in the conversation.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        prompt: { type: 'string', description: 'The question or task to explore' },
                        k: { type: 'number', description: 'Number of options to generate (default: 5)' },
                        tau: { type: 'number', description: 'Max probability per option (default: 0.10)' },
                        domain: {
                            type: 'string',
                            enum: ['general', 'architecture', 'creative', 'code'],
                            description: 'Domain for specialized prompting',
                        },
                        context: { type: 'string', description: 'Additional context' },
                    },
                    required: ['prompt'],
                },
            },
            {
                name: 'vs_select',
                description: 'Select specific items from a stored distribution by their indices.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        distribution_id: { type: 'string', description: 'ID of the distribution' },
                        indices: {
                            type: 'array',
                            items: { type: 'number' },
                            description: 'Indices of items to select (0-based)',
                        },
                    },
                    required: ['distribution_id', 'indices'],
                },
            },
            {
                name: 'vs_sample',
                description: 'Randomly sample an item from a distribution using weighted probabilities.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        distribution_id: { type: 'string', description: 'ID of the distribution' },
                        seed: { type: 'number', description: 'Random seed for reproducibility' },
                    },
                    required: ['distribution_id'],
                },
            },
            {
                name: 'vs_get',
                description: 'Retrieve a stored distribution by ID.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        distribution_id: { type: 'string', description: 'ID of the distribution' },
                    },
                    required: ['distribution_id'],
                },
            },
            {
                name: 'vs_list',
                description: 'List all stored distributions.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
            {
                name: 'vs_argmax',
                description: 'Get the highest probability item from a distribution.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        distribution_id: { type: 'string', description: 'ID of the distribution' },
                    },
                    required: ['distribution_id'],
                },
            },
            {
                name: 'vs_process_response',
                description: `Process an LLM response from vs_generate and create a stored distribution.

Call this after generating options with the vs_generate prompt. Pass the full LLM response
containing the JSON with items array. Returns the processed distribution with normalized
probabilities and a distribution ID for subsequent operations.`,
                inputSchema: {
                    type: 'object',
                    properties: {
                        response: { type: 'string', description: 'The LLM response containing JSON with items' },
                        original_prompt: { type: 'string', description: 'The original prompt that was used' },
                        config: {
                            type: 'object',
                            properties: {
                                k: { type: 'number' },
                                tau: { type: 'number' },
                                domain: { type: 'string', enum: ['general', 'architecture', 'creative', 'code'] },
                            },
                            required: ['k', 'tau', 'domain'],
                        },
                        model: { type: 'string', description: 'Model that generated the response' },
                    },
                    required: ['response', 'original_prompt', 'config'],
                },
            },
            {
                name: 'vs_top_k',
                description: 'Get the top k highest probability items from a distribution.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        distribution_id: { type: 'string', description: 'ID of the distribution' },
                        k: { type: 'number', description: 'Number of top items to retrieve' },
                    },
                    required: ['distribution_id', 'k'],
                },
            },
            {
                name: 'vs_clear',
                description: 'Clear all stored distributions from memory.',
                inputSchema: {
                    type: 'object',
                    properties: {},
                },
            },
        ],
    };
});
// Handle tool calls
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    try {
        switch (name) {
            case 'vs_generate': {
                const params = VSGenerateSchema.parse(args);
                const { systemPrompt, userPrompt, config } = (0, generate_js_1.createVSGeneratePrompt)({
                    prompt: params.prompt,
                    k: params.k,
                    tau: params.tau,
                    domain: params.domain,
                    context: params.context,
                });
                // Return the prompts for Claude to execute
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                instruction: 'Execute this Verbalized Sampling generation',
                                systemPrompt,
                                userPrompt,
                                config,
                                note: 'Generate the response following the JSON format specified, then call vs_process_response with the result',
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'vs_select': {
                const params = VSSelectSchema.parse(args);
                const result = (0, select_js_1.selectFromDistribution)(params);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                selected: result.selected,
                                remaining_distribution_id: result.remaining?.id,
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'vs_sample': {
                const params = VSSampleSchema.parse(args);
                const result = (0, sample_js_1.sampleFromDistribution)(params);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                sampled_item: result.item,
                                index: result.index,
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'vs_get': {
                const params = VSGetSchema.parse(args);
                const distribution = (0, generate_js_1.getDistribution)(params.distribution_id);
                if (!distribution) {
                    throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, `Distribution not found: ${params.distribution_id}`);
                }
                return {
                    content: [
                        {
                            type: 'text',
                            text: (0, parser_js_1.formatDistribution)(distribution.items),
                        },
                    ],
                };
            }
            case 'vs_list': {
                const distributions = (0, generate_js_1.listDistributions)();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify(distributions.map((d) => ({
                                id: d.id,
                                prompt: d.prompt.substring(0, 100) + '...',
                                items_count: d.items.length,
                                created_at: d.created_at,
                            })), null, 2),
                        },
                    ],
                };
            }
            case 'vs_argmax': {
                const params = VSGetSchema.parse(args);
                const result = (0, sample_js_1.getArgmax)(params.distribution_id);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                best_item: result.item,
                                index: result.index,
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'vs_process_response': {
                const params = VSProcessResponseSchema.parse(args);
                const startTime = Date.now() - 100; // Approximate
                const result = (0, generate_js_1.processVSResponse)(params.response, params.original_prompt, {
                    k: params.config.k,
                    tau: params.config.tau,
                    domain: params.config.domain,
                }, params.model ?? 'claude', startTime);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                distribution_id: result.distribution.id,
                                items_count: result.distribution.items.length,
                                formatted: (0, parser_js_1.formatDistribution)(result.distribution.items),
                                metadata: result.metadata,
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'vs_top_k': {
                const params = VSTopKSchema.parse(args);
                const items = (0, select_js_1.getTopK)(params.distribution_id, params.k);
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                top_items: items,
                                formatted: (0, parser_js_1.formatDistribution)(items),
                            }, null, 2),
                        },
                    ],
                };
            }
            case 'vs_clear': {
                (0, generate_js_1.clearDistributions)();
                return {
                    content: [
                        {
                            type: 'text',
                            text: JSON.stringify({
                                success: true,
                                message: 'All distributions cleared',
                            }, null, 2),
                        },
                    ],
                };
            }
            default:
                throw new types_js_1.McpError(types_js_1.ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    }
    catch (error) {
        if (error instanceof types_js_1.McpError) {
            throw error;
        }
        if (error instanceof zod_1.z.ZodError) {
            throw new types_js_1.McpError(types_js_1.ErrorCode.InvalidParams, `Invalid parameters: ${error.errors.map((e) => e.message).join(', ')}`);
        }
        throw new types_js_1.McpError(types_js_1.ErrorCode.InternalError, `Tool execution failed: ${error instanceof Error ? error.message : String(error)}`);
    }
});
// Start server
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('Verbalized Sampling MCP Server running on stdio');
}
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map