---
theme: default
title: "{{TITLE}}"
info: |
  {{DESCRIPTION}}

  Created with presentation-forge
author: "{{AUTHOR}}"
keywords: []
exportFilename: "{{EXPORT_FILENAME}}"
# Branding customization hooks
themeConfig:
  primary: '{{PRIMARY_COLOR | #3b82f6}}'
  secondary: '{{SECONDARY_COLOR | #10b981}}'
  background: '{{BACKGROUND | #0f172a}}'
---

# {{TITLE}}

{{SUBTITLE}}

<div class="absolute bottom-10 left-10 text-sm opacity-60">
{{AUTHOR}} · {{DATE}}
</div>

---

# Agenda

<v-clicks>

- Section 1
- Section 2
- Section 3

</v-clicks>

---
layout: section
---

# Section 1

---

# Slide Title

Content goes here.

<v-clicks>

- Point 1
- Point 2
- Point 3

</v-clicks>

<!--
Speaker notes for this slide.
Key points to emphasize:
- Note 1
- Note 2
-->

---
layout: section
---

# Section 2

---

# Another Slide

<div class="grid grid-cols-2 gap-4">
<div>

## Left Column

Content for left side.

</div>
<div>

## Right Column

Content for right side.

</div>
</div>

---

# Diagram Example

```mermaid
flowchart LR
    A[Start] --> B[Process]
    B --> C[End]
```

---
layout: section
---

# Summary

---

# Key Takeaways

<v-clicks>

1. **Takeaway 1**: Description
2. **Takeaway 2**: Description
3. **Takeaway 3**: Description

</v-clicks>

---
layout: center
class: text-center
---

# Questions?

<div class="mt-8">

Contact: {{EMAIL}}

</div>

<!--
Q&A Notes:
- Anticipated question 1: Answer approach
- Anticipated question 2: Answer approach
-->
