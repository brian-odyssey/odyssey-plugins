/**
 * Tests for sampling utilities
 */

import { weightedSample, argmax, sampleMultiple } from '../utils/sampler.js';
import type { Item } from '../types/distribution.js';

describe('weightedSample', () => {
  const items: Item[] = [
    { text: 'Option A', probability: 0.5 },
    { text: 'Option B', probability: 0.3 },
    { text: 'Option C', probability: 0.2 },
  ];

  it('should throw error for empty distribution', () => {
    expect(() => weightedSample([])).toThrow('Cannot sample from empty distribution');
  });

  it('should return valid item and index', () => {
    const result = weightedSample(items, 42);
    expect(result.item).toBeDefined();
    expect(result.index).toBeGreaterThanOrEqual(0);
    expect(result.index).toBeLessThan(items.length);
    expect(result.item).toBe(items[result.index]);
  });

  it('should produce consistent results with same seed', () => {
    const result1 = weightedSample(items, 12345);
    const result2 = weightedSample(items, 12345);
    expect(result1.index).toBe(result2.index);
    expect(result1.item.text).toBe(result2.item.text);
  });

  it('should produce different results with different seeds', () => {
    // Try multiple seed pairs to find different results
    const results: number[] = [];
    for (let seed = 0; seed < 100; seed++) {
      results.push(weightedSample(items, seed).index);
    }
    // Should have some variation (not all same index)
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('should handle single item distribution', () => {
    const single: Item[] = [{ text: 'Only option', probability: 1.0 }];
    const result = weightedSample(single);
    expect(result.index).toBe(0);
    expect(result.item.text).toBe('Only option');
  });

  it('should handle non-normalized distribution', () => {
    const nonNormalized: Item[] = [
      { text: 'A', probability: 0.2 },
      { text: 'B', probability: 0.2 },
    ];
    const result = weightedSample(nonNormalized, 42);
    expect(result.item).toBeDefined();
  });
});

describe('argmax', () => {
  it('should throw error for empty distribution', () => {
    expect(() => argmax([])).toThrow('Cannot get argmax from empty distribution');
  });

  it('should return highest probability item', () => {
    const items: Item[] = [
      { text: 'Low', probability: 0.1 },
      { text: 'High', probability: 0.6 },
      { text: 'Medium', probability: 0.3 },
    ];
    const result = argmax(items);
    expect(result.index).toBe(1);
    expect(result.item.text).toBe('High');
  });

  it('should return first item when all equal', () => {
    const items: Item[] = [
      { text: 'A', probability: 0.33 },
      { text: 'B', probability: 0.33 },
      { text: 'C', probability: 0.33 },
    ];
    const result = argmax(items);
    expect(result.index).toBe(0);
  });

  it('should handle single item', () => {
    const items: Item[] = [{ text: 'Only', probability: 1.0 }];
    const result = argmax(items);
    expect(result.index).toBe(0);
    expect(result.item.text).toBe('Only');
  });
});

describe('sampleMultiple', () => {
  const items: Item[] = [
    { text: 'A', probability: 0.4 },
    { text: 'B', probability: 0.3 },
    { text: 'C', probability: 0.2 },
    { text: 'D', probability: 0.1 },
  ];

  it('should throw error when n > items.length', () => {
    expect(() => sampleMultiple(items, 5)).toThrow(
      'Cannot sample 5 items from distribution of size 4'
    );
  });

  it('should return correct number of items', () => {
    const result = sampleMultiple(items, 2, 42);
    expect(result.items.length).toBe(2);
    expect(result.indices.length).toBe(2);
  });

  it('should return unique items (no replacement)', () => {
    const result = sampleMultiple(items, 3, 42);
    const uniqueIndices = new Set(result.indices);
    expect(uniqueIndices.size).toBe(3);
  });

  it('should return all items when n equals length', () => {
    const result = sampleMultiple(items, 4, 42);
    expect(result.items.length).toBe(4);
    const uniqueIndices = new Set(result.indices);
    expect(uniqueIndices.size).toBe(4);
  });

  it('should produce consistent results with same seed', () => {
    const result1 = sampleMultiple(items, 2, 99);
    const result2 = sampleMultiple(items, 2, 99);
    expect(result1.indices).toEqual(result2.indices);
  });
});
