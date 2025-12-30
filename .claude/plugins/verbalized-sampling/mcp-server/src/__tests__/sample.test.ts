/**
 * Tests for sample tool functions
 */

import {
  sampleFromDistribution,
  getArgmax,
  sampleMultipleFromDistribution,
} from '../tools/sample.js';
import { processVSResponse, clearDistributions } from '../tools/generate.js';

// Helper to create a test distribution
function createTestDistribution() {
  const response = JSON.stringify({
    items: [
      { text: 'High', probability: 0.5 },
      { text: 'Medium', probability: 0.3 },
      { text: 'Low', probability: 0.2 },
    ],
  });
  return processVSResponse(
    response,
    'Test prompt',
    { k: 3, tau: 0.60, domain: 'general' },
    'claude-3',
    Date.now()
  );
}

describe('sampleFromDistribution', () => {
  beforeEach(() => {
    clearDistributions();
  });

  it('should sample a valid item', () => {
    const dist = createTestDistribution();
    const result = sampleFromDistribution({
      distribution_id: dist.distribution.id,
      seed: 42,
    });

    expect(result.item).toBeDefined();
    expect(result.index).toBeGreaterThanOrEqual(0);
    expect(result.index).toBeLessThan(3);
    expect(result.item).toEqual(dist.distribution.items[result.index]);
  });

  it('should throw for non-existent distribution', () => {
    expect(() =>
      sampleFromDistribution({
        distribution_id: 'fake-id',
      })
    ).toThrow('Distribution not found');
  });

  it('should produce consistent results with same seed', () => {
    const dist = createTestDistribution();
    const result1 = sampleFromDistribution({
      distribution_id: dist.distribution.id,
      seed: 12345,
    });
    const result2 = sampleFromDistribution({
      distribution_id: dist.distribution.id,
      seed: 12345,
    });

    expect(result1.index).toBe(result2.index);
    expect(result1.item.text).toBe(result2.item.text);
  });

  it('should produce different results with different seeds', () => {
    const dist = createTestDistribution();
    const results: number[] = [];

    for (let seed = 0; seed < 50; seed++) {
      const result = sampleFromDistribution({
        distribution_id: dist.distribution.id,
        seed,
      });
      results.push(result.index);
    }

    // Should have some variation
    const unique = new Set(results);
    expect(unique.size).toBeGreaterThan(1);
  });
});

describe('getArgmax', () => {
  beforeEach(() => {
    clearDistributions();
  });

  it('should return highest probability item', () => {
    const dist = createTestDistribution();
    const result = getArgmax(dist.distribution.id);

    // After sorting, index 0 should be highest
    expect(result.index).toBe(0);
    expect(result.item.text).toBe('High');
  });

  it('should throw for non-existent distribution', () => {
    expect(() => getArgmax('fake-id')).toThrow('Distribution not found');
  });
});

describe('sampleMultipleFromDistribution', () => {
  beforeEach(() => {
    clearDistributions();
  });

  it('should sample n unique items', () => {
    const dist = createTestDistribution();
    const result = sampleMultipleFromDistribution(dist.distribution.id, 2, 42);

    expect(result.items).toHaveLength(2);
    expect(result.items[0].index).not.toBe(result.items[1].index);
  });

  it('should throw for non-existent distribution', () => {
    expect(() => sampleMultipleFromDistribution('fake-id', 2)).toThrow(
      'Distribution not found'
    );
  });

  it('should throw when n > distribution size', () => {
    const dist = createTestDistribution();
    expect(() =>
      sampleMultipleFromDistribution(dist.distribution.id, 10)
    ).toThrow('Cannot sample 10 items from distribution of size 3');
  });

  it('should return all items when n equals size', () => {
    const dist = createTestDistribution();
    const result = sampleMultipleFromDistribution(dist.distribution.id, 3, 42);

    expect(result.items).toHaveLength(3);
    const indices = new Set(result.items.map(r => r.index));
    expect(indices.size).toBe(3);
  });

  it('should produce consistent results with same seed', () => {
    const dist = createTestDistribution();
    const result1 = sampleMultipleFromDistribution(dist.distribution.id, 2, 999);
    const result2 = sampleMultipleFromDistribution(dist.distribution.id, 2, 999);

    expect(result1.items[0].index).toBe(result2.items[0].index);
    expect(result1.items[1].index).toBe(result2.items[1].index);
  });
});
