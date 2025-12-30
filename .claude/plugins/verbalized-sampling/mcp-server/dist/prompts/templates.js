"use strict";
/**
 * Verbalized Sampling prompt templates
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VS_SYSTEM_PROMPT = void 0;
exports.buildVSPrompt = buildVSPrompt;
/**
 * Core VS prompt template
 */
function buildVSPrompt(config, domain) {
    const { k, tau, prompt, context } = config;
    const domainGuidance = getDomainGuidance(domain);
    const contextSection = context ? `\n\nAdditional Context:\n${context}` : '';
    return `Generate ${k} distinct approaches to the following problem/question. For each approach:

1. **text**: A clear description of the approach/solution
2. **probability**: Your estimated probability that this is the optimal approach (MUST be less than ${tau})
3. **rationale**: Brief explanation for your probability estimate
4. **tradeoffs**: Key pros and cons (as an array of strings)

${domainGuidance}

**Critical Constraints:**
- Each probability MUST be less than ${tau} - this forces diversity
- Generate genuinely different approaches, not variations of the same idea
- Include at least one unconventional/"tail" option that might be overlooked
- Probabilities should reflect your genuine uncertainty

Return ONLY valid JSON in this exact format:
{
  "items": [
    {
      "text": "Description of approach 1",
      "probability": 0.08,
      "rationale": "Why this probability",
      "tradeoffs": ["Pro: ...", "Con: ..."]
    },
    ...
  ]
}

Problem/Question: ${prompt}${contextSection}`;
}
/**
 * Domain-specific guidance for prompts
 */
function getDomainGuidance(domain) {
    switch (domain) {
        case 'architecture':
            return `**Domain: System Architecture**
Focus on:
- Different architectural patterns (monolith, microservices, serverless, etc.)
- Scalability vs simplicity tradeoffs
- Technology stack variations
- Deployment and operational considerations
- Include at least one "boring technology" option and one cutting-edge option`;
        case 'creative':
            return `**Domain: Creative/Brainstorming**
Focus on:
- Genuinely novel and unexpected ideas
- Cross-domain inspiration
- Both practical and ambitious options
- "Yes, and..." building on concepts
- Include at least one wild/unconventional idea`;
        case 'code':
            return `**Domain: Code/Implementation**
Focus on:
- Different implementation approaches
- Algorithm and data structure choices
- Library/framework options
- Testing and maintainability considerations
- Include options across complexity spectrum`;
        case 'general':
        default:
            return `**Domain: General Exploration**
Focus on:
- Diverse approaches from different angles
- Both conventional and unconventional options
- Practical vs theoretical tradeoffs
- Short-term vs long-term considerations`;
    }
}
/**
 * System prompt for VS generation
 */
exports.VS_SYSTEM_PROMPT = `You are an expert at generating diverse, probability-weighted options using Verbalized Sampling.

Your goal is to help users explore solution spaces by generating multiple distinct approaches with honest probability estimates.

Key principles:
1. DIVERSITY: Each option should be genuinely different, not a variation
2. HONESTY: Probability estimates should reflect real uncertainty
3. CONSTRAINT: Respect the tau (max probability) constraint to force diversity
4. TAILS: Always include non-obvious options from the "tails" of the distribution

You always return valid JSON in the specified format.`;
//# sourceMappingURL=templates.js.map