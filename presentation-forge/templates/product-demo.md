---
theme: default
title: "{{TITLE}}"
info: |
  {{DESCRIPTION}}

  Product Demo - Created with presentation-forge
author: "{{AUTHOR}}"
keywords: []
exportFilename: "{{EXPORT_FILENAME}}"
highlighter: shiki
lineNumbers: false
themeConfig:
  primary: '{{PRIMARY_COLOR | #f59e0b}}'
---

# {{PRODUCT_NAME}}

<div class="text-3xl mt-4 opacity-80">

{{TAGLINE}}

</div>

<div class="absolute bottom-10 left-10 text-sm opacity-60">
{{AUTHOR}} · {{DATE}} · Product Demo
</div>

---

# The Problem

<div class="text-2xl leading-relaxed">

{{PROBLEM_STATEMENT}}

</div>

<v-clicks>

- 😤 **Pain Point 1**: {{PAIN_1}}
- 😤 **Pain Point 2**: {{PAIN_2}}
- 😤 **Pain Point 3**: {{PAIN_3}}

</v-clicks>

<!--
Presenter Notes:
- Pause after each pain point
- Let the audience nod in recognition
- Ask "Sound familiar?" before next slide
-->

---

# Current Reality

<div class="grid grid-cols-2 gap-8">
<div class="p-6 bg-red-900/30 rounded-lg border-l-4 border-red-500">

### Without {{PRODUCT_NAME}}

<v-clicks>

- ❌ {{WITHOUT_1}}
- ❌ {{WITHOUT_2}}
- ❌ {{WITHOUT_3}}
- ❌ {{WITHOUT_4}}

</v-clicks>

</div>
<div class="p-6 bg-green-900/30 rounded-lg border-l-4 border-green-500">

### With {{PRODUCT_NAME}}

<v-clicks>

- ✅ {{WITH_1}}
- ✅ {{WITH_2}}
- ✅ {{WITH_3}}
- ✅ {{WITH_4}}

</v-clicks>

</div>
</div>

---
layout: section
---

# How It Works

<div class="text-2xl mt-4">

{{VALUE_PROPOSITION}}

</div>

---

# At a Glance

```mermaid
flowchart LR
    A[{{INPUT}}] --> B[{{PRODUCT_NAME}}]
    B --> C[{{OUTPUT_1}}]
    B --> D[{{OUTPUT_2}}]
    B --> E[{{OUTPUT_3}}]

    style B fill:#f59e0b,color:#000
```

<div class="mt-8 text-center">

**In just {{TIME_TO_VALUE}}**

</div>

---

# Key Features

<div class="grid grid-cols-3 gap-6">
<div class="p-4 bg-amber-900/30 rounded-lg text-center">

### {{FEATURE_1_ICON}}
## {{FEATURE_1_NAME}}

{{FEATURE_1_DESC}}

</div>
<div class="p-4 bg-amber-900/30 rounded-lg text-center">

### {{FEATURE_2_ICON}}
## {{FEATURE_2_NAME}}

{{FEATURE_2_DESC}}

</div>
<div class="p-4 bg-amber-900/30 rounded-lg text-center">

### {{FEATURE_3_ICON}}
## {{FEATURE_3_NAME}}

{{FEATURE_3_DESC}}

</div>
</div>

---
layout: section
---

# Live Demo

<div class="text-2xl mt-4">

Let's see it in action

</div>

---

# Demo Scenario

<div class="p-6 bg-gray-800 rounded-lg">

## The Setup

{{DEMO_SCENARIO}}

**Starting Point:**
- {{STARTING_STATE_1}}
- {{STARTING_STATE_2}}

**Goal:**
- {{DEMO_GOAL}}

</div>

<!--
DEMO SCRIPT:
1. Open {{DEMO_START_POINT}}
2. Show the problem state
3. Switch to product
4. Perform actions: {{DEMO_ACTIONS}}
5. Show result
6. Highlight the before/after
-->

---

# Demo: Step 1

<div class="grid grid-cols-2 gap-6">
<div>

## What We're Doing

{{DEMO_STEP_1_DESC}}

**Action:**
```
{{DEMO_STEP_1_ACTION}}
```

</div>
<div>

## Watch For

- 👀 {{WATCH_1}}
- 👀 {{WATCH_2}}

</div>
</div>

---

# Demo: Step 2

<div class="grid grid-cols-2 gap-6">
<div>

## What We're Doing

{{DEMO_STEP_2_DESC}}

**Action:**
```
{{DEMO_STEP_2_ACTION}}
```

</div>
<div>

## Watch For

- 👀 {{WATCH_3}}
- 👀 {{WATCH_4}}

</div>
</div>

---

# Demo: Result

<div class="p-6 bg-green-900/30 rounded-lg border-2 border-green-500 text-center">

## {{RESULT_HEADLINE}}

<div class="text-xl mt-4">

{{RESULT_DETAILS}}

</div>

</div>

<div class="mt-8 grid grid-cols-3 gap-4 text-center">
<div>

**Time Saved**
# {{TIME_SAVED}}

</div>
<div>

**Errors Prevented**
# {{ERRORS_PREVENTED}}

</div>
<div>

**Improvement**
# {{IMPROVEMENT_METRIC}}

</div>
</div>

---

# Before & After

| Aspect | Before | After |
|--------|--------|-------|
| {{ASPECT_1}} | {{BEFORE_1}} | {{AFTER_1}} |
| {{ASPECT_2}} | {{BEFORE_2}} | {{AFTER_2}} |
| {{ASPECT_3}} | {{BEFORE_3}} | {{AFTER_3}} |
| {{ASPECT_4}} | {{BEFORE_4}} | {{AFTER_4}} |

---
layout: section
---

# Customer Success

<div class="text-2xl mt-4">

Real results from real users

</div>

---

# Case Study: {{CUSTOMER_NAME}}

<div class="grid grid-cols-2 gap-8">
<div>

## The Challenge

{{CUSTOMER_CHALLENGE}}

## The Solution

{{CUSTOMER_SOLUTION}}

</div>
<div class="p-6 bg-amber-900/30 rounded-lg">

## Results

<div class="text-3xl font-bold text-amber-400">{{RESULT_HEADLINE_METRIC}}</div>

{{RESULT_CONTEXT}}

<div class="mt-4 text-sm italic">

"{{CUSTOMER_QUOTE}}"

— {{CUSTOMER_PERSON}}, {{CUSTOMER_TITLE}}

</div>

</div>
</div>

---

# By the Numbers

<div class="grid grid-cols-4 gap-6 text-center">
<div>

<div class="text-4xl font-bold text-amber-400">{{STAT_1}}</div>
{{STAT_1_LABEL}}

</div>
<div>

<div class="text-4xl font-bold text-amber-400">{{STAT_2}}</div>
{{STAT_2_LABEL}}

</div>
<div>

<div class="text-4xl font-bold text-amber-400">{{STAT_3}}</div>
{{STAT_3_LABEL}}

</div>
<div>

<div class="text-4xl font-bold text-amber-400">{{STAT_4}}</div>
{{STAT_4_LABEL}}

</div>
</div>

---
layout: section
---

# Why {{PRODUCT_NAME}}?

---

# Competitive Advantage

<div class="grid grid-cols-2 gap-8">
<div>

## What Others Do

- {{COMPETITOR_APPROACH_1}}
- {{COMPETITOR_APPROACH_2}}
- {{COMPETITOR_APPROACH_3}}

</div>
<div class="p-4 bg-amber-900/30 rounded-lg">

## What We Do Differently

<v-clicks>

- 🚀 {{DIFFERENTIATOR_1}}
- 🚀 {{DIFFERENTIATOR_2}}
- 🚀 {{DIFFERENTIATOR_3}}

</v-clicks>

</div>
</div>

---

# Integration Ecosystem

```mermaid
flowchart TB
    subgraph Inputs[" "]
        A[{{INTEGRATION_1}}]
        B[{{INTEGRATION_2}}]
        C[{{INTEGRATION_3}}]
    end

    D[{{PRODUCT_NAME}}]

    subgraph Outputs[" "]
        E[{{OUTPUT_INTEGRATION_1}}]
        F[{{OUTPUT_INTEGRATION_2}}]
        G[{{OUTPUT_INTEGRATION_3}}]
    end

    A --> D
    B --> D
    C --> D
    D --> E
    D --> F
    D --> G

    style D fill:#f59e0b,color:#000
```

---

# Pricing

<div class="grid grid-cols-3 gap-6">
<div class="p-6 bg-gray-800 rounded-lg text-center">

### {{TIER_1_NAME}}
<div class="text-3xl font-bold my-4">{{TIER_1_PRICE}}</div>

- {{TIER_1_FEATURE_1}}
- {{TIER_1_FEATURE_2}}
- {{TIER_1_FEATURE_3}}

</div>
<div class="p-6 bg-amber-900/40 rounded-lg border-2 border-amber-500 text-center">

### {{TIER_2_NAME}} ⭐
<div class="text-3xl font-bold my-4">{{TIER_2_PRICE}}</div>

- {{TIER_2_FEATURE_1}}
- {{TIER_2_FEATURE_2}}
- {{TIER_2_FEATURE_3}}
- **{{TIER_2_BONUS}}**

</div>
<div class="p-6 bg-gray-800 rounded-lg text-center">

### {{TIER_3_NAME}}
<div class="text-3xl font-bold my-4">{{TIER_3_PRICE}}</div>

- {{TIER_3_FEATURE_1}}
- {{TIER_3_FEATURE_2}}
- {{TIER_3_FEATURE_3}}
- {{TIER_3_FEATURE_4}}

</div>
</div>

---
layout: section
---

# Getting Started

---

# Next Steps

<div class="grid grid-cols-3 gap-6">
<div class="p-6 bg-gray-800 rounded-lg text-center">

### 1. {{STEP_1_NAME}}

{{STEP_1_DESC}}

**{{STEP_1_CTA}}**

</div>
<div class="p-6 bg-gray-800 rounded-lg text-center">

### 2. {{STEP_2_NAME}}

{{STEP_2_DESC}}

**{{STEP_2_CTA}}**

</div>
<div class="p-6 bg-gray-800 rounded-lg text-center">

### 3. {{STEP_3_NAME}}

{{STEP_3_DESC}}

**{{STEP_3_CTA}}**

</div>
</div>

---

# Special Offer

<div class="p-8 bg-amber-900/30 rounded-lg border-2 border-amber-500 text-center">

## {{OFFER_HEADLINE}}

<div class="text-2xl my-6">

{{OFFER_DETAILS}}

</div>

**Valid until: {{OFFER_EXPIRY}}**

<div class="mt-6">

👉 **{{OFFER_CTA}}**: {{OFFER_URL}}

</div>

</div>

---
layout: center
class: text-center
---

# Questions?

<div class="grid grid-cols-3 gap-8 mt-8">
<div>

**Sales**
{{SALES_EMAIL}}

</div>
<div>

**Support**
{{SUPPORT_EMAIL}}

</div>
<div>

**Demo**
{{DEMO_URL}}

</div>
</div>

<div class="mt-8 opacity-60">

{{AUTHOR}} · {{EMAIL}}

</div>

---
layout: center
class: text-center
---

# Thank You!

<div class="text-2xl mt-6">

Ready to {{CTA_ACTION}}?

</div>

<div class="mt-8">

**{{FINAL_URL}}**

</div>
