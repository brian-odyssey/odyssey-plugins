---
theme: default
title: "{{TITLE}}"
info: |
  {{DESCRIPTION}}

  Stakeholder Briefing - Created with presentation-forge
author: "{{AUTHOR}}"
keywords: []
exportFilename: "{{EXPORT_FILENAME}}"
themeConfig:
  primary: '{{PRIMARY_COLOR | #3b82f6}}'
---

# {{TITLE}}

{{SUBTITLE}}

<div class="absolute bottom-10 left-10 text-sm opacity-60">
{{AUTHOR}} · {{DATE}} · Stakeholder Briefing
</div>

---

# Agenda

<div class="grid grid-cols-2 gap-8 mt-8">
<div>

## Today's Focus

<v-clicks>

- Context & Background
- Current State
- Proposed Approach
- Decision Points
- Next Steps

</v-clicks>

</div>
<div>

## Meeting Goals

<v-clicks>

- Align on direction
- Gather feedback
- Secure approvals
- Define action items

</v-clicks>

</div>
</div>

<!--
Timing: 3 minutes
Set expectations for the meeting format
-->

---
layout: section
---

# Context & Background

Why are we here today?

---

# The Challenge

<div class="mt-8">

{{CHALLENGE_DESCRIPTION}}

</div>

<div class="grid grid-cols-3 gap-4 mt-8">
<div class="p-4 bg-red-900/30 rounded-lg text-center">

### Impact 1
{{IMPACT_1}}

</div>
<div class="p-4 bg-red-900/30 rounded-lg text-center">

### Impact 2
{{IMPACT_2}}

</div>
<div class="p-4 bg-red-900/30 rounded-lg text-center">

### Impact 3
{{IMPACT_3}}

</div>
</div>

<!--
Speaker Notes:
- Establish urgency without creating panic
- Reference specific metrics or incidents
-->

---

# What We've Learned

<v-clicks>

- **Discovery 1**: Insight and implication
- **Discovery 2**: Insight and implication
- **Discovery 3**: Insight and implication

</v-clicks>

<div class="mt-8 p-4 bg-blue-900/30 rounded-lg">

**Key Insight**: {{KEY_INSIGHT}}

</div>

---
layout: section
---

# Current State

Where we are today

---

# Current Architecture/Process

```mermaid
flowchart TD
    A[Current State] --> B[Component 1]
    A --> C[Component 2]
    B --> D[Pain Point]
    C --> D
    D --> E[Impact]
```

<!--
Speaker Notes:
- Walk through the current state diagram
- Highlight pain points explicitly
-->

---

# Gap Analysis

| Area | Current | Target | Gap |
|------|---------|--------|-----|
| {{AREA_1}} | {{CURRENT_1}} | {{TARGET_1}} | {{GAP_1}} |
| {{AREA_2}} | {{CURRENT_2}} | {{TARGET_2}} | {{GAP_2}} |
| {{AREA_3}} | {{CURRENT_3}} | {{TARGET_3}} | {{GAP_3}} |

<div class="mt-4 text-yellow-400">

⚠️ **Risk if unaddressed**: {{RISK_STATEMENT}}

</div>

---
layout: section
---

# Proposed Approach

Our recommended path forward

---

# Strategic Options

<div class="grid grid-cols-3 gap-4">
<div class="p-4 bg-gray-800 rounded-lg">

### Option A
{{OPTION_A_NAME}}

<v-click>

**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1

</v-click>

</div>
<div class="p-4 bg-blue-900/40 rounded-lg border-2 border-blue-500">

### Option B ⭐
{{OPTION_B_NAME}}

<v-click>

**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1

**Recommended**

</v-click>

</div>
<div class="p-4 bg-gray-800 rounded-lg">

### Option C
{{OPTION_C_NAME}}

<v-click>

**Pros**:
- Pro 1
- Pro 2

**Cons**:
- Con 1

</v-click>

</div>
</div>

<!--
Speaker Notes:
- Present all options fairly
- Explain why Option B is recommended
- Be prepared for questions on each
-->

---

# Recommended Approach: {{OPTION_B_NAME}}

<div class="grid grid-cols-2 gap-8">
<div>

## What We'll Do

<v-clicks>

1. Phase 1: {{PHASE_1}}
2. Phase 2: {{PHASE_2}}
3. Phase 3: {{PHASE_3}}

</v-clicks>

</div>
<div>

## Expected Outcomes

<v-clicks>

- ✅ {{OUTCOME_1}}
- ✅ {{OUTCOME_2}}
- ✅ {{OUTCOME_3}}

</v-clicks>

</div>
</div>

---

# Timeline Overview

```mermaid
gantt
    title Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Phase 1
    Task 1           :a1, 2024-01-01, 30d
    Task 2           :a2, after a1, 20d
    section Phase 2
    Task 3           :b1, after a2, 25d
    section Phase 3
    Task 4           :c1, after b1, 15d
```

---
layout: section
---

# Decision Points

🔐 Approval Checkpoint

---

# Decisions Needed Today

<div class="space-y-6 mt-8">

<div class="p-4 bg-yellow-900/30 rounded-lg border-l-4 border-yellow-500">

### Decision 1: {{DECISION_1_TITLE}}

{{DECISION_1_DESCRIPTION}}

**Options**: A) {{DECISION_1_A}} | B) {{DECISION_1_B}}

</div>

<div class="p-4 bg-yellow-900/30 rounded-lg border-l-4 border-yellow-500">

### Decision 2: {{DECISION_2_TITLE}}

{{DECISION_2_DESCRIPTION}}

**Options**: A) {{DECISION_2_A}} | B) {{DECISION_2_B}}

</div>

</div>

<!--
Speaker Notes:
- Pause here for discussion
- Capture decisions explicitly
- Don't proceed until alignment achieved
-->

---
layout: section
---

# Next Steps

Concrete actions and owners

---

# Immediate Actions

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| {{ACTION_1}} | {{OWNER_1}} | {{DUE_1}} | 🔲 Pending |
| {{ACTION_2}} | {{OWNER_2}} | {{DUE_2}} | 🔲 Pending |
| {{ACTION_3}} | {{OWNER_3}} | {{DUE_3}} | 🔲 Pending |

<div class="mt-8 p-4 bg-green-900/30 rounded-lg">

**Next Meeting**: {{NEXT_MEETING_DATE}} - {{NEXT_MEETING_PURPOSE}}

</div>

---

# Summary

<v-clicks>

1. **The Challenge**: {{SUMMARY_CHALLENGE}}
2. **Our Recommendation**: {{SUMMARY_RECOMMENDATION}}
3. **Key Decision**: {{SUMMARY_DECISION}}
4. **Next Step**: {{SUMMARY_NEXT_STEP}}

</v-clicks>

---
layout: center
class: text-center
---

# Questions & Discussion

<div class="mt-8 text-xl">

Thank you for your time and attention.

</div>

<div class="mt-4 opacity-60">

{{AUTHOR}} · {{EMAIL}}

</div>

<!--
Q&A Preparation:
- Anticipated Q1: {{Q1}} → Answer: {{A1}}
- Anticipated Q2: {{Q2}} → Answer: {{A2}}
- Anticipated Q3: {{Q3}} → Answer: {{A3}}
-->
