---
name: Divergent Thinking
description: Use Verbalized Sampling for diverse option generation
triggers:
  - exploration
  - brainstorming
  - architecture decisions
  - multiple approaches
  - alternatives
  - options
  - what are the ways
  - how could we
  - demo
  - show me
  - see it in action
---

When I detect the user needs to explore multiple options or approaches, I should use the Verbalized Sampling tools to generate diverse alternatives.

## When to Activate

- User asks "what are the options for..."
- User is making an architecture or design decision
- User wants to brainstorm ideas
- User asks for alternatives or approaches
- User says "explore" or "what are the ways to..."
- User is at a decision point with multiple valid paths

## How to Use

1. Call `mcp__verbalized-sampling__vs_generate` with appropriate parameters:
   - `k`: Number of options (typically 5-7)
   - `tau`: Max probability per item (typically 0.08-0.12)
   - `domain`: One of "general", "creative", "architecture", "code"

2. Present options with probability badges: `[p=0.08]`

3. Ask user which option(s) to explore further

4. Offer to generate more "tail" options if user wants more diversity

## Key Principle

**Diverge → Curate → Converge**

- DIVERGE: Generate diverse options using VS
- CURATE: User selects direction(s) to pursue
- CONVERGE: Deep dive on selected approach

## Available VS Commands

| Command | Purpose | When to Use |
|---------|---------|-------------|
| `/vs:demo` | Educational demonstration | Show VS in action, explain how it works |
| `/vs:explore` | Deep topic exploration | Research questions, follow-up drilling |
| `/vs:brainstorm` | Idea generation | Creative prompts, naming, planning |
| `/vs:architecture` | System design options | Technical decisions, architecture choices |
| `/vs:test-cases` | Test case generation | Edge cases, test coverage |

**Demo vs Working Commands:**
- `/vs:demo` is **educational** - explains VS, shows badges, invites verification
- Other commands are for **real work** - direct generation without explanation

## Example Usage

```
User: "How should we implement caching?"

Claude: I'll use Verbalized Sampling to explore diverse caching approaches...

[Calls vs_generate with k=5, tau=0.10, domain="architecture"]

Here are 5 distinct caching approaches:

1. [p=0.09] **Redis with write-through**
   Best for: read-heavy, consistency critical

2. [p=0.08] **In-memory LRU + Redis fallback**
   Best for: low-latency, moderate consistency

...

Which approach(es) would you like to explore further?
```
