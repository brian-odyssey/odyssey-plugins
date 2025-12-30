"use strict";
/**
 * vs_sample tool - Sample from a distribution
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.sampleFromDistribution = sampleFromDistribution;
exports.getArgmax = getArgmax;
exports.sampleMultipleFromDistribution = sampleMultipleFromDistribution;
const generate_js_1 = require("./generate.js");
const sampler_js_1 = require("../utils/sampler.js");
/**
 * Sample a single item from a distribution
 */
function sampleFromDistribution(params) {
    const distribution = (0, generate_js_1.getDistribution)(params.distribution_id);
    if (!distribution) {
        throw new Error(`Distribution not found: ${params.distribution_id}`);
    }
    if (distribution.items.length === 0) {
        throw new Error('Cannot sample from empty distribution');
    }
    const result = (0, sampler_js_1.weightedSample)(distribution.items, params.seed);
    return {
        item: result.item,
        index: result.index,
    };
}
/**
 * Get the highest probability item (argmax)
 */
function getArgmax(distributionId) {
    const distribution = (0, generate_js_1.getDistribution)(distributionId);
    if (!distribution) {
        throw new Error(`Distribution not found: ${distributionId}`);
    }
    if (distribution.items.length === 0) {
        throw new Error('Cannot get argmax from empty distribution');
    }
    const result = (0, sampler_js_1.argmax)(distribution.items);
    return {
        item: result.item,
        index: result.index,
    };
}
/**
 * Sample multiple items without replacement
 */
function sampleMultipleFromDistribution(distributionId, n, seed) {
    const distribution = (0, generate_js_1.getDistribution)(distributionId);
    if (!distribution) {
        throw new Error(`Distribution not found: ${distributionId}`);
    }
    const result = (0, sampler_js_1.sampleMultiple)(distribution.items, n, seed);
    return {
        items: result.items.map((item, i) => ({
            item,
            index: result.indices[i],
        })),
    };
}
//# sourceMappingURL=sample.js.map