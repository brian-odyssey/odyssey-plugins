/**
 * Tests for generate tool functions
 */

import {
  createVSGeneratePrompt,
  processVSResponse,
  getDistribution,
  listDistributions,
  clearDistributions,
  deleteDistribution,
} from '../tools/generate.js';
import type { VSGenerateDomain } from '../types/distribution.js';

describe('createVSGeneratePrompt', () => {
  it('should create prompt with default parameters', () => {
    const result = createVSGeneratePrompt({
      prompt: 'How should we implement caching?',
    });

    expect(result.config.k).toBe(5);
    expect(result.config.tau).toBe(0.10);
    expect(result.config.domain).toBe('general');
    expect(result.userPrompt).toContain('How should we implement caching?');
    expect(result.systemPrompt).toContain('Verbalized Sampling');
  });

  it('should respect custom k parameter', () => {
    const result = createVSGeneratePrompt({
      prompt: 'Test',
      k: 10,
    });

    expect(result.config.k).toBe(10);
    expect(result.userPrompt).toContain('Generate 10 distinct approaches');
  });

  it('should respect custom tau parameter', () => {
    const result = createVSGeneratePrompt({
      prompt: 'Test',
      tau: 0.15,
    });

    expect(result.config.tau).toBe(0.15);
    expect(result.userPrompt).toContain('less than 0.15');
  });

  it('should include domain-specific guidance for architecture', () => {
    const result = createVSGeneratePrompt({
      prompt: 'Design a notification system',
      domain: 'architecture',
    });

    expect(result.config.domain).toBe('architecture');
    expect(result.userPrompt).toContain('System Architecture');
    expect(result.userPrompt).toContain('microservices');
  });

  it('should include domain-specific guidance for creative', () => {
    const result = createVSGeneratePrompt({
      prompt: 'Brainstorm features',
      domain: 'creative',
    });

    expect(result.userPrompt).toContain('Creative/Brainstorming');
    expect(result.userPrompt).toContain('wild/unconventional');
  });

  it('should include domain-specific guidance for code', () => {
    const result = createVSGeneratePrompt({
      prompt: 'Implement sorting',
      domain: 'code',
    });

    expect(result.userPrompt).toContain('Code/Implementation');
    expect(result.userPrompt).toContain('Algorithm');
  });

  it('should include context when provided', () => {
    const result = createVSGeneratePrompt({
      prompt: 'Test',
      context: 'We are using React and Node.js',
    });

    expect(result.userPrompt).toContain('Additional Context:');
    expect(result.userPrompt).toContain('React and Node.js');
  });

  it('should not include context section when not provided', () => {
    const result = createVSGeneratePrompt({
      prompt: 'Test',
    });

    expect(result.userPrompt).not.toContain('Additional Context:');
  });
});

describe('processVSResponse', () => {
  beforeEach(() => {
    clearDistributions();
  });

  const validResponse = JSON.stringify({
    items: [
      { text: 'Option A', probability: 0.4, rationale: 'Good', tradeoffs: ['Pro: fast'] },
      { text: 'Option B', probability: 0.35, rationale: 'Solid', tradeoffs: ['Pro: simple'] },
      { text: 'Option C', probability: 0.25, rationale: 'Novel', tradeoffs: ['Con: complex'] },
    ],
  });

  it('should parse and store distribution', () => {
    const result = processVSResponse(
      validResponse,
      'Test prompt',
      { k: 5, tau: 0.10, domain: 'general' },
      'claude-3',
      Date.now() - 100
    );

    expect(result.distribution.id).toBeDefined();
    expect(result.distribution.items).toHaveLength(3);
    expect(result.distribution.prompt).toBe('Test prompt');
    expect(result.distribution.domain).toBe('general');
    expect(result.metadata.model).toBe('claude-3');
    expect(result.metadata.k_requested).toBe(5);
    expect(result.metadata.k_returned).toBe(3);
  });

  it('should apply tau constraint', () => {
    const result = processVSResponse(
      validResponse,
      'Test',
      { k: 3, tau: 0.10, domain: 'general' },
      'claude-3',
      Date.now()
    );

    for (const item of result.distribution.items) {
      // After clamping and renormalization, probabilities will be more uniform
      expect(item.probability).toBeLessThanOrEqual(0.4);
    }
  });

  it('should normalize probabilities', () => {
    const result = processVSResponse(
      validResponse,
      'Test',
      { k: 3, tau: 0.10, domain: 'general' },
      'claude-3',
      Date.now()
    );

    const sum = result.distribution.items.reduce((acc, item) => acc + item.probability, 0);
    expect(sum).toBeCloseTo(1.0);
  });

  it('should sort items by probability descending', () => {
    const result = processVSResponse(
      validResponse,
      'Test',
      { k: 3, tau: 0.50, domain: 'general' },
      'claude-3',
      Date.now()
    );

    for (let i = 1; i < result.distribution.items.length; i++) {
      expect(result.distribution.items[i - 1].probability)
        .toBeGreaterThanOrEqual(result.distribution.items[i].probability);
    }
  });

  it('should throw on invalid response', () => {
    expect(() =>
      processVSResponse(
        'Not JSON',
        'Test',
        { k: 3, tau: 0.10, domain: 'general' },
        'claude-3',
        Date.now()
      )
    ).toThrow('Failed to parse VS response');
  });

  it('should make distribution retrievable', () => {
    const result = processVSResponse(
      validResponse,
      'Test',
      { k: 3, tau: 0.10, domain: 'general' },
      'claude-3',
      Date.now()
    );

    const retrieved = getDistribution(result.distribution.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(result.distribution.id);
  });
});

describe('distribution storage', () => {
  beforeEach(() => {
    clearDistributions();
  });

  const createDistribution = () => {
    const response = JSON.stringify({
      items: [{ text: 'Test', probability: 1.0 }],
    });
    return processVSResponse(
      response,
      'Test',
      { k: 1, tau: 1.0, domain: 'general' },
      'claude-3',
      Date.now()
    );
  };

  it('should store and retrieve distributions', () => {
    const result = createDistribution();
    const retrieved = getDistribution(result.distribution.id);
    expect(retrieved).toBeDefined();
    expect(retrieved?.id).toBe(result.distribution.id);
  });

  it('should return undefined for non-existent ID', () => {
    const result = getDistribution('non-existent-id');
    expect(result).toBeUndefined();
  });

  it('should list all distributions', () => {
    createDistribution();
    createDistribution();
    createDistribution();

    const list = listDistributions();
    expect(list).toHaveLength(3);
  });

  it('should clear all distributions', () => {
    createDistribution();
    createDistribution();
    clearDistributions();

    const list = listDistributions();
    expect(list).toHaveLength(0);
  });

  it('should delete specific distribution', () => {
    const result1 = createDistribution();
    const result2 = createDistribution();

    const deleted = deleteDistribution(result1.distribution.id);
    expect(deleted).toBe(true);

    expect(getDistribution(result1.distribution.id)).toBeUndefined();
    expect(getDistribution(result2.distribution.id)).toBeDefined();
  });

  it('should return false when deleting non-existent ID', () => {
    const deleted = deleteDistribution('non-existent-id');
    expect(deleted).toBe(false);
  });
});
