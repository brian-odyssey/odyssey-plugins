---
name: quiz
description: Quiz mode to test understanding of concepts or code. Generates questions based on recent work or specified topics. Helps reinforce learning through active recall. Triggers on "/quiz" or "test my knowledge" or "quiz me".
---

# Quiz Mode

Test and reinforce understanding through questions.

## Quiz Types

### 1. Concept Quiz
Test understanding of a programming concept.
```
User: "/quiz me on React hooks"
```

### 2. Code Reading Quiz
Show code, ask what it does or what's wrong.
```
User: "/quiz me on this function"
```

### 3. Bug Hunt Quiz
Present buggy code, user finds the issue.
```
User: "/quiz bug hunt"
```

### 4. Fill-in-the-Blank
Code with missing pieces to complete.
```
User: "/quiz fill in the blank on async/await"
```

## Question Format

```markdown
## Quiz: [Topic]

### Question [N]

[Question text]

```[language]
[code if applicable]
```

**Options** (if multiple choice):
A) [option]
B) [option]
C) [option]
D) [option]

---
Take your time. Say "answer" when ready, or "hint" if stuck.
```

## After User Answers

### If Correct
```
✅ **Correct!**

[Brief reinforcement of WHY it's correct]

[Optional: "Bonus question: what would happen if...?"]
```

### If Incorrect
```
❌ **Not quite.**

The answer is [X] because [explanation].

[Common misconception addressed if applicable]

Want to try a similar question to reinforce this?
```

### If Partially Correct
```
🔶 **Partially correct!**

You got [X] right, but [Y] isn't quite accurate because...

[Explanation]
```

## Question Banks by Topic

### JavaScript Fundamentals
- Closure behavior
- `this` binding
- Event loop / async execution order
- Prototype chain
- Truthy/falsy values

### React
- Component lifecycle
- Hook rules and behavior
- State update batching
- Re-render triggers
- Key prop purpose

### TypeScript
- Type narrowing
- Generic constraints
- Union vs intersection
- Type guards
- Utility types

## Example Quiz Session

```
User: "/quiz me on JavaScript closures"

You: ## Quiz: Closures

### Question 1

What will this code output?

```javascript
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
```

A) 0, 1, 2
B) 3, 3, 3
C) undefined, undefined, undefined
D) Error

---
Take your time. Say "answer" when ready.

User: "B"

You: ✅ **Correct!**

Because `var` is function-scoped (not block-scoped), there's only
ONE `i` variable. By the time the timeouts run, the loop has
finished and `i` is 3.

**Bonus:** How would you fix this to print 0, 1, 2?
(Hint: there are at least 3 different ways)

User: "use let instead of var"

You: ✅ That's one way! `let` is block-scoped, so each iteration
gets its own `i`.

Can you think of how to fix it while still using `var`?
(This tests deeper closure understanding)
```

## Adaptive Difficulty

- Start with medium difficulty
- If user gets 2+ right in a row → increase difficulty
- If user gets 2+ wrong in a row → decrease difficulty or offer review

## Session End

After 5-10 questions:
```
## Quiz Complete!

**Score:** 7/10

**Strong areas:**
- Closure behavior
- Async/await

**Review recommended:**
- Event loop execution order
- Promise chaining

Want to:
- [ ] Review the concepts you missed?
- [ ] Try another quiz?
- [ ] Practice with a coding exercise?
```
