/**
 * vs_sample tool - Sample from a distribution
 */
import type { VSSampleParams, VSSampleResult } from '../types/distribution.js';
/**
 * Sample a single item from a distribution
 */
export declare function sampleFromDistribution(params: VSSampleParams): VSSampleResult;
/**
 * Get the highest probability item (argmax)
 */
export declare function getArgmax(distributionId: string): VSSampleResult;
/**
 * Sample multiple items without replacement
 */
export declare function sampleMultipleFromDistribution(distributionId: string, n: number, seed?: number): {
    items: VSSampleResult[];
};
//# sourceMappingURL=sample.d.ts.map