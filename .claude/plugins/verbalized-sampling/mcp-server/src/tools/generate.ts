/**
 * vs_generate tool - Core Verbalized Sampling generation
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  VSGenerateParams,
  VSGenerateResult,
  VSGenerateDomain,
  DiscreteDist,
} from '../types/distribution.js';
import { normalizeDistribution, sortByProbability } from '../types/distribution.js';
import { buildVSPrompt, VS_SYSTEM_PROMPT } from '../prompts/templates.js';
import { parseVSResponse, applyTauConstraint } from '../utils/parser.js';

// In-memory distribution store (for session persistence)
const distributionStore = new Map<string, DiscreteDist>();

/**
 * Default parameters
 */
const DEFAULTS = {
  k: 5,
  tau: 0.10,
  domain: 'general' as VSGenerateDomain,
};

/**
 * Generate a VS distribution
 *
 * Note: This function generates the prompt and parses the response.
 * The actual LLM call is handled by the MCP server framework.
 */
export function createVSGeneratePrompt(params: VSGenerateParams): {
  systemPrompt: string;
  userPrompt: string;
  config: { k: number; tau: number; domain: VSGenerateDomain };
} {
  const k = params.k ?? DEFAULTS.k;
  const tau = params.tau ?? DEFAULTS.tau;
  const domain = params.domain ?? DEFAULTS.domain;

  const userPrompt = buildVSPrompt(
    {
      k,
      tau,
      prompt: params.prompt,
      context: params.context,
    },
    domain
  );

  return {
    systemPrompt: VS_SYSTEM_PROMPT,
    userPrompt,
    config: { k, tau, domain },
  };
}

/**
 * Process LLM response into a distribution
 */
export function processVSResponse(
  llmResponse: string,
  originalPrompt: string,
  config: { k: number; tau: number; domain: VSGenerateDomain },
  model: string,
  startTime: number
): VSGenerateResult {
  const parseResult = parseVSResponse(llmResponse);

  if (!parseResult.success || !parseResult.items) {
    throw new Error(`Failed to parse VS response: ${parseResult.error}`);
  }

  // Apply tau constraint and normalize
  let items = applyTauConstraint(parseResult.items, config.tau);
  items = normalizeDistribution(items);
  items = sortByProbability(items);

  // Create distribution
  const distribution: DiscreteDist = {
    id: uuidv4(),
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
export function getDistribution(id: string): DiscreteDist | undefined {
  return distributionStore.get(id);
}

/**
 * List all stored distributions
 */
export function listDistributions(): DiscreteDist[] {
  return Array.from(distributionStore.values());
}

/**
 * Clear distribution store
 */
export function clearDistributions(): void {
  distributionStore.clear();
}

/**
 * Delete a specific distribution
 */
export function deleteDistribution(id: string): boolean {
  return distributionStore.delete(id);
}

/**
 * Store a distribution (for derived distributions like "remaining")
 */
export function storeDistribution(distribution: DiscreteDist): void {
  distributionStore.set(distribution.id, distribution);
}
