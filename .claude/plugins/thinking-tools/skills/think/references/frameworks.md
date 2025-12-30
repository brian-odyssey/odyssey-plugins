# Thinking Frameworks

Optional frameworks to combine with sequential thinking for specialized analysis.

## Table of Contents
- [First Principles](#first-principles)
- [Pre-mortem](#pre-mortem)
- [Six Thinking Hats](#six-thinking-hats)
- [Devil's Advocate](#devils-advocate)
- [SCAMPER](#scamper)
- [5 Whys](#5-whys)

---

## First Principles

Break problems down to fundamental truths, then rebuild solutions.

**Process:**
1. Identify the problem or assumption
2. Break it down to foundational truths (what do we KNOW?)
3. Question each "truth" - is it actually true or just convention?
4. Rebuild from verified fundamentals

**Example thought:**
```
**Thought 3/6** [First Principles]
Common assumption: "We need a database for user data."
Fundamental truth: We need to persist user state between sessions.
Question: Does "persist" require a traditional database?
Alternatives: Local storage, file system, distributed cache, blockchain.
For our use case (100 users, read-heavy): SQLite file would suffice.
```

---

## Pre-mortem

Imagine the project has failed, then work backward to prevent it.

**Process:**
1. Assume the project/decision has failed spectacularly
2. List all plausible reasons for the failure
3. Rank by likelihood and impact
4. Develop mitigations for top risks

**Example thought:**
```
**Thought 4/7** [Pre-mortem]
Assume: The migration failed and we lost customer data.
Likely causes:
1. Rollback script wasn't tested (HIGH - no backup plan)
2. Schema mismatch between environments (MEDIUM)
3. Timeout on large tables (MEDIUM)
4. Permission issues in prod (LOW)
Mitigation for #1: Run full migration on prod clone first.
```

---

## Six Thinking Hats

Examine problems from six distinct perspectives.

| Hat | Focus | Question |
|-----|-------|----------|
| White | Facts | What data do we have? What's missing? |
| Red | Emotions | What's my gut reaction? What feels wrong? |
| Black | Caution | What could go wrong? What are the risks? |
| Yellow | Optimism | What's the best case? What opportunities exist? |
| Green | Creativity | What alternatives exist? What's unconventional? |
| Blue | Process | Are we on track? What's the next step? |

**Example thought:**
```
**Thought 2/5** [Six Hats: Black + Yellow]
Black (risks): The new auth system adds a dependency on a third party.
If their service goes down, our users can't log in.
Yellow (opportunity): But it also means we don't maintain auth code,
reducing our security surface area significantly.
Balance: Implement with a fallback to cached sessions during outages.
```

---

## Devil's Advocate

Deliberately argue against the prevailing position.

**Process:**
1. Identify the current leading solution/hypothesis
2. Forcefully argue the opposite position
3. Find genuine weaknesses in the original position
4. Strengthen or abandon based on findings

**Example thought:**
```
**Thought 5/8** [Devil's Advocate]
Current position: "We should use microservices for the new feature."
Counter-argument: Microservices add network latency, deployment complexity,
and distributed system failure modes. Our team is 3 people. The "feature"
is a single CRUD endpoint. A monolith function would ship in 2 days vs 2 weeks.
Verdict: The counter-argument is stronger. Monolith wins.
```

---

## SCAMPER

Creative ideation through systematic modifications.

| Letter | Action | Question |
|--------|--------|----------|
| S | Substitute | What can be replaced? |
| C | Combine | What can be merged? |
| A | Adapt | What can be borrowed from elsewhere? |
| M | Modify | What can be changed (bigger, smaller, different)? |
| P | Put to other use | What else could this be used for? |
| E | Eliminate | What can be removed? |
| R | Reverse/Rearrange | What if we flip the order or structure? |

**Best for:** Feature ideation, UX improvements, process optimization.

---

## 5 Whys

Drill down to root cause through repeated "why" questions.

**Process:**
1. State the problem
2. Ask "Why?" and answer
3. Repeat 4 more times on each answer
4. The final answer often reveals the root cause

**Example:**
```
Problem: Deploys are slow.
Why? → CI pipeline takes 45 minutes.
Why? → Tests run sequentially.
Why? → Test framework wasn't configured for parallelism.
Why? → Original setup was copy-pasted from a tutorial.
Why? → No one reviewed the CI config since initial setup.
Root cause: Technical debt in CI configuration, not the tests themselves.
```

---

## Combining Frameworks

Frameworks can be layered within sequential thinking:

```
**Thought 1/6**
Starting with First Principles to understand the core problem...

**Thought 2/6** [First Principles]
[Analysis]

**Thought 3/6** [Pre-mortem]
Now assuming my solution fails...

**Thought 4/6** [Devil's Advocate]
Challenging my own conclusion...

**Thought 5/6**
Synthesizing insights from all frameworks...

**Thought 6/6**
Final recommendation with confidence assessment.
```
