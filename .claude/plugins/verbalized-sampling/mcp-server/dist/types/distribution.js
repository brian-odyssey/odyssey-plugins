"use strict";
/**
 * Core types for Verbalized Sampling distributions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProbability = validateProbability;
exports.validateDistribution = validateDistribution;
exports.normalizeDistribution = normalizeDistribution;
exports.sortByProbability = sortByProbability;
/**
 * Validate that probabilities are in valid range
 */
function validateProbability(p) {
    return p >= 0 && p <= 1;
}
/**
 * Validate that probabilities sum to approximately 1.0
 */
function validateDistribution(items, tolerance = 0.01) {
    const sum = items.reduce((acc, item) => acc + item.probability, 0);
    return Math.abs(sum - 1.0) <= tolerance;
}
/**
 * Normalize probabilities to sum to 1.0
 */
function normalizeDistribution(items) {
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
function sortByProbability(items) {
    return [...items].sort((a, b) => b.probability - a.probability);
}
//# sourceMappingURL=distribution.js.map