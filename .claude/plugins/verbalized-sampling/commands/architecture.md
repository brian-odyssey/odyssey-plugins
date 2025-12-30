---
description: Generate diverse architecture options for system design
---

Use the mcp__verbalized-sampling__vs_generate tool with:
- prompt: "$ARGUMENTS"
- k: 5
- tau: 0.12
- domain: "architecture"

For each architecture option, present:
- Architecture name and brief description
- Probability badge
- Key components
- Best suited for (use case conditions)
- Watch out for (potential pitfalls)

Ask which to detail further or if user wants hybrid combinations.
