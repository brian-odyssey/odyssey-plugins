# Handoff: Design & Build skill-forge Meta-Improvement System

**Created**: 2026-01-13
**Priority**: HIGH - Strategic tooling for continuous improvement
**Status**: VALIDATED (Ultrathink Complete)
**Cognitive Flow Sessions**:
- Initial EXPAND: `b28d0f40-4696-42f6-98b6-c545f6228c05`
- cf_plan Ultrathink: `acb2ad48-963b-4bed-b934-72c06b45a5d5`

## Objective

Design and build a **skill-forge** system (command, skill, or plugin) that formalizes the meta-improvement pattern:

1. Execute a process/workflow with one tool or approach
2. Repeat with a different tool or condition (A/B comparison)
3. Independent critical post-review to analyze both
4. Generate findings report to improve the original process/skill

This system should integrate with cognitive-flow and become a reusable pattern for any skill development.

---

## Background Context

This handoff was created after:
1. Building the `presentation-forge` skill (5-phase Slidev workflow)
2. Creating validation handoffs (create + review) for that skill
3. Using cognitive-flow EXPAND to generate 6 approach options
4. Getting Gemini's critical feedback via dual-AI synthesis

The goal is to generalize this improvement pattern into reusable tooling.

---

## The 6 Options Generated (cf EXPAND)

### Option 1: cf:audit - Skill Self-Improvement Command
**Probability**: 15%

A cognitive-flow command that executes a skill/workflow, captures execution metadata, then triggers an independent EXPAND phase to generate improvement hypotheses. Uses the existing cf session graph to track skill evolution over time.

**Rationale**: Leverages existing cf infrastructure. Minimal new code needed.

**Failure Mode**: Confirmation bias - agent auditing its own execution validates its own reasoning.

---

### Option 2: Dual-Execution Comparator Skill ⭐ GEMINI PRIORITY #2
**Probability**: 15%

A standalone skill that runs the same task twice with different tools/conditions (e.g., Claude vs Gemini, different prompts), then synthesizes findings into a comparison report. Captures timing, output quality, and friction points for each run.

**Rationale**: A/B comparison pattern. Moves from "is this good?" to "is A better than B?". Useful for prompt optimization and tool selection.

**Failure Mode**: False equivalence if metrics are poorly defined. Can optimize for superficial qualities.

---

### Option 3: Process Archaeology Workflow ⚠️ GEMINI CONTRARIAN: AVOID
**Probability**: 15%

A handoff-based workflow where Session A executes blindly, Session B reviews independently, and Session C synthesizes both perspectives into actionable improvements. Three-stage separation ensures maximum objectivity.

**Rationale**: Natural context isolation via handoffs. Template for any skill validation.

**Failure Mode**: Extreme overhead & information loss. Session C lacks true context. Cost-benefit questionable.

**Gemini's Take**: "Likely a bad idea in practice. The coordination overhead of three separate sessions, the potential for information loss at each handoff, and the sheer time required make it impractical. Get 90% of the benefit with Comparator + Adversarial Review at 10% of complexity."

---

### Option 4: Kaizen Loop Plugin Architecture
**Probability**: 15%

A Claude Code plugin that wraps any skill execution with pre/post hooks. Pre-hook captures baseline state, post-hook triggers cf:conclude for reflection. Findings automatically append to a skill-specific improvement backlog.

**Rationale**: Hooks are native Claude Code capability. Makes improvement automatic rather than manual.

**Failure Mode**: Backlog bloat with low-signal suggestions. Firehose of trivial improvements.

---

### Option 5: Meta-Skill Factory Command ⭐ GEMINI PRIORITY #1
**Probability**: 15%

A cf command (/cf:meta-skill) that takes any repeated manual process and guides the user through extracting it into a formalized skill. Uses EXPAND to identify variations, SYNTHESIZE to find the core pattern, CONCLUDE to generate skill.yaml.

**Rationale**: Highest leverage - creates the foundational objects upon which all improvement operates. A skill for creating skills.

**Failure Mode**: Garbage in, garbage out. Can perfectly formalize a user's messy, inefficient process, enshrining bad habits.

---

### Option 6: Adversarial Review Protocol
**Probability**: 15%

A specialized review mode where the reviewer is explicitly prompted to find flaws, not validate. Includes a 'devil's advocate' persona that actively tries to break the skill. Outputs severity-rated findings with reproduction steps.

**Rationale**: Most reviews are too generous. Adversarial framing produces honest assessments.

**Failure Mode**: Destructive-only feedback without constructive paths. Can get stuck on pedantic issues.

---

## Gemini's Critical Feedback (Full Analysis)

### Prioritization Recommendation

| Priority | Option | Reasoning |
|----------|--------|-----------|
| **#1** | Meta-Skill Factory (#5) | Highest leverage - creates the objects to improve. Force multiplier. |
| **#2** | Dual-Execution Comparator (#2) | Provides immediate, data-driven value. A/B testing is proven. |

**Recommended Loop**: Meta-Skill Factory creates skills → Comparator improves them

### Critical Missing Pieces

1. **Structured Performance Metrics**
   - Token counts (prompt, completion, total)
   - Latency (end-to-end and per tool call)
   - Tool call statistics (success, failure, errors, retries)
   - Cost (if integrated with billing APIs)

   Without this data, "improvement" remains subjective.

2. **Regression & Evaluation Sets**
   - "Golden dataset" or evaluation examples
   - Skills must pass before AND after changes
   - Prevents improvements that cause regressions

### Best Combinations

| Combo | Components | Effect |
|-------|------------|--------|
| **Create-and-Refine Loop** | #5 + #2 | Factory creates `skill_v1.yaml`, Comparator tests variations to produce `skill_v2.yaml` |
| **Auto-Critical Hooks** | #4 + #6 | Kaizen pre/post hooks trigger Adversarial Review automatically |
| **Escalation Path** | #1 + #3 | cf:audit for lightweight review, Process Archaeology for deep-dive (if ever needed) |

### Failure Modes Summary

| Option | Failure Mode | Mitigation |
|--------|--------------|------------|
| cf:audit | Confirmation bias | External reviewer or adversarial prompt |
| Comparator | False equivalence | Well-defined, semantic metrics |
| Archaeology | Overhead kills it | Avoid - use Comparator + Adversarial instead |
| Kaizen Loop | Backlog bloat | Signal filtering, severity thresholds |
| Meta-Skill Factory | Formalizes bad habits | Validation step before skill creation |
| Adversarial Review | Destructive-only | Require constructive recommendations |

---

## Recommended Implementation: skill-forge

Based on dual-AI synthesis, implement a combined system:

### Core Components

```
skill-forge/
├── commands/
│   ├── cf:forge          # Full workflow orchestrator
│   ├── cf:extract        # Meta-Skill Factory (manual → skill.yaml)
│   ├── cf:compare        # Dual-Execution Comparator (A vs B)
│   └── cf:adversarial    # Adversarial Review Protocol
├── hooks/
│   └── kaizen-loop.js    # Pre/post execution hooks
├── metrics/
│   └── collector.js      # Structured performance data
├── evaluations/
│   └── regression-runner.js  # Golden dataset testing
└── templates/
    ├── skill.yaml.template
    ├── comparison-report.md.template
    └── adversarial-findings.md.template
```

### Workflow Pattern

```
┌─────────────────────────────────────────────────────────┐
│  1. EXTRACT (Meta-Skill Factory)                        │
│     Manual process → formalized skill.yaml              │
│     Uses: EXPAND → SYNTHESIZE → CONCLUDE                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  2. COMPARE (Dual-Execution Comparator)                 │
│     Run with Variation A (e.g., Claude)                 │
│     Run with Variation B (e.g., Gemini)                 │
│     Capture: timing, tokens, quality, friction          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  3. ADVERSARIAL (Critical Review)                       │
│     Devil's advocate analysis of both outputs           │
│     Severity-rated findings with reproduction steps     │
│     MUST include constructive recommendations           │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  4. SYNTHESIZE (Improvement Report)                     │
│     Merge comparison data + adversarial findings        │
│     Generate prioritized improvement backlog            │
│     Update skill.yaml with learnings                    │
└─────────────────────────────────────────────────────────┘
```

### Metrics to Capture (Per Execution)

```yaml
execution_metrics:
  timestamp: ISO-8601
  skill_name: string
  variation: A | B
  performance:
    tokens_prompt: number
    tokens_completion: number
    tokens_total: number
    latency_ms: number
    tool_calls: number
    tool_failures: number
  quality:
    user_rating: 1-5 (if provided)
    adversarial_severity_score: number
    regression_tests_passed: number
    regression_tests_failed: number
  friction:
    clarification_requests: number
    error_recoveries: number
    user_interventions: number
```

### Integration Points

- **cognitive-flow**: Use cf_think for EXPAND/SYNTHESIZE/CONCLUDE phases
- **ask-gemini**: Dual-AI comparison (Claude execution vs Gemini critique)
- **Claude Code hooks**: Kaizen loop pre/post automation
- **TodoWrite**: Improvement backlog tracking

---

## Your Task

1. **Review this entire handoff** - understand the strategic context
2. **Choose implementation scope**:
   - **Minimal**: Just `cf:compare` + `cf:adversarial` commands
   - **Standard**: Add `cf:extract` (Meta-Skill Factory)
   - **Full**: Complete skill-forge system with hooks and metrics
3. **Build incrementally** - start with highest-leverage components (#5, #2)
4. **Test against presentation-forge** - use it as the first validation target
5. **Document failure mode mitigations** - address each identified risk

## Success Criteria

- [ ] At least one new cf command implemented (`cf:compare` or `cf:extract`)
- [ ] Command integrates with cognitive-flow session graph
- [ ] Adversarial review produces severity-rated, actionable findings
- [ ] Metrics collection captures at least: tokens, latency, tool calls
- [ ] Tested against a real skill (presentation-forge)
- [ ] Improvement backlog generated from findings

## Files to Reference

```
# Cognitive-flow plugin
~/Workshop/claude-dev/plugins/cognitive-flow/

# Presentation-forge (test target)
~/Workshop/claude-dev/skills/presentation-forge/

# Related handoffs
~/Workshop/claude-dev/skills/presentation-forge/.claude/handoff-create-presentation.md
~/Workshop/claude-dev/skills/presentation-forge/.claude/handoff-critical-review.md

# Gemini integration
.mcp.json → gemini-cli MCP server
```

## Notes

- This handoff captures strategic thinking from cognitive-flow session `b28d0f40-4696-42f6-98b6-c545f6228c05`
- Dual-AI synthesis (Claude EXPAND + Gemini critique) validated the approach
- Avoid Process Archaeology (#3) - overhead kills practical value
- Prioritize: Meta-Skill Factory (#5) → Comparator (#2) → Adversarial (#6)

---

## ⭐ VALIDATED STRATEGY (cf_plan Ultrathink Result)

**Plan ID**: `acb2ad48-963b-4bed-b934-72c06b45a5d5`
**Phases Completed**: PLAN → CRITIQUE → SYNTHESIZE → EXECUTE ready

### Dual-AI Synthesis Summary

The original Claude plan proposed **"Compare & Critique"** MVP (cf:compare + cf:adversarial).
Gemini's critique identified a **cold-start problem**: without cf:extract, there's no way to create skills.

**Resolution**: MVP scope pivoted to **"Create & Critique"** (cf:extract + cf:adversarial).

### Points of Agreement (High Confidence)

Both Claude and Gemini agree:
1. **cf:adversarial is highest-value** - Critical review with severity ratings
2. **Human-in-the-loop mandatory** - AI-Assistant model at every gate
3. **Confirmation bias is real threat** - External review (Gemini) essential
4. **Over-engineering is biggest meta-risk** - Time-boxing essential
5. **Severity ratings enable triage** - Critical/Major/Minor categorization

### Key Divergences Resolved

| Topic | Claude | Gemini | Resolution |
|-------|--------|--------|------------|
| MVP Scope | compare + adversarial | extract + adversarial | **Accept Gemini** |
| cf:extract | Deferred (complex) | Essential (grounded) | **Accept Gemini** |
| cf:compare | MVP priority | Phase 2 | **Accept Gemini** |
| Skill versioning | Not addressed | Blind spot | **Add to schema** |
| known_limitations | Not in schema | Populate from review | **Add to schema** |

### REVISED MVP Scope (v1.0)

| Component | Priority | Rationale |
|-----------|----------|-----------|
| **cf:adversarial** | P0 | Both agree: highest-value, lowest-complexity |
| **cf:extract (grounded)** | P0 | Solves cold-start problem |
| **adversarial-persona.md** | P0 | Devil's advocate prompt |
| **skill.yaml schema v1** | P0 | With version + known_limitations |
| **adversarial-findings.md** | P0 | Structured output template |
| **reviewer_config** | P0 | Abstract adversary role |
| **README.md** | P0 | Quick-start documentation |

### cf:extract Design (Grounded Version)

```
Phase 1: RECORD
  cf:extract --start "skill-name"
  → Creates .forge/sessions/skill-name-draft/
  → Begins logging commands and tool calls

Phase 2: ANNOTATE (during work)
  cf:note "Semantic annotation about current step"
  → Appends to session log with timestamp

Phase 3: GENERATE
  cf:extract --finish
  → AI analyzes annotated session history
  → Proposes skill.yaml structure
  → User confirms or edits
  → Runs cf:adversarial automatically
```

### Phased Roadmap

**Phase 1 (MVP)**: Create & Critique
- cf:extract (grounded session transcriber)
- cf:adversarial (devil's advocate review)

**Phase 2**: Compare & Iterate
- cf:compare (A/B testing with metrics)
- cf:list / cf:search (discoverability)
- cf:backlog (improvement tracking)
- Metrics collection infrastructure

**Phase 3**: Scale & Productionize
- cf:regression (golden dataset testing)
- Kaizen loop hooks
- Marketplace integration

### Implementation Sessions

**Session 1: cf:adversarial (2 hours)**
- [ ] Create skill-forge directory structure
- [ ] Write skill.yaml with reviewer_config and known_limitations
- [ ] Write adversarial-persona.md prompt
- [ ] Implement cf:adversarial command
- [ ] Test against presentation-forge
- [ ] Document in README.md

**Session 2: cf:extract (2-3 hours)**
- [ ] Implement session recording (--start)
- [ ] Implement annotation (cf:note)
- [ ] Implement skill generation (--finish)
- [ ] Auto-trigger adversarial after extraction
- [ ] Test end-to-end
- [ ] Dogfood: Use cf:extract to formalize skill-forge itself

**Session 3: Polish & Validation (1-2 hours)**
- [ ] Write getting-started.md
- [ ] Add examples from validation runs
- [ ] Final self-review with cf:adversarial

### Success Criteria (Revised)

| Metric | Target |
|--------|--------|
| cf:extract end-to-end time | < 15 min |
| cf:adversarial actionable findings | > 80% |
| Cold-start problem | SOLVED |
| Self-improvement | skill-forge reviews skill-forge |

---

*This handoff represents the meta-improvement pattern itself - use skill-forge to improve skill-forge.*
