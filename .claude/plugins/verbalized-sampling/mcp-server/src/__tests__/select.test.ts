/**
 * Tests for select tool functions
 */

import { selectFromDistribution, getTopK, filterByProbability } from '../tools/select.js';
import { processVSResponse, clearDistributions } from '../tools/generate.js';

// Helper to create a test distribution
function createTestDistribution() {
  const response = JSON.stringify({
    items: [
      { text: 'Option A', probability: 0.4 },
      { text: 'Option B', probability: 0.3 },
      { text: 'Option C', probability: 0.2 },
      { text: 'Option D', probability: 0.1 },
    ],
  });
  return processVSResponse(
    response,
    'Test prompt',
    { k: 4, tau: 0.50, domain: 'general' },
    'claude-3',
    Date.now()
  );
}

describe('selectFromDistribution', () => {
  beforeEach(() => {
    clearDistributions();
  });

  it('should select items by indices', () => {
    const dist = createTestDistribution();
    const result = selectFromDistribution({
      distribution_id: dist.distribution.id,
      indices: [0, 2],
    });

    expect(result.selected).toHaveLength(2);
    expect(result.selected[0].text).toBe('Option A');
    expect(result.selected[1].text).toBe('Option C');
  });

  it('should throw for non-existent distribution', () => {
    expect(() =>
      selectFromDistribution({
        distribution_id: 'fake-id',
        indices: [0],
      })
    ).toThrow('Distribution not found');
  });

  it('should filter invalid indices', () => {
    const dist = createTestDistribution();
    const result = selectFromDistribution({
      distribution_id: dist.distribution.id,
      indices: [0, -1, 100],
    });

    expect(result.selected).toHaveLength(1);
    expect(result.selected[0].text).toBe('Option A');
  });

  it('should throw when no valid indices provided', () => {
    const dist = createTestDistribution();
    expect(() =>
      selectFromDistribution({
        distribution_id: dist.distribution.id,
        indices: [-1, 100],
      })
    ).toThrow('No valid indices provided');
  });

  it('should return remaining items with new ID', () => {
    const dist = createTestDistribution();
    const result = selectFromDistribution({
      distribution_id: dist.distribution.id,
      indices: [0],
    });

    expect(result.remaining).toBeDefined();
    expect(result.remaining?.items).toHaveLength(3);
    expect(result.remaining?.id).toContain('-remaining');
  });

  it('should renormalize remaining items', () => {
    const dist = createTestDistribution();
    const result = selectFromDistribution({
      distribution_id: dist.distribution.id,
      indices: [0],
    });

    if (result.remaining) {
      const sum = result.remaining.items.reduce((acc, item) => acc + item.probability, 0);
      expect(sum).toBeCloseTo(1.0);
    }
  });

  it('should return no remaining when all selected', () => {
    const dist = createTestDistribution();
    const result = selectFromDistribution({
      distribution_id: dist.distribution.id,
      indices: [0, 1, 2, 3],
    });

    expect(result.remaining).toBeUndefined();
  });
});

describe('getTopK', () => {
  beforeEach(() => {
    clearDistributions();
  });

  it('should return top k items', () => {
    const dist = createTestDistribution();
    const result = getTopK(dist.distribution.id, 2);

    expect(result).toHaveLength(2);
    expect(result[0].text).toBe('Option A');
    expect(result[1].text).toBe('Option B');
  });

  it('should throw for non-existent distribution', () => {
    expect(() => getTopK('fake-id', 2)).toThrow('Distribution not found');
  });

  it('should return all items if k > length', () => {
    const dist = createTestDistribution();
    const result = getTopK(dist.distribution.id, 10);

    expect(result).toHaveLength(4);
  });

  it('should return empty array for k=0', () => {
    const dist = createTestDistribution();
    const result = getTopK(dist.distribution.id, 0);

    expect(result).toHaveLength(0);
  });
});

describe('filterByProbability', () => {
  beforeEach(() => {
    clearDistributions();
  });

  it('should filter items above threshold', () => {
    const dist = createTestDistribution();
    const result = filterByProbability(dist.distribution.id, 0.25);

    expect(result).toHaveLength(2);
    expect(result.every(item => item.probability >= 0.25)).toBe(true);
  });

  it('should throw for non-existent distribution', () => {
    expect(() => filterByProbability('fake-id', 0.1)).toThrow('Distribution not found');
  });

  it('should return empty array if threshold too high', () => {
    const dist = createTestDistribution();
    const result = filterByProbability(dist.distribution.id, 0.99);

    expect(result).toHaveLength(0);
  });

  it('should return all items if threshold is 0', () => {
    const dist = createTestDistribution();
    const result = filterByProbability(dist.distribution.id, 0);

    expect(result).toHaveLength(4);
  });
});
