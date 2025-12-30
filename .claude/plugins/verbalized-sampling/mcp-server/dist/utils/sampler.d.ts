/**
 * Sampling utilities for Verbalized Sampling distributions
 */
import type { Item } from '../types/distribution.js';
/**
 * Weighted random sampling from a distribution
 *
 * @param items - Items with probabilities
 * @param seed - Optional seed for reproducibility
 * @returns The sampled item and its index
 */
export declare function weightedSample(items: Item[], seed?: number): {
    item: Item;
    index: number;
};
/**
 * Get argmax (highest probability item)
 */
export declare function argmax(items: Item[]): {
    item: Item;
    index: number;
};
/**
 * Sample multiple items without replacement
 */
export declare function sampleMultiple(items: Item[], n: number, seed?: number): {
    items: Item[];
    indices: number[];
};
//# sourceMappingURL=sampler.d.ts.map