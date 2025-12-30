---
name: think
description: Structured sequential thinking for complex problem-solving, planning, and analysis. Use when facing multi-step problems, architectural decisions, debugging complex issues, or any task requiring deliberate reasoning with potential for revision and branching. Triggers on "/think", requests for deep analysis, or when explicitly asked to "think through" a problem step-by-step.
---

# Sequential Thinking

Structure reasoning into numbered thoughts with support for revision, branching, and hypothesis verification.

## When to Use

- Multi-step problems requiring careful decomposition
- Decisions with multiple valid approaches
- Debugging where root cause is unclear
- Planning implementations before coding
- Any analysis where you might need to revise earlier conclusions

## Thinking Format

### Basic Structure

```
**Thought 1/N** [Optional: REVISION of #X | BRANCH from #X]
[Content of the thought]
Confidence: Low | Medium | High
```

### Process

1. **Estimate** initial thought count (adjust as understanding deepens)
2. **Number** each thought sequentially
3. **Mark revisions** when reconsidering previous thoughts
4. **Branch** when exploring alternative paths
5. **Conclude** only when satisfied with the reasoning chain

### Markers

| Marker | Usage |
|--------|-------|
| `Thought N/M` | Standard sequential thought |
| `[REVISION of #X]` | Reconsidering thought X |
| `[BRANCH from #X: name]` | Alternative path from thought X |
| `Confidence: Level` | Self-assessed certainty |

## Example

```markdown
**Thought 1/5**
The user wants to optimize database queries. First, I need to understand what "slow" means - are we talking milliseconds or seconds?
Confidence: High

**Thought 2/5**
Looking at the query patterns, there are three potential bottlenecks: missing indexes, N+1 queries, or unoptimized JOINs.
Confidence: Medium

**Thought 3/5** [REVISION of #2]
Actually, reviewing the logs shows the issue is specifically with the user search endpoint. This narrows the scope significantly - it's not a general query problem.
Confidence: High

**Thought 4/5**
The search query uses LIKE '%term%' which prevents index usage. Two options: full-text search index or application-level caching.
Confidence: High

**Thought 5/5**
Given the read-heavy workload and acceptable staleness, Redis caching is the simpler solution. Full-text search would be better long-term but adds complexity.
Confidence: High

---
**Conclusion:** Implement Redis caching for user search with 5-minute TTL. Consider full-text search if cache hit rate drops below 80%.
```

## Advanced: Thinking Frameworks

For specialized analysis, combine with optional frameworks. See [references/frameworks.md](references/frameworks.md) for:

- **First Principles** - Break down to fundamentals
- **Pre-mortem** - Anticipate failures
- **Six Thinking Hats** - Multiple perspectives
- **Devil's Advocate** - Challenge assumptions
- **SCAMPER** - Creative ideation

## Output

End every thinking session with:

```
---
**Conclusion:** [Clear answer or recommendation]
Confidence: [Overall confidence level]
[Optional: Key uncertainties or next steps]
```
