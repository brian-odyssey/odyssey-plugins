"use strict";
/**
 * Response parsing utilities for Verbalized Sampling
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseVSResponse = parseVSResponse;
exports.validateTauConstraint = validateTauConstraint;
exports.applyTauConstraint = applyTauConstraint;
exports.formatDistribution = formatDistribution;
/**
 * Parse LLM response into Item array
 */
function parseVSResponse(response) {
    try {
        // Try to extract JSON from the response
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            return { success: false, error: 'No JSON object found in response' };
        }
        const parsed = JSON.parse(jsonMatch[0]);
        // Validate structure
        if (!parsed.items || !Array.isArray(parsed.items)) {
            return { success: false, error: 'Response missing "items" array' };
        }
        // Validate and clean each item
        const items = [];
        for (let i = 0; i < parsed.items.length; i++) {
            const raw = parsed.items[i];
            // Validate required fields
            if (typeof raw.text !== 'string' || raw.text.trim() === '') {
                return { success: false, error: `Item ${i}: missing or empty "text"` };
            }
            if (typeof raw.probability !== 'number' || isNaN(raw.probability)) {
                return { success: false, error: `Item ${i}: invalid "probability"` };
            }
            // Clamp probability to valid range
            const probability = Math.max(0, Math.min(1, raw.probability));
            items.push({
                text: raw.text.trim(),
                probability,
                rationale: typeof raw.rationale === 'string' ? raw.rationale.trim() : undefined,
                tradeoffs: Array.isArray(raw.tradeoffs)
                    ? raw.tradeoffs.filter((t) => typeof t === 'string')
                    : undefined,
            });
        }
        if (items.length === 0) {
            return { success: false, error: 'No valid items found in response' };
        }
        return { success: true, items };
    }
    catch (err) {
        return {
            success: false,
            error: `JSON parse error: ${err instanceof Error ? err.message : String(err)}`
        };
    }
}
/**
 * Validate items against tau constraint
 */
function validateTauConstraint(items, tau) {
    const violations = [];
    for (let i = 0; i < items.length; i++) {
        if (items[i].probability > tau) {
            violations.push(i);
        }
    }
    return {
        valid: violations.length === 0,
        violations,
    };
}
/**
 * Apply tau constraint by clamping and renormalizing
 */
function applyTauConstraint(items, tau) {
    // Clamp all probabilities to tau
    const clamped = items.map(item => ({
        ...item,
        probability: Math.min(item.probability, tau),
    }));
    // Renormalize
    const sum = clamped.reduce((acc, item) => acc + item.probability, 0);
    if (sum === 0) {
        // All zeros - use uniform
        const uniform = 1.0 / clamped.length;
        return clamped.map(item => ({ ...item, probability: uniform }));
    }
    return clamped.map(item => ({
        ...item,
        probability: item.probability / sum,
    }));
}
/**
 * Format distribution for display
 */
function formatDistribution(items) {
    const lines = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const probBadge = `[p=${item.probability.toFixed(2)}]`;
        lines.push(`${i + 1}. ${probBadge} ${item.text}`);
        if (item.rationale) {
            lines.push(`   Rationale: ${item.rationale}`);
        }
        if (item.tradeoffs && item.tradeoffs.length > 0) {
            lines.push(`   Tradeoffs: ${item.tradeoffs.join('; ')}`);
        }
        lines.push('');
    }
    return lines.join('\n');
}
//# sourceMappingURL=parser.js.map