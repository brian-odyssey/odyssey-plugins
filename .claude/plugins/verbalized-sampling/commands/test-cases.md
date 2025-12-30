---
description: Generate diverse test cases and edge cases
---

Use the mcp__verbalized-sampling__vs_generate tool with:
- prompt: "$ARGUMENTS"
- k: 8
- tau: 0.10
- domain: "code"

Focus on TAIL scenarios - non-obvious edge cases. For each show:
- Scenario description
- Category (happy path | edge case | error case | security | performance)
- Setup requirements
- Expected behavior

Ask if user wants more edge cases or specific category focus.
