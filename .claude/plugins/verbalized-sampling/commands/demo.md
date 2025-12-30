---
description: Demonstrate Verbalized Sampling with creative prompts
---

**First, check if a prompt was provided:**

If "$ARGUMENTS" is empty or missing, display this error message instead of running the demo:

```
**Please provide a creative prompt**

Usage: `/vs:demo "write a poem about a bear"`

Try one of these:
- `/vs:demo "birthday gift ideas for a reader"`
- `/vs:demo "name ideas for a coffee shop"`
- `/vs:demo --showcase` (random preset)
- `/vs:demo --list` (see all presets)
```

Then stop - do not proceed with the demo.

---

**Check for list mode:**

If "$ARGUMENTS" equals "--list" (case-insensitive):

Display the available showcase presets:

```
**Available Showcase Presets**

1. "write a poem about a bear" - Poetry/Creative Writing
2. "birthday message for mom" - Personal Messages
3. "name ideas for a coffee shop" - Naming/Branding
4. "date night ideas for homebodies" - Planning/Ideas
5. "explain quantum physics to a child" - Explaining Concepts

**To run:**
- `/vs:demo --showcase` - Pick one randomly
- `/vs:demo "your own prompt"` - Use your own creative prompt
```

Then stop - do not proceed with the demo.

---

**Check for showcase mode:**

If "$ARGUMENTS" equals "--showcase" (case-insensitive):

1. Randomly select ONE of these preset prompts:
   - "write a poem about a bear"
   - "birthday message for mom"
   - "name ideas for a coffee shop"
   - "date night ideas for homebodies"
   - "explain quantum physics to a child"

2. Display: "**Showcase prompt:** [the selected prompt]"

3. Use the selected prompt as the demo prompt (use this prompt for tool invocation and verification section)

---

**Proceed with the demo:**

Determine the prompt to use:
- If showcase mode: use the randomly selected preset prompt
- Otherwise: use "$ARGUMENTS"

Use the mcp__verbalized-sampling__vs_generate tool with:
- prompt: [the determined prompt]
- k: 7
- tau: 0.05
- domain: "creative"

## How This Works

Verbalized Sampling forces diversity by limiting how much any single option can dominate.

**Without VS:** When you ask Claude a creative question, one "obvious" answer often takes over. Ask "write a poem about a bear" and you'll likely get a nature/forest poem most of the time.

**With VS (tau=0.05):** No single option can exceed 5% probability. This forces Claude to explore genuinely different directions - silly poems, sad poems, haiku, from the bear's perspective, and more.

Think of it like this: Instead of letting one idea hog the spotlight, VS makes room for 7 different voices at the table.

## Results

Present all 7 options as a ranked list by probability.

For each option, display:
- **[p=X.XX]** - Probability badge showing the option's weight
- **Title** - A brief descriptive name for the approach
- **Description** - What this option entails
- **Rationale** - Why this approach is interesting or unique

For options 6 and 7, add a ⭐ tail marker to highlight these as rare but interesting "long tail" approaches that standard prompting would miss.

Example format:
```
1. [p=0.05] **The Contemplative Observer**
   A poem from the bear's perspective...

6. ⭐ [p=0.04] **The Unexpected Angle**
   A surprising approach that...

7. ⭐ [p=0.03] **The Wild Card**
   An unconventional take that...
```

At the end, include:
- The distribution ID so the user can run follow-up operations

**What's Next: Diverge → Curate → Converge**

You just DIVERGED - generated 7 diverse options. Now you can:
- **Curate**: Review and evaluate which options resonate
- **Converge**: Use `/vs:top_k 3` to narrow to top 3, or `/vs:argmax` for the highest-probability option

**Explore More VS Commands:**
- `/vs:explore` - Deep exploration of a topic with follow-up questions
- `/vs:brainstorm` - Generate ideas with weighted probability insights

*Demo is educational; explore/brainstorm are for real work.*

## Verify This Yourself

Include a verification invitation with the prompt that was used:

```
**See the difference yourself:**
Copy this prompt and try it in a fresh Claude chat:
> "[the prompt used - either the selected preset or the user's original $ARGUMENTS]"

You'll likely get ONE answer. Compare that to the 7 diverse options above.
The difference isn't cherry-picking - it's the tau constraint at work.
```

Important: Show the actual prompt that was used (the selected preset if showcase mode, otherwise the user's $ARGUMENTS). Do NOT show "--showcase" in this section.

Note: This demo uses tau=0.05 (very low) to force maximum diversity. Each option is constrained to max 5% probability, preventing any single "obvious" answer from dominating.
