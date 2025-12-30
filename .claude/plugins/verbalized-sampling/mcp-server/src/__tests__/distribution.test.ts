/**
 * Tests for distribution type utilities
 */

import {
  validateProbability,
  validateDistribution,
  normalizeDistribution,
  sortByProbability,
} from '../types/distribution.js';
import type { Item } from '../types/distribution.js';

describe('validateProbability', () => {
  it('should accept valid probabilities', () => {
    expect(validateProbability(0)).toBe(true);
    expect(validateProbability(0.5)).toBe(true);
    expect(validateProbability(1)).toBe(true);
  });

  it('should reject negative probabilities', () => {
    expect(validateProbability(-0.1)).toBe(false);
    expect(validateProbability(-1)).toBe(false);
  });

  it('should reject probabilities over 1', () => {
    expect(validateProbability(1.1)).toBe(false);
    expect(validateProbability(2)).toBe(false);
  });
});

describe('validateDistribution', () => {
  it('should accept normalized distribution', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.5 },
      { text: 'B', probability: 0.3 },
      { text: 'C', probability: 0.2 },
    ];
    expect(validateDistribution(items)).toBe(true);
  });

  it('should accept distribution within tolerance', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.505 },
      { text: 'B', probability: 0.495 },
    ];
    expect(validateDistribution(items, 0.01)).toBe(true);
  });

  it('should reject distribution outside tolerance', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.4 },
      { text: 'B', probability: 0.4 },
    ];
    expect(validateDistribution(items, 0.01)).toBe(false);
  });

  it('should handle single item', () => {
    const items: Item[] = [{ text: 'A', probability: 1.0 }];
    expect(validateDistribution(items)).toBe(true);
  });
});

describe('normalizeDistribution', () => {
  it('should normalize probabilities to sum to 1', () => {
    const items: Item[] = [
      { text: 'A', probability: 2 },
      { text: 'B', probability: 3 },
      { text: 'C', probability: 5 },
    ];
    const result = normalizeDistribution(items);
    const sum = result.reduce((acc, item) => acc + item.probability, 0);
    expect(sum).toBeCloseTo(1.0);
  });

  it('should preserve relative proportions', () => {
    const items: Item[] = [
      { text: 'A', probability: 2 },
      { text: 'B', probability: 4 },
    ];
    const result = normalizeDistribution(items);
    expect(result[0].probability).toBeCloseTo(0.333, 2);
    expect(result[1].probability).toBeCloseTo(0.667, 2);
  });

  it('should create uniform distribution for all zeros', () => {
    const items: Item[] = [
      { text: 'A', probability: 0 },
      { text: 'B', probability: 0 },
      { text: 'C', probability: 0 },
    ];
    const result = normalizeDistribution(items);
    expect(result[0].probability).toBeCloseTo(0.333, 2);
    expect(result[1].probability).toBeCloseTo(0.333, 2);
    expect(result[2].probability).toBeCloseTo(0.333, 2);
  });

  it('should preserve item metadata', () => {
    const items: Item[] = [
      { text: 'A', probability: 1, rationale: 'Reason', tradeoffs: ['X'] },
    ];
    const result = normalizeDistribution(items);
    expect(result[0].rationale).toBe('Reason');
    expect(result[0].tradeoffs).toEqual(['X']);
  });
});

describe('sortByProbability', () => {
  it('should sort descending by probability', () => {
    const items: Item[] = [
      { text: 'Low', probability: 0.1 },
      { text: 'High', probability: 0.5 },
      { text: 'Medium', probability: 0.3 },
    ];
    const result = sortByProbability(items);
    expect(result[0].text).toBe('High');
    expect(result[1].text).toBe('Medium');
    expect(result[2].text).toBe('Low');
  });

  it('should not mutate original array', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.1 },
      { text: 'B', probability: 0.5 },
    ];
    const original = items[0].text;
    sortByProbability(items);
    expect(items[0].text).toBe(original);
  });

  it('should handle equal probabilities', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.5 },
      { text: 'B', probability: 0.5 },
    ];
    const result = sortByProbability(items);
    expect(result).toHaveLength(2);
  });

  it('should handle single item', () => {
    const items: Item[] = [{ text: 'A', probability: 1.0 }];
    const result = sortByProbability(items);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('A');
  });
});
