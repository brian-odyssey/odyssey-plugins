/**
 * vs_generate tool - Core Verbalized Sampling generation
 */
import type { VSGenerateParams, VSGenerateResult, VSGenerateDomain, DiscreteDist } from '../types/distribution.js';
/**
 * Generate a VS distribution
 *
 * Note: This function generates the prompt and parses the response.
 * The actual LLM call is handled by the MCP server framework.
 */
export declare function createVSGeneratePrompt(params: VSGenerateParams): {
    systemPrompt: string;
    userPrompt: string;
    config: {
        k: number;
        tau: number;
        domain: VSGenerateDomain;
    };
};
/**
 * Process LLM response into a distribution
 */
export declare function processVSResponse(llmResponse: string, originalPrompt: string, config: {
    k: number;
    tau: number;
    domain: VSGenerateDomain;
}, model: string, startTime: number): VSGenerateResult;
/**
 * Get a stored distribution by ID
 */
export declare function getDistribution(id: string): DiscreteDist | undefined;
/**
 * List all stored distributions
 */
export declare function listDistributions(): DiscreteDist[];
/**
 * Clear distribution store
 */
export declare function clearDistributions(): void;
/**
 * Delete a specific distribution
 */
export declare function deleteDistribution(id: string): boolean;
/**
 * Store a distribution (for derived distributions like "remaining")
 */
export declare function storeDistribution(distribution: DiscreteDist): void;
//# sourceMappingURL=generate.d.ts.map