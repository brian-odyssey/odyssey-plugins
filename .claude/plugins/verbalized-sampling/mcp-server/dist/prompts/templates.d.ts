/**
 * Verbalized Sampling prompt templates
 */
import type { VSGenerateDomain } from '../types/distribution.js';
export interface PromptConfig {
    k: number;
    tau: number;
    prompt: string;
    context?: string;
}
/**
 * Core VS prompt template
 */
export declare function buildVSPrompt(config: PromptConfig, domain: VSGenerateDomain): string;
/**
 * System prompt for VS generation
 */
export declare const VS_SYSTEM_PROMPT = "You are an expert at generating diverse, probability-weighted options using Verbalized Sampling.\n\nYour goal is to help users explore solution spaces by generating multiple distinct approaches with honest probability estimates.\n\nKey principles:\n1. DIVERSITY: Each option should be genuinely different, not a variation\n2. HONESTY: Probability estimates should reflect real uncertainty\n3. CONSTRAINT: Respect the tau (max probability) constraint to force diversity\n4. TAILS: Always include non-obvious options from the \"tails\" of the distribution\n\nYou always return valid JSON in the specified format.";
//# sourceMappingURL=templates.d.ts.map