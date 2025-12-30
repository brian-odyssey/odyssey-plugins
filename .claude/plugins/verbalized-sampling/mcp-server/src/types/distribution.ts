/**
 * Core types for Verbalized Sampling distributions
 */

export interface Item {
  /** The response/option text */
  text: string;
  /** Probability estimate (0.0 to 1.0) */
  probability: number;
  /** Optional rationale for the probability estimate */
  rationale?: string;
  /** Optional list of tradeoffs/considerations */
  tradeoffs?: string[];
  /** Optional metadata */
  meta?: Record<string, unknown>;
}

export interface DiscreteDist {
  /** Unique identifier for this distribution */
  id: string;
  /** Items sorted descending by probability */
  items: Item[];
  /** Original prompt that generated this distribution */
  prompt: string;
  /** Domain used for generation */
  domain: VSGenerateDomain;
  /** Parameters used */
  params: {
    k: number;
    tau: number;
  };
  /** Timestamp of creation */
  created_at: string;
  /** Model that generated this */
  model?: string;
}

export type VSGenerateDomain = 'general' | 'architecture' | 'creative' | 'code';

export interface VSGenerateParams {
  /** The question or task to explore */
  prompt: string;
  /** Number of candidates to generate (default: 5) */
  k?: number;
  /** Maximum probability per item (default: 0.10) */
  tau?: number;
  /** Domain for specialized prompting */
  domain?: VSGenerateDomain;
  /** Additional context to include */
  context?: string;
}

export interface VSGenerateResult {
  /** The generated distribution */
  distribution: DiscreteDist;
  /** Generation metadata */
  metadata: {
    model: string;
    tau_applied: number;
    k_requested: number;
    k_returned: number;
    generation_time_ms: number;
  };
}

export interface VSSelectParams {
  /** Distribution ID to select from */
  distribution_id: string;
  /** Indices of selected items (0-based) */
  indices: number[];
}

export interface VSSelectResult {
  /** Selected items */
  selected: Item[];
  /** Updated distribution (if items were removed) */
  remaining?: DiscreteDist;
}

export interface VSSampleParams {
  /** Distribution ID to sample from */
  distribution_id: string;
  /** Optional seed for reproducibility */
  seed?: number;
}

export interface VSSampleResult {
  /** The sampled item */
  item: Item;
  /** Index of the sampled item */
  index: number;
}

/**
 * Validate that probabilities are in valid range
 */
export function validateProbability(p: number): boolean {
  return p >= 0 && p <= 1;
}

/**
 * Validate that probabilities sum to approximately 1.0
 */
export function validateDistribution(items: Item[], tolerance = 0.01): boolean {
  const sum = items.reduce((acc, item) => acc + item.probability, 0);
  return Math.abs(sum - 1.0) <= tolerance;
}

/**
 * Normalize probabilities to sum to 1.0
 */
export function normalizeDistribution(items: Item[]): Item[] {
  const sum = items.reduce((acc, item) => acc + item.probability, 0);
  if (sum === 0) {
    // Uniform distribution if all zeros
    const uniform = 1.0 / items.length;
    return items.map(item => ({ ...item, probability: uniform }));
  }
  return items.map(item => ({
    ...item,
    probability: item.probability / sum,
  }));
}

/**
 * Sort items descending by probability
 */
export function sortByProbability(items: Item[]): Item[] {
  return [...items].sort((a, b) => b.probability - a.probability);
}
