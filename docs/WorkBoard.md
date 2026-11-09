# Daylist — Active WorkBoard

**Feature:** FPT-002 — Upcoming Filter + Shared Date-Range Helper  
**Project:** Daylist V2 · **Branch:** `v2-development` · **Status:** Approved / Learning  
**Full plan:** [FPT-002-upcoming-filter.md](./features/FPT-002-upcoming-filter.md)  
**Last updated:** 2026-11-08

> **One live WorkBoard.** The complete FPT is the permanent record. This file is the **short checklist to keep open while building**. Preserve the completed WorkBoard and FPT in a Git commit before replacing this file for the next feature.

## START HERE — Current step (read this first)

**NOW → L1: LEARN reusable functions before code.**

**We know WHAT:** Show incomplete tasks due tomorrow through the seventh following calendar day.

**We know WHERE:** Existing `app.js` → `applyFilter(selectedFilter)`; shared date checker will be a small helper function called from this function.

**We are learning HOW:** Design a helper with **inputs (parameters)**, **one boolean result (`return`)**, and **no DOM manipulation**.

**First learning outcome:** Explain, in your own words, *what three inputs the helper receives, what it returns, and what it must not change*.

**Do NOT edit app.js yet.** Next after L1: write a few example cases, baseline-test Today, then implement/refactor one step at a time.

## Approved product decisions — no open questions

- [x] **D1** — Upcoming = tomorrow through day +7, inclusive (local calendar days)
- [x] **D2** — Exclude completed tasks
- [x] **D3** — Exclude today, overdue, blank, invalid dates
- [x] **D4** — Keep current priority-first/date sorting
- [x] **D5** — Reload starts on All
- [x] **D6** — Counters/progress stay global

**Scope:** A fifth **view of existing tasks**, not another page/list/card/storage system. After Upcoming, prioritize V2 polish/release rather than more views.

## 30-second architecture map

```text
Click Today OR Upcoming
       ↓
Existing filter click listener → applyFilter(selectedFilter)
       ↓
Read current task's due-date string
       ↓
[SHARED date-range helper]
   inputs: taskDateString, startDate, endDate
   returns: true or false (valid and inside range?)
       ↓
Today: range today..today (completed allowed)
Upcoming: range tomorrow..day+7 AND task incomplete
       ↓
applyFilter decides visible / hidden
       ↓
Same task list; no task data is changed by filtering
```

**Refactor rule:** Make Today use the shared helper and **prove it still works** BEFORE adding Upcoming logic.

## Find it fast — file/element/function map

| Need | Exact file / place | Action |
|---|---|---|
| Filter controls | `index.html` → `<div class="filters">` | Add fifth button **after** Today refactor |
| Button selector/value | `.filter-btn`, `data-filter="upcoming"` | Existing listener will read this |
| Button styles | `style.css` → search `.filters`, `.filter-btn`, `.active` | Reuse; verify five-button mobile layout |
| Click handling | `app.js` → `filterButtons.forEach(...)` | **Reuse unchanged** |
| Visibility controller | `app.js` → `applyFilter(selectedFilter)` | Call helper for Today/Upcoming, preserve other views |
| Current Today date logic | In `applyFilter()` → `today`, `date`, `hasValidDate`, `isToday` | Refactor after testing helper |
| Task stored date | `item.dataset.dueDate` | Pass **string** into helper |
| Task completed? | `item.querySelector(".task-checkbox").checked` | Upcoming must exclude completed |
| Label formatting | `updateDueDateLabel(taskItem)` | **Do not** put filtering inside this function |
| Reapply on changes | Form submit (add/edit); task-list change listener | Verify both still call active filter |
| Sorting | `sortTasksByPriority()` | Leave unchanged |
| Persistence | `getTasks()`, `saveTasks()`, `restoreTasks()`, `storage.js` | Leave unchanged |

**New proposed helper contract:** `isDueDateInRange(dueDateString, startDate, endDate)` → boolean. Validates task date, checks inclusive calendar-day range. **No DOM, no save, no completion rule**.

## Checkboxes — verify before checking

### A. Requirements + learn-first

- [x] A1. Approve product decisions D1–D6.
- [x] **L1. CURRENT — Learn** parameters vs arguments, return values, function responsibility.
- [x] L2. Explain helper's three inputs, result, and why it must not manipulate the page.
- [x] L3. Plan sample cases (today, tomorrow, day+7, day+8, no date, invalid date).

### B. Safe refactor of Today (before Upcoming)

- [x] B1. Review current `applyFilter()` and baseline-test Today (including completed due-today task).
- [x] B2. Implement helper independently of UI and test sample date-range booleans with console logs.
- [x] B3. Make Today call helper using start/end = today.
- [x] B4. Regression-test Today (due today, past, tomorrow, blank, completed) and other existing views.
- [x] B5. Remove temporary logs from this step.

### C. Upcoming UI + behavior

- [x] C1. Add Upcoming `<button>` in `index.html` using `.filter-btn` and `data-filter="upcoming"`.
- [x] C2. Verify active button styling; test narrow screens and adjust CSS only if necessary.
- [x] C3. Prepare local calendar boundaries **tomorrow** and **day +7** (inclusive); log/verify.
- [x] C4. Apply shared helper to task date for Upcoming and separately check task is incomplete.
- [x] C5. Add Upcoming visibility branch to existing `applyFilter()`; test matching/nonmatching tasks.
- [x] C6. Verify add/edit/checkbox changes immediately reapply the selected Upcoming view.
- [x] C7. Remove debug logs.

### D. QA + Git

- [x] QA1. Upcoming shows incomplete tasks due tomorrow and day +7.
- [x] QA2. Upcoming hides today, yesterday, day +8, blank/invalid dates, completed future tasks.
- [x] QA3. Today still shows completed due-today tasks; other filters work.
- [x] QA4. Add/edit/check/delete, sort, progress/counts, reload still work correctly.
- [x] QA5. Five buttons work on mobile; no console errors.
- [x] QA6. Run `git status`, `git diff --check`, and inspect `git diff`.
- [x] QA7. Fill real QA results in full FPT, update function map and work log.
- [x] QA8. Commit code and docs in focused commits; push `v2-development`.
- [x] QA9. Record hashes, mark FPT **Done**, commit the completed documentation.
- [x] QA10. Only then replace WorkBoard for next feature; Git keeps prior board revisions.

## Work log (brief)

**2026-11-08:** Approved Upcoming rules. Recognized reusable date logic between Today and Upcoming. Added explicit learn-first / safe-refactor sequence to FPT-002.  
**Current:** L1 — Function inputs/outputs/responsibility.  
**Next:** L2 — Explain proposed helper contract; no Daylist code yet.

## Git + documentation

- [x] Review changes and ensure `main` is untouched.
- [x] Commit this plan when reviewed (`docs: approve FPT-002 shared date helper plan`).
- [x] Commit code changes in focused checkpoints as work progresses.
- [x] Update docs with test results and hashes when finished.

**Reminder:** HTML between tags → `.textContent` · form controls → `.value` · `data-*` → `.dataset`.
