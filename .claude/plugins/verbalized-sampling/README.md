# Verbalized Sampling Plugin

A Claude Code plugin that generates **genuinely diverse options** for creative and technical problems.

## Try it Now

```bash
# See VS in action with a classic example
/vs:demo "write a poem about a bear"

# Or let it pick a creative prompt for you
/vs:demo --showcase
```

**More creative examples:**
- `/vs:demo "birthday gift ideas for a bookworm"`
- `/vs:demo "name ideas for a coffee shop"`
- `/vs:demo "explain quantum physics to a child"`

VS shines with creative prompts - instead of one "obvious" answer, you get 7 genuinely different approaches.

## What is Verbalized Sampling?

Verbalized Sampling (VS) is a training-free prompting technique that mitigates mode collapse in LLMs. Instead of relying on temperature-based sampling, VS asks the model to explicitly generate multiple candidates with probability estimates, then samples from that distribution.

**Key Benefits:**
- 2-3x diversity improvement over standard prompting
- Training-free (works via prompting alone)
- Model-agnostic (works with any LLM)
- Maintains quality while increasing variety

## Installation

```bash
# From plugin marketplace (when available)
claude plugin install verbalized-sampling

# Or clone and install locally
git clone https://github.com/resmark/verbalized-sampling
cd verbalized-sampling
npm install
npm run build
```

## Components

This plugin bundles:

### MCP Server Tools
- `vs_generate` - Generate k diverse options with probability weights
- `vs_process_response` - Process LLM response and store distribution
- `vs_select` - Select items from a distribution
- `vs_sample` - Weighted random sampling
- `vs_argmax` - Get highest probability item
- `vs_top_k` - Get top k highest probability items
- `vs_list` - List stored distributions
- `vs_get` - Retrieve a distribution by ID
- `vs_clear` - Clear all stored distributions

### Slash Commands
- `/vs:demo` - **Educational demo** with probability badges and tail markers
- `/vs:explore` - Solution exploration with diverse approaches
- `/vs:brainstorm` - Creative ideation with probability weights
- `/vs:architecture` - System design alternatives
- `/vs:test-cases` - Edge case discovery

### Skill: Divergent Thinking
Auto-activates when Claude detects exploration/brainstorming contexts.

### Hook: Exploration Reminder
Prompts to consider VS before major architecture decisions.

## Usage

### Quick Start (Slash Commands)

```bash
# In Claude Code:
/vs:explore How should we implement caching for the API?

/vs:architecture Design a notification system for 100k users

/vs:brainstorm Features for a developer productivity tool

/vs:test-cases User authentication edge cases
```

### Direct Tool Usage

```
Use the mcp__verbalized-sampling__vs_generate tool with:
- prompt: "How should we handle rate limiting?"
- k: 5
- tau: 0.10
- domain: "architecture"
```

## Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `k` | 5 | Number of options to generate |
| `tau` | 0.10 | Max probability per option (forces diversity) |
| `domain` | "general" | One of: general, architecture, creative, code |
| `context` | - | Additional context for generation |

## The Key Principle: Diverge → Curate → Converge

1. **DIVERGE**: Use VS to generate diverse options
2. **CURATE**: User reviews and selects promising directions
3. **CONVERGE**: Deep dive on selected approach(es)

## Domains

### `general`
Default exploration for any problem type.

### `architecture`
Focuses on architectural patterns, scalability, technology choices.

### `creative`
Emphasizes novel ideas, cross-domain inspiration, unconventional options.

### `code`
Implementation approaches, algorithms, data structures, testing.

## Example Output

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

## Development

```bash
# Install dependencies
cd mcp-server
npm install

# Build
npm run build

# Run tests (108 tests)
npm test

# Run tests with coverage
npm test -- --coverage

# Development mode (watch)
npm run dev
```

## Project Structure

```
verbalized-sampling/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── commands/                 # Slash commands
│   ├── demo.md
│   ├── explore.md
│   ├── brainstorm.md
│   ├── architecture.md
│   └── test-cases.md
├── hooks/
│   └── exploration-reminder.json
├── skills/
│   └── divergent-thinking.md
├── mcp-server/
│   ├── src/
│   │   ├── __tests__/       # Unit & integration tests
│   │   ├── tools/           # MCP tool implementations
│   │   ├── prompts/         # VS prompt templates
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Sampling & parsing utilities
│   └── dist/                # Compiled output
├── docs/
│   └── EXAMPLES.md          # Usage examples
├── package.json
└── README.md
```

## License

MIT

## References

- [Verbalized Sampling Paper](https://arxiv.org/abs/2510.01171)
- [CHATS-lab/verbalized-sampling](https://github.com/CHATS-lab/verbalized-sampling)
- [Claude Code Plugin Documentation](https://docs.claude.ai/claude-code/plugins)
