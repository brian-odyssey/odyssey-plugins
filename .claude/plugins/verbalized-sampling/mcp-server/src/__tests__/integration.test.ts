/**
 * Integration tests for Verbalized Sampling Plugin
 *
 * These tests simulate the full workflow of:
 * 1. Generating a VS prompt
 * 2. Processing a simulated LLM response
 * 3. Manipulating the resulting distribution
 */

import {
  createVSGeneratePrompt,
  processVSResponse,
  getDistribution,
  listDistributions,
  clearDistributions,
} from '../tools/generate.js';
import { selectFromDistribution, getTopK } from '../tools/select.js';
import { sampleFromDistribution, getArgmax, sampleMultipleFromDistribution } from '../tools/sample.js';
import { formatDistribution } from '../utils/parser.js';

// Simulated LLM response for testing
const MOCK_LLM_RESPONSE = JSON.stringify({
  items: [
    {
      text: 'Redis with write-through caching',
      probability: 0.09,
      rationale: 'Well-established pattern for read-heavy workloads',
      tradeoffs: ['Pro: Mature ecosystem', 'Con: Additional infrastructure'],
    },
    {
      text: 'In-memory LRU + Redis fallback',
      probability: 0.08,
      rationale: 'Balances latency with durability',
      tradeoffs: ['Pro: Fast local access', 'Con: Cache coherence complexity'],
    },
    {
      text: 'CDN edge caching',
      probability: 0.07,
      rationale: 'Good for static/semi-static content',
      tradeoffs: ['Pro: Global distribution', 'Con: Invalidation challenges'],
    },
    {
      text: 'Event-sourced cache invalidation',
      probability: 0.06,
      rationale: 'Elegant for complex invalidation rules',
      tradeoffs: ['Pro: Precise control', 'Con: Implementation complexity'],
    },
    {
      text: 'Hybrid tiered caching (memory → Redis → S3)',
      probability: 0.05,
      rationale: 'Cost-optimized for variable access patterns',
      tradeoffs: ['Pro: Cost efficiency', 'Con: Operational complexity'],
    },
  ],
});

describe('Full VS Workflow Integration', () => {
  beforeEach(() => {
    clearDistributions();
  });

  it('should complete full generate → process → select workflow', () => {
    // Step 1: Generate the VS prompt
    const { systemPrompt, userPrompt, config } = createVSGeneratePrompt({
      prompt: 'How should we implement caching for the API?',
      k: 5,
      tau: 0.10,
      domain: 'architecture',
    });

    expect(systemPrompt).toContain('Verbalized Sampling');
    expect(userPrompt).toContain('caching');
    expect(config.domain).toBe('architecture');

    // Step 2: Process simulated LLM response
    const result = processVSResponse(
      MOCK_LLM_RESPONSE,
      'How should we implement caching for the API?',
      config,
      'claude-opus-4-5-20251101',
      Date.now() - 500
    );

    expect(result.distribution.items).toHaveLength(5);
    expect(result.distribution.id).toBeDefined();
    expect(result.metadata.model).toBe('claude-opus-4-5-20251101');

    // Step 3: Get top 3 options
    const top3 = getTopK(result.distribution.id, 3);
    expect(top3).toHaveLength(3);
    expect(top3[0].probability).toBeGreaterThanOrEqual(top3[1].probability);

    // Step 4: Select options 0 and 2 for further exploration
    const selection = selectFromDistribution({
      distribution_id: result.distribution.id,
      indices: [0, 2],
    });

    expect(selection.selected).toHaveLength(2);
    expect(selection.remaining?.items).toHaveLength(3);

    // Step 5: Sample from remaining
    const sampled = sampleFromDistribution({
      distribution_id: selection.remaining!.id,
      seed: 42,
    });

    expect(sampled.item).toBeDefined();
    expect(sampled.index).toBeGreaterThanOrEqual(0);
  });

  it('should format distribution for display', () => {
    const result = processVSResponse(
      MOCK_LLM_RESPONSE,
      'Test',
      { k: 5, tau: 0.10, domain: 'general' },
      'claude',
      Date.now()
    );

    const formatted = formatDistribution(result.distribution.items);

    expect(formatted).toContain('[p=');
    expect(formatted).toContain('Redis');
    expect(formatted).toContain('Rationale:');
    expect(formatted).toContain('Tradeoffs:');
  });

  it('should support argmax selection', () => {
    const result = processVSResponse(
      MOCK_LLM_RESPONSE,
      'Test',
      { k: 5, tau: 0.15, domain: 'general' },
      'claude',
      Date.now()
    );

    const best = getArgmax(result.distribution.id);

    expect(best.index).toBe(0);
    expect(best.item.text).toContain('Redis');
  });

  it('should support multiple sampling without replacement', () => {
    const result = processVSResponse(
      MOCK_LLM_RESPONSE,
      'Test',
      { k: 5, tau: 0.15, domain: 'general' },
      'claude',
      Date.now()
    );

    const samples = sampleMultipleFromDistribution(result.distribution.id, 3, 42);

    expect(samples.items).toHaveLength(3);
    const indices = samples.items.map((s) => s.index);
    const unique = new Set(indices);
    expect(unique.size).toBe(3); // All unique
  });

  it('should manage distribution storage', () => {
    // Create multiple distributions
    for (let i = 0; i < 3; i++) {
      processVSResponse(
        MOCK_LLM_RESPONSE,
        `Test ${i}`,
        { k: 5, tau: 0.10, domain: 'general' },
        'claude',
        Date.now()
      );
    }

    expect(listDistributions()).toHaveLength(3);

    // Clear and verify
    clearDistributions();
    expect(listDistributions()).toHaveLength(0);
  });
});

describe('Domain-specific prompts', () => {
  const domains = ['general', 'architecture', 'creative', 'code'] as const;

  domains.forEach((domain) => {
    it(`should generate ${domain} domain prompt`, () => {
      const { userPrompt } = createVSGeneratePrompt({
        prompt: 'Test question',
        domain,
      });

      expect(userPrompt).toContain('Test question');
      // Each domain has specific guidance
      if (domain === 'architecture') {
        expect(userPrompt).toContain('System Architecture');
      } else if (domain === 'creative') {
        expect(userPrompt).toContain('Creative/Brainstorming');
      } else if (domain === 'code') {
        expect(userPrompt).toContain('Code/Implementation');
      }
    });
  });
});

describe('Tau constraint enforcement', () => {
  it('should enforce tau constraint on high probabilities', () => {
    const highProbResponse = JSON.stringify({
      items: [
        { text: 'Very confident', probability: 0.5 },
        { text: 'Somewhat confident', probability: 0.3 },
        { text: 'Less confident', probability: 0.2 },
      ],
    });

    const result = processVSResponse(
      highProbResponse,
      'Test',
      { k: 3, tau: 0.10, domain: 'general' },
      'claude',
      Date.now()
    );

    // All probabilities should be clamped and renormalized
    const maxProb = Math.max(...result.distribution.items.map((i) => i.probability));
    // After clamping to 0.10 and renormalizing, max should be around 0.33
    expect(maxProb).toBeLessThanOrEqual(0.4);

    // Sum should still be 1.0
    const sum = result.distribution.items.reduce((acc, i) => acc + i.probability, 0);
    expect(sum).toBeCloseTo(1.0);
  });
});
