# Verbalized Sampling Examples

This guide shows practical examples of using Verbalized Sampling in Claude Code.

## Creative Uses

VS shines with creative prompts - generating genuinely diverse options instead of variations on one "obvious" answer.

### Poetry & Writing

```bash
/vs:demo "write a poem about a bear"
```

Sample output:
```
1. [p=0.05] **The Contemplative Observer** - A nature meditation from the bear's perspective
2. [p=0.05] **The Humorous Take** - A silly limerick about a bear's adventures
3. [p=0.05] **The Melancholy** - A haiku about hibernation and solitude
4. [p=0.04] **The Children's Story** - A whimsical rhyming tale
5. [p=0.04] **The Epic** - Bear as mythological hero in blank verse
6. ⭐ [p=0.04] **The Unexpected** - Bear as metaphor for corporate life
7. ⭐ [p=0.03] **The Experimental** - Concrete poetry shaped like a bear
```

### Naming Things

```bash
/vs:demo "name ideas for a coffee shop"
```

Get 7 genuinely different naming directions - punny names, sophisticated names, location-based, vibe-based, and surprising angles you wouldn't think of.

### Gift Ideas

```bash
/vs:demo "birthday gift ideas for a bookworm"
```

Instead of "more books," get diverse categories: experiences, book-adjacent items, practical reading accessories, personalized options, and creative surprises.

### Party Planning

```bash
/vs:demo "theme ideas for a 40th birthday party"
```

Move beyond "over the hill" to genuinely diverse themes across decades, interests, venues, and creative twists.

### Explaining Concepts

```bash
/vs:demo "explain quantum physics to a child"
```

Get 7 different explanation strategies: analogies, stories, games, experiments, and unexpected angles.

---

## Quick Start

### Using Slash Commands

The fastest way to use VS is through slash commands:

```bash
# Explore solution approaches
/vs:explore How should we implement caching for the API?

# Architecture decision making
/vs:architecture Design a notification system for 100k users

# Creative brainstorming
/vs:brainstorm Features for a developer productivity tool

# Test case discovery
/vs:test-cases User authentication edge cases
```

### Example Output

```
1. [p=0.09] **Redis with write-through caching**
   Rationale: Well-established pattern for read-heavy workloads
   Tradeoffs: Pro: Mature ecosystem; Con: Additional infrastructure

2. [p=0.08] **In-memory LRU + Redis fallback**
   Rationale: Balances latency with durability
   Tradeoffs: Pro: Fast local access; Con: Cache coherence complexity

3. [p=0.07] **CDN edge caching**
   Rationale: Good for static/semi-static content
   Tradeoffs: Pro: Global distribution; Con: Invalidation challenges

4. [p=0.06] **Event-sourced cache invalidation**
   Rationale: Elegant for complex invalidation rules
   Tradeoffs: Pro: Precise control; Con: Implementation complexity

5. [p=0.05] **Hybrid tiered caching (memory → Redis → S3)**
   Rationale: Cost-optimized for variable access patterns
   Tradeoffs: Pro: Cost efficiency; Con: Operational complexity

Which approach(es) would you like to explore further?
```

## Direct MCP Tool Usage

For more control, use the MCP tools directly:

### Step 1: Generate Options

```
Use mcp__verbalized-sampling__vs_generate with:
- prompt: "How should we handle authentication?"
- k: 7          # Generate 7 options
- tau: 0.08     # Max 8% probability per option (forces diversity)
- domain: "architecture"
```

### Step 2: Process Response

After Claude generates the options, store them:

```
Use mcp__verbalized-sampling__vs_process_response with:
- response: [the JSON output from step 1]
- original_prompt: "How should we handle authentication?"
- config: { k: 7, tau: 0.08, domain: "architecture" }
```

### Step 3: Interact with Distribution

**Get top options:**
```
Use mcp__verbalized-sampling__vs_top_k with:
- distribution_id: [id from step 2]
- k: 3
```

**Random weighted sample:**
```
Use mcp__verbalized-sampling__vs_sample with:
- distribution_id: [id]
- seed: 42  # Optional, for reproducibility
```

**Select specific options:**
```
Use mcp__verbalized-sampling__vs_select with:
- distribution_id: [id]
- indices: [0, 2, 4]  # Select 1st, 3rd, and 5th options
```

## Domains

### `general` (default)
Best for: Open-ended exploration, general problem solving

```
/vs:explore What are the best practices for error handling?
```

### `architecture`
Best for: System design, infrastructure decisions, technology choices

```
/vs:architecture Design a message queue for high-throughput event processing
```

Focus areas:
- Architectural patterns (monolith, microservices, serverless)
- Scalability vs simplicity tradeoffs
- Technology stack variations
- Deployment and operational considerations

### `creative`
Best for: Brainstorming, ideation, novel approaches

```
/vs:brainstorm Ways to improve developer experience in our CLI tool
```

Focus areas:
- Genuinely novel and unexpected ideas
- Cross-domain inspiration
- Both practical and ambitious options
- "Yes, and..." building on concepts

### `code`
Best for: Implementation approaches, algorithms, testing strategies

```
/vs:explore How should we implement the search algorithm?
```

Focus areas:
- Different implementation approaches
- Algorithm and data structure choices
- Library/framework options
- Testing and maintainability considerations

## The Key Workflow: Diverge → Curate → Converge

### 1. DIVERGE
Use VS to generate diverse options. The `tau` parameter forces diversity by capping the maximum probability.

```
/vs:explore [your question] --tau=0.08 --k=7
```

### 2. CURATE
Review the generated options. You might:
- Ask to explore 2-3 options in more depth
- Request more "tail" options (unconventional approaches)
- Combine elements from multiple options

```
"I'd like to explore options 1 and 4 further. Also generate 3 more unconventional approaches."
```

### 3. CONVERGE
Once you've selected a direction, go deep:

```
"Let's implement option 1 (Redis with write-through). Show me the architecture and code structure."
```

## Parameter Tuning

### `k` - Number of Options
- Default: 5
- Range: 3-15 recommended
- Higher = more exploration, but may include lower-quality options
- Lower = focused set, but may miss good alternatives

### `tau` - Maximum Probability
- Default: 0.10 (10%)
- Range: 0.05-0.20 recommended
- Lower = forces more diversity (no option dominates)
- Higher = allows more confidence in top options

**Example configurations:**

| Scenario | k | tau | Rationale |
|----------|---|-----|-----------|
| Quick exploration | 5 | 0.10 | Balanced default |
| Deep dive | 10 | 0.05 | Maximum diversity |
| Focused decision | 4 | 0.15 | Fewer, higher-confidence options |
| Creative brainstorm | 7 | 0.08 | Many unconventional ideas |

## Advanced Patterns

### Sequential Refinement

```bash
# Round 1: Broad exploration
/vs:explore How should we build the API?

# Round 2: Focus on selected approaches
/vs:explore Compare REST vs GraphQL for our use case

# Round 3: Implementation details
/vs:explore GraphQL schema design patterns for our domain
```

### Combining with Other Tools

```bash
# 1. Use VS to explore approaches
/vs:architecture Database design for multi-tenant SaaS

# 2. Use other tools to validate
# (performance testing, security review, etc.)

# 3. Use VS again if new constraints emerge
/vs:explore How to optimize for the 100ms latency requirement?
```

### Using Seeds for Reproducibility

When you want consistent results:

```
Use mcp__verbalized-sampling__vs_sample with:
- distribution_id: [id]
- seed: 42
```

Same seed + same distribution = same sampled item.

## Troubleshooting

### "Distribution not found"
The distribution ID is only valid for the current session. Generate a new distribution if you've restarted.

### Low diversity in results
- Decrease `tau` (e.g., from 0.10 to 0.06)
- Increase `k` (generate more options)
- Be more specific about wanting "unconventional" or "tail" options in the prompt

### Options too similar
- Use domain-specific prompting (architecture, creative, code)
- Add context about what approaches you've already considered
- Explicitly request "genuinely different approaches, not variations"
