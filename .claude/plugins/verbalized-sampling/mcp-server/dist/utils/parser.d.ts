/**
 * Response parsing utilities for Verbalized Sampling
 */
import type { Item } from '../types/distribution.js';
export interface ParseResult {
    success: boolean;
    items?: Item[];
    error?: string;
}
/**
 * Parse LLM response into Item array
 */
export declare function parseVSResponse(response: string): ParseResult;
/**
 * Validate items against tau constraint
 */
export declare function validateTauConstraint(items: Item[], tau: number): {
    valid: boolean;
    violations: number[];
};
/**
 * Apply tau constraint by clamping and renormalizing
 */
export declare function applyTauConstraint(items: Item[], tau: number): Item[];
/**
 * Format distribution for display
 */
export declare function formatDistribution(items: Item[]): string;
//# sourceMappingURL=parser.d.ts.map