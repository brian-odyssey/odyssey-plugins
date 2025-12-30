/**
 * vs_select tool - Select items from a distribution
 */

import type { VSSelectParams, VSSelectResult, DiscreteDist, Item } from '../types/distribution.js';
import { normalizeDistribution, sortByProbability } from '../types/distribution.js';
import { getDistribution, storeDistribution } from './generate.js';

/**
 * Select specific items from a distribution
 */
export function selectFromDistribution(params: VSSelectParams): VSSelectResult {
  const distribution = getDistribution(params.distribution_id);

  if (!distribution) {
    throw new Error(`Distribution not found: ${params.distribution_id}`);
  }

  // Validate indices
  const validIndices = params.indices.filter(
    (i) => i >= 0 && i < distribution.items.length
  );

  if (validIndices.length === 0) {
    throw new Error('No valid indices provided');
  }

  // Get selected items
  const selected: Item[] = validIndices.map((i) => distribution.items[i]);

  // Calculate remaining items (if needed)
  const remainingItems = distribution.items.filter(
    (_, i) => !validIndices.includes(i)
  );

  let remaining: DiscreteDist | undefined;

  if (remainingItems.length > 0) {
    // Renormalize remaining
    const renormalized = normalizeDistribution(remainingItems);
    const sorted = sortByProbability(renormalized);

    remaining = {
      ...distribution,
      id: `${distribution.id}-remaining`,
      items: sorted,
    };

    // Store the remaining distribution for later retrieval
    storeDistribution(remaining);
  }

  return { selected, remaining };
}

/**
 * Get the top-k items from a distribution
 */
export function getTopK(distributionId: string, k: number): Item[] {
  const distribution = getDistribution(distributionId);

  if (!distribution) {
    throw new Error(`Distribution not found: ${distributionId}`);
  }

  // Items are already sorted by probability (descending)
  return distribution.items.slice(0, Math.min(k, distribution.items.length));
}

/**
 * Filter items by minimum probability threshold
 */
export function filterByProbability(
  distributionId: string,
  minProbability: number
): Item[] {
  const distribution = getDistribution(distributionId);

  if (!distribution) {
    throw new Error(`Distribution not found: ${distributionId}`);
  }

  return distribution.items.filter((item) => item.probability >= minProbability);
}
