"use strict";
/**
 * vs_generate tool - Core Verbalized Sampling generation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVSGeneratePrompt = createVSGeneratePrompt;
exports.processVSResponse = processVSResponse;
exports.getDistribution = getDistribution;
exports.listDistributions = listDistributions;
exports.clearDistributions = clearDistributions;
exports.deleteDistribution = deleteDistribution;
exports.storeDistribution = storeDistribution;
const uuid_1 = require("uuid");
const distribution_js_1 = require("../types/distribution.js");
const templates_js_1 = require("../prompts/templates.js");
const parser_js_1 = require("../utils/parser.js");
// In-memory distribution store (for session persistence)
const distributionStore = new Map();
/**
 * Default parameters
 */
const DEFAULTS = {
    k: 5,
    tau: 0.10,
    domain: 'general',
};
/**
 * Generate a VS distribution
 *
 * Note: This function generates the prompt and parses the response.
 * The actual LLM call is handled by the MCP server framework.
 */
function createVSGeneratePrompt(params) {
    const k = params.k ?? DEFAULTS.k;
    const tau = params.tau ?? DEFAULTS.tau;
    const domain = params.domain ?? DEFAULTS.domain;
    const userPrompt = (0, templates_js_1.buildVSPrompt)({
        k,
        tau,
        prompt: params.prompt,
        context: params.context,
    }, domain);
    return {
        systemPrompt: templates_js_1.VS_SYSTEM_PROMPT,
        userPrompt,
        config: { k, tau, domain },
    };
}
/**
 * Process LLM response into a distribution
 */
function processVSResponse(llmResponse, originalPrompt, config, model, startTime) {
    const parseResult = (0, parser_js_1.parseVSResponse)(llmResponse);
    if (!parseResult.success || !parseResult.items) {
        throw new Error(`Failed to parse VS response: ${parseResult.error}`);
    }
    // Apply tau constraint and normalize
    let items = (0, parser_js_1.applyTauConstraint)(parseResult.items, config.tau);
    items = (0, distribution_js_1.normalizeDistribution)(items);
    items = (0, distribution_js_1.sortByProbability)(items);
    // Create distribution
    const distribution = {
        id: (0, uuid_1.v4)(),
        items,
        prompt: originalPrompt,
        domain: config.domain,
        params: {
            k: config.k,
            tau: config.tau,
        },
        created_at: new Date().toISOString(),
        model,
    };
    // Store for later retrieval
    distributionStore.set(distribution.id, distribution);
    return {
        distribution,
        metadata: {
            model,
            tau_applied: config.tau,
            k_requested: config.k,
            k_returned: items.length,
            generation_time_ms: Date.now() - startTime,
        },
    };
}
/**
 * Get a stored distribution by ID
 */
function getDistribution(id) {
    return distributionStore.get(id);
}
/**
 * List all stored distributions
 */
function listDistributions() {
    return Array.from(distributionStore.values());
}
/**
 * Clear distribution store
 */
function clearDistributions() {
    distributionStore.clear();
}
/**
 * Delete a specific distribution
 */
function deleteDistribution(id) {
    return distributionStore.delete(id);
}
/**
 * Store a distribution (for derived distributions like "remaining")
 */
function storeDistribution(distribution) {
    distributionStore.set(distribution.id, distribution);
}
//# sourceMappingURL=generate.js.map