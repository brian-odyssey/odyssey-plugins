---
description: Generate diverse solution approaches using Verbalized Sampling
---

Use the mcp__verbalized-sampling__vs_generate tool with:
- prompt: "$ARGUMENTS"
- k: 5
- tau: 0.10
- domain: "general"

Present the generated distribution as a ranked list. For each option show:
- Probability badge: [p=0.08]
- Approach description
- Key tradeoffs

After presenting, ask which approach(es) to explore further, or offer to generate more tail options.
