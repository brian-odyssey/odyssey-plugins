"use strict";
/**
 * Sampling utilities for Verbalized Sampling distributions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.weightedSample = weightedSample;
exports.argmax = argmax;
exports.sampleMultiple = sampleMultiple;
/**
 * Weighted random sampling from a distribution
 *
 * @param items - Items with probabilities
 * @param seed - Optional seed for reproducibility
 * @returns The sampled item and its index
 */
function weightedSample(items, seed) {
    if (items.length === 0) {
        throw new Error('Cannot sample from empty distribution');
    }
    // Use seeded random if seed provided
    const random = seed !== undefined ? seededRandom(seed) : Math.random();
    // Calculate cumulative probabilities
    const cumulative = [];
    let sum = 0;
    for (const item of items) {
        sum += item.probability;
        cumulative.push(sum);
    }
    // Normalize random to the actual sum (handles non-normalized distributions)
    const target = random * sum;
    // Find the item
    for (let i = 0; i < cumulative.length; i++) {
        if (target <= cumulative[i]) {
            return { item: items[i], index: i };
        }
    }
    // Fallback to last item (shouldn't happen with valid distributions)
    return { item: items[items.length - 1], index: items.length - 1 };
}
/**
 * Simple seeded random number generator (Mulberry32)
 */
function seededRandom(seed) {
    let t = seed + 0x6d2b79f5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
/**
 * Get argmax (highest probability item)
 */
function argmax(items) {
    if (items.length === 0) {
        throw new Error('Cannot get argmax from empty distribution');
    }
    let maxIndex = 0;
    let maxProb = items[0].probability;
    for (let i = 1; i < items.length; i++) {
        if (items[i].probability > maxProb) {
            maxProb = items[i].probability;
            maxIndex = i;
        }
    }
    return { item: items[maxIndex], index: maxIndex };
}
/**
 * Sample multiple items without replacement
 */
function sampleMultiple(items, n, seed) {
    if (n > items.length) {
        throw new Error(`Cannot sample ${n} items from distribution of size ${items.length}`);
    }
    const result = [];
    const indices = [];
    const remaining = [...items];
    const remainingIndices = items.map((_, i) => i);
    for (let i = 0; i < n; i++) {
        // Renormalize remaining items
        const sum = remaining.reduce((acc, item) => acc + item.probability, 0);
        const normalized = remaining.map(item => ({
            ...item,
            probability: item.probability / sum,
        }));
        // Sample one
        const { index: localIndex } = weightedSample(normalized, seed !== undefined ? seed + i : undefined);
        result.push(remaining[localIndex]);
        indices.push(remainingIndices[localIndex]);
        // Remove sampled item
        remaining.splice(localIndex, 1);
        remainingIndices.splice(localIndex, 1);
    }
    return { items: result, indices };
}
//# sourceMappingURL=sampler.js.map