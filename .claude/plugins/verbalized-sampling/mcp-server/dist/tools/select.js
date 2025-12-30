"use strict";
/**
 * vs_select tool - Select items from a distribution
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectFromDistribution = selectFromDistribution;
exports.getTopK = getTopK;
exports.filterByProbability = filterByProbability;
const distribution_js_1 = require("../types/distribution.js");
const generate_js_1 = require("./generate.js");
/**
 * Select specific items from a distribution
 */
function selectFromDistribution(params) {
    const distribution = (0, generate_js_1.getDistribution)(params.distribution_id);
    if (!distribution) {
        throw new Error(`Distribution not found: ${params.distribution_id}`);
    }
    // Validate indices
    const validIndices = params.indices.filter((i) => i >= 0 && i < distribution.items.length);
    if (validIndices.length === 0) {
        throw new Error('No valid indices provided');
    }
    // Get selected items
    const selected = validIndices.map((i) => distribution.items[i]);
    // Calculate remaining items (if needed)
    const remainingItems = distribution.items.filter((_, i) => !validIndices.includes(i));
    let remaining;
    if (remainingItems.length > 0) {
        // Renormalize remaining
        const renormalized = (0, distribution_js_1.normalizeDistribution)(remainingItems);
        const sorted = (0, distribution_js_1.sortByProbability)(renormalized);
        remaining = {
            ...distribution,
            id: `${distribution.id}-remaining`,
            items: sorted,
        };
        // Store the remaining distribution for later retrieval
        (0, generate_js_1.storeDistribution)(remaining);
    }
    return { selected, remaining };
}
/**
 * Get the top-k items from a distribution
 */
function getTopK(distributionId, k) {
    const distribution = (0, generate_js_1.getDistribution)(distributionId);
    if (!distribution) {
        throw new Error(`Distribution not found: ${distributionId}`);
    }
    // Items are already sorted by probability (descending)
    return distribution.items.slice(0, Math.min(k, distribution.items.length));
}
/**
 * Filter items by minimum probability threshold
 */
function filterByProbability(distributionId, minProbability) {
    const distribution = (0, generate_js_1.getDistribution)(distributionId);
    if (!distribution) {
        throw new Error(`Distribution not found: ${distributionId}`);
    }
    return distribution.items.filter((item) => item.probability >= minProbability);
}
//# sourceMappingURL=select.js.map