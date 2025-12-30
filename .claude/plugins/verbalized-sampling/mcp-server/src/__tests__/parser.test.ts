/**
 * Tests for parser utilities
 */

import {
  parseVSResponse,
  validateTauConstraint,
  applyTauConstraint,
  formatDistribution,
} from '../utils/parser.js';
import type { Item } from '../types/distribution.js';

describe('parseVSResponse', () => {
  it('should parse valid JSON response', () => {
    const response = `{
      "items": [
        { "text": "Option A", "probability": 0.4, "rationale": "Good approach" },
        { "text": "Option B", "probability": 0.3 }
      ]
    }`;
    const result = parseVSResponse(response);
    expect(result.success).toBe(true);
    expect(result.items).toHaveLength(2);
    expect(result.items![0].text).toBe('Option A');
    expect(result.items![0].rationale).toBe('Good approach');
  });

  it('should extract JSON from surrounding text', () => {
    const response = `Here are the options:
    {
      "items": [
        { "text": "Solution", "probability": 0.5 }
      ]
    }
    Let me know if you need more!`;
    const result = parseVSResponse(response);
    expect(result.success).toBe(true);
    expect(result.items).toHaveLength(1);
  });

  it('should fail when no JSON found', () => {
    const response = 'This is just text with no JSON';
    const result = parseVSResponse(response);
    expect(result.success).toBe(false);
    expect(result.error).toContain('No JSON object found');
  });

  it('should fail when items array is missing', () => {
    const response = '{ "options": [{ "text": "A", "probability": 0.5 }] }';
    const result = parseVSResponse(response);
    expect(result.success).toBe(false);
    expect(result.error).toContain('missing "items" array');
  });

  it('should fail when text is missing', () => {
    const response = '{ "items": [{ "probability": 0.5 }] }';
    const result = parseVSResponse(response);
    expect(result.success).toBe(false);
    expect(result.error).toContain('missing or empty "text"');
  });

  it('should fail when probability is invalid', () => {
    const response = '{ "items": [{ "text": "Test", "probability": "high" }] }';
    const result = parseVSResponse(response);
    expect(result.success).toBe(false);
    expect(result.error).toContain('invalid "probability"');
  });

  it('should clamp probability to valid range', () => {
    const response = `{
      "items": [
        { "text": "Over", "probability": 1.5 },
        { "text": "Under", "probability": -0.2 }
      ]
    }`;
    const result = parseVSResponse(response);
    expect(result.success).toBe(true);
    expect(result.items![0].probability).toBe(1);
    expect(result.items![1].probability).toBe(0);
  });

  it('should handle tradeoffs array', () => {
    const response = `{
      "items": [
        { "text": "Test", "probability": 0.5, "tradeoffs": ["Pro: fast", "Con: complex"] }
      ]
    }`;
    const result = parseVSResponse(response);
    expect(result.success).toBe(true);
    expect(result.items![0].tradeoffs).toEqual(['Pro: fast', 'Con: complex']);
  });

  it('should filter non-string tradeoffs', () => {
    const response = `{
      "items": [
        { "text": "Test", "probability": 0.5, "tradeoffs": ["Valid", 123, null, "Also valid"] }
      ]
    }`;
    const result = parseVSResponse(response);
    expect(result.success).toBe(true);
    expect(result.items![0].tradeoffs).toEqual(['Valid', 'Also valid']);
  });

  it('should fail on empty items array', () => {
    const response = '{ "items": [] }';
    const result = parseVSResponse(response);
    expect(result.success).toBe(false);
    expect(result.error).toContain('No valid items found');
  });

  it('should handle malformed JSON', () => {
    const response = '{ "items": [{ text: broken }] }';
    const result = parseVSResponse(response);
    expect(result.success).toBe(false);
    expect(result.error).toContain('JSON parse error');
  });
});

describe('validateTauConstraint', () => {
  it('should return valid when all items under tau', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.08 },
      { text: 'B', probability: 0.07 },
    ];
    const result = validateTauConstraint(items, 0.10);
    expect(result.valid).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('should detect violations', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.15 },
      { text: 'B', probability: 0.08 },
      { text: 'C', probability: 0.20 },
    ];
    const result = validateTauConstraint(items, 0.10);
    expect(result.valid).toBe(false);
    expect(result.violations).toEqual([0, 2]);
  });

  it('should handle exact tau value', () => {
    const items: Item[] = [{ text: 'A', probability: 0.10 }];
    const result = validateTauConstraint(items, 0.10);
    expect(result.valid).toBe(true);
  });
});

describe('applyTauConstraint', () => {
  it('should clamp probabilities to tau', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.5 },
      { text: 'B', probability: 0.3 },
      { text: 'C', probability: 0.2 },
    ];
    const result = applyTauConstraint(items, 0.10);

    // All should be clamped and renormalized
    for (const item of result) {
      expect(item.probability).toBeLessThanOrEqual(0.34); // 0.1/0.3 = 0.333
    }
  });

  it('should renormalize after clamping', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.5 },
      { text: 'B', probability: 0.5 },
    ];
    const result = applyTauConstraint(items, 0.10);
    const sum = result.reduce((acc, item) => acc + item.probability, 0);
    expect(sum).toBeCloseTo(1.0);
  });

  it('should handle all-zero distribution', () => {
    const items: Item[] = [
      { text: 'A', probability: 0 },
      { text: 'B', probability: 0 },
    ];
    const result = applyTauConstraint(items, 0.10);
    expect(result[0].probability).toBeCloseTo(0.5);
    expect(result[1].probability).toBeCloseTo(0.5);
  });

  it('should preserve item metadata', () => {
    const items: Item[] = [
      { text: 'Test', probability: 0.5, rationale: 'Because', tradeoffs: ['A'] },
    ];
    const result = applyTauConstraint(items, 0.10);
    expect(result[0].rationale).toBe('Because');
    expect(result[0].tradeoffs).toEqual(['A']);
  });
});

describe('formatDistribution', () => {
  it('should format basic items', () => {
    const items: Item[] = [
      { text: 'Option A', probability: 0.5 },
      { text: 'Option B', probability: 0.3 },
    ];
    const result = formatDistribution(items);
    expect(result).toContain('1. [p=0.50] Option A');
    expect(result).toContain('2. [p=0.30] Option B');
  });

  it('should include rationale when present', () => {
    const items: Item[] = [
      { text: 'Test', probability: 0.5, rationale: 'Good reason' },
    ];
    const result = formatDistribution(items);
    expect(result).toContain('Rationale: Good reason');
  });

  it('should include tradeoffs when present', () => {
    const items: Item[] = [
      { text: 'Test', probability: 0.5, tradeoffs: ['Pro: fast', 'Con: complex'] },
    ];
    const result = formatDistribution(items);
    expect(result).toContain('Tradeoffs: Pro: fast; Con: complex');
  });

  it('should handle empty array', () => {
    const result = formatDistribution([]);
    expect(result).toBe('');
  });
});
