/**
 * vs_sample tool - Sample from a distribution
 */

import type { VSSampleParams, VSSampleResult } from '../types/distribution.js';
import { getDistribution } from './generate.js';
import { weightedSample, argmax, sampleMultiple } from '../utils/sampler.js';

/**
 * Sample a single item from a distribution
 */
export function sampleFromDistribution(params: VSSampleParams): VSSampleResult {
  const distribution = getDistribution(params.distribution_id);

  if (!distribution) {
    throw new Error(`Distribution not found: ${params.distribution_id}`);
  }

  if (distribution.items.length === 0) {
    throw new Error('Cannot sample from empty distribution');
  }

  const result = weightedSample(distribution.items, params.seed);

  return {
    item: result.item,
    index: result.index,
  };
}

/**
 * Get the highest probability item (argmax)
 */
export function getArgmax(distributionId: string): VSSampleResult {
  const distribution = getDistribution(distributionId);

  if (!distribution) {
    throw new Error(`Distribution not found: ${distributionId}`);
  }

  if (distribution.items.length === 0) {
    throw new Error('Cannot get argmax from empty distribution');
  }

  const result = argmax(distribution.items);

  return {
    item: result.item,
    index: result.index,
  };
}

/**
 * Sample multiple items without replacement
 */
export function sampleMultipleFromDistribution(
  distributionId: string,
  n: number,
  seed?: number
): { items: VSSampleResult[] } {
  const distribution = getDistribution(distributionId);

  if (!distribution) {
    throw new Error(`Distribution not found: ${distributionId}`);
  }

  const result = sampleMultiple(distribution.items, n, seed);

  return {
    items: result.items.map((item, i) => ({
      item,
      index: result.indices[i],
    })),
  };
}
