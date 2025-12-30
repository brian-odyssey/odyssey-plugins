/**
 * vs_select tool - Select items from a distribution
 */
import type { VSSelectParams, VSSelectResult, Item } from '../types/distribution.js';
/**
 * Select specific items from a distribution
 */
export declare function selectFromDistribution(params: VSSelectParams): VSSelectResult;
/**
 * Get the top-k items from a distribution
 */
export declare function getTopK(distributionId: string, k: number): Item[];
/**
 * Filter items by minimum probability threshold
 */
export declare function filterByProbability(distributionId: string, minProbability: number): Item[];
//# sourceMappingURL=select.d.ts.map