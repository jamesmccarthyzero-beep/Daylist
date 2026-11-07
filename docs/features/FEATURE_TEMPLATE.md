# Daylist — Feature Planning Template

> **How to use:** Copy this file to `docs/features/feature-name.md` every time you start a feature. Fill it in **before coding**, then update the checklist and log as you go. For a tiny feature, short answers are fine. Mark sections N/A when they don't apply.

## 0. Ticket information

- **Feature name:**
- **Branch:** `v2-development`
- **Status:** `Planning | In progress | Testing | Done | Blocked`
- **Started:** 
- **Depends on:** 

## 1. Goal: What and why?

**User story:** As a [user], I want [capability], so that [benefit].

**One-sentence definition of success:**

**Why are we building this?**

**Out of scope:** (What are we deliberately *not* building?)

## 2. Acceptance criteria: How should it behave?

Describe observable results, not JavaScript code.

- [ ] Given [situation], when [action], then [result].
- [ ] Given [edge case], when [action], then [result].
- [ ] Old features still work: [name them].
- [ ] Unexpected/empty input is handled: [behavior].

**Decisions to resolve:** (Examples: should Today include completed tasks? Should Upcoming mean 7 days?)
- **Question:** 
- **Decision and reason:** 

## 3. Explore the current codebase — before changing it

| Area | Existing element / function | What it already does |
|---|---|---|
| HTML | | |
| CSS | | |
| JS: event listener | | |
| JS: function | | |
| Data / localStorage | | |

**Where should this behavior live, and why?**

**Which existing code can I reuse?**

## 4. Design the feature in plain English

### User action → response

```text
USER DOES:
  ↓
HTML ELEMENT / EVENT:
  ↓
JS EVENT LISTENER:
  ↓
DATA TO READ (where?):
  ↓
DECISION / VALIDATION:
  ↓
UI UPDATE (what changes?):
  ↓
SAVE TO STORAGE? (why / why not?):
  ↓
OTHER UI TO REFRESH (counts, sorting, filter, date labels):
```

### Which files need changes?

| File/area | Change? | What and why? |
|---|---|---|
| `index.html` | Yes / No | |
| CSS file | Yes / No | |
| `app.js` | Yes / No | |
| `storage.js` | Yes / No | |

### Algorithm in human language — no code yet

1.
2.
3.
4.

**Data types to watch:** (e.g., string vs Date object)

## 5. What could go wrong? (edge cases)

- [ ] Empty / missing data
- [ ] Invalid or unexpected data
- [ ] Existing tasks vs newly added tasks
- [ ] Editing or deleting while the feature is active
- [ ] Completed vs incomplete tasks
- [ ] After browser reload
- [ ] Date boundaries / time zones (if relevant)
- [ ] Other:

## 6. Implementation plan: Small, testable slices

Do one slice at a time. Write **how you will verify** it before doing it.

- [ ] **Step 1:** ... — **Verify:** ...
- [ ] **Step 2:** ... — **Verify:** ...
- [ ] **Step 3:** ... — **Verify:** ...
- [ ] **Step 4:** ... — **Verify:** ...
- [ ] **Step 5:** ... — **Verify:** ...

**Next smallest action:** 

## 7. Manual test plan

| Scenario | Expected result | Actual / Pass? |
|---|---|---|
| Normal use | | |
| Empty state | | |
| Edge case | | |
| After adding | | |
| After editing | | |
| After reloading page | | |
| Regression: previous feature | | |

**Any console errors?**
**Any visual issues?**

## 8. Development log (fill as you work)

### [YYYY-MM-DD] — [session title]
- **Goal:**
- **Changes made:**
- **Expected:**
- **Actual result:**
- **Bug / decision / lesson:**
- **Next action:**

## 9. Definition of Done

- [ ] Acceptance criteria pass.
- [ ] Edge cases checked.
- [ ] Existing features still work.
- [ ] No new browser console errors.
- [ ] I can explain the feature's data and event flow.
- [ ] Plan and dev log updated.
- [ ] `git diff` reviewed.
- [ ] Change committed with a descriptive message.
- [ ] Feature status changed to Done.

**Commit / release note:**

---

### Three DOM-property reminders

1. **Between tags?** `.textContent`
2. **Input or dropdown?** `.value`
3. **Starts with `data-`?** `.dataset`

### Optional instruction to an AI coding coach

> Review my plan and ask me to propose the next step. Point out gaps, offer hints before code, and show full solutions only if I ask. My goal is to learn to plan and implement features independently.
