# FPT-001 — Today Filter | Working Quick Reference

**Project:** Daylist V2 · **Branch:** `v2-development` · **Status:** In progress  
**Full specification:** [FPT-001-today-filter-trial.md](./FPT-001-today-filter-trial.md)  
**Purpose:** Open this page *while coding*. Read the full FPT for the why; use this page for the next action, exact code locations, and checkboxes.


## Product decisions — Approved

| ID | Decision |
|---|---|
| D1 | **Yes:** Include completed tasks if due today |
| D2 | **No:** Do not include overdue tasks |
| D3 | **Hide:** Tasks with no due date do not appear in Today |
| D4 | **No:** Do not change task counters/progress; they remain global |
| D5 | **No:** Do not remember the selected filter after refresh; start on All |

**Scope:** Today is a *view of existing tasks*. It does not create a new page, card, list, sort, or storage format.

## What happens on a click (read top to bottom)

```text
Existing task <li> elements are already in #task-list
          ↓
User clicks <button data-filter="today">
          ↓
Existing filterButtons click listener runs
          ↓
Remove "active" class from other buttons; add to Today
          ↓  (active class changes BUTTON APPEARANCE only)
Read button.dataset.filter → "today"
          ↓
applyFilter("today") runs
          ↓
For EACH .task-item <li>:
  read item.dataset.dueDate → e.g. "2026-11-10" or ""
  compare task's date to today's local day
  use item.style.display = "none" to HIDE non-matches
  use item.style.display = "" to SHOW matches
          ↓
SAME task list on screen, different visible tasks
```

**Page loading:** `restoreTasks()` reads saved tasks from `localStorage` via `loadTasks()`, creates task elements, and puts them in the DOM. Filters inspect **those current DOM task elements**, not localStorage directly on every click. Add/edit/delete update the DOM and save data.

## Find it fast — Code/DOM map

| Need | File → exact location / name | What it does |
|---|---|---|
| Filter buttons | `index.html` → `<div class="filters">` | The All / Active / Completed / Today controls |
| Identify a button | HTML → `class="filter-btn"` | Shared styling and JS selector |
| Identify filter choice | HTML → `data-filter="today"` | JS reads `button.dataset.filter` |
| Selected button style | `style.css` → search `.filter-btn`, `.active` | Verify actual CSS rules; reuse them |
| Get all filter buttons | `app.js` → `document.querySelectorAll(".filter-btn")` | Today automatically joins existing buttons |
| Handle filter clicks | `app.js` → `filterButtons.forEach(...)` | Sets button `.active`, calls `applyFilter` |
| Decide task visibility | `app.js` → `applyFilter(selectedFilter)` | **Main feature implementation location** |
| Find each task | `app.js` → `.querySelectorAll(".task-item")` | Each `item` in `forEach` is a whole `<li>` |
| Get saved task date | `app.js` → `item.dataset.dueDate` | Reads the `<li>`'s `data-due-date` string |
| Get completion | `app.js` → `item.querySelector(".task-checkbox").checked` | Read checked state (Today includes both) |
| Existing date example | `app.js` → `updateDueDateLabel(taskItem)` | Formats label and detects today/overdue; **not filter logic** |
| Set date on new task | `app.js` → `createTaskElement(task)` | Writes `newItem.dataset.dueDate` |
| Add/edit task | `app.js` → `taskForm.addEventListener("submit", ...)` | Add already reapplies filter; **edit does not yet** |
| Load saved tasks | `app.js` → `restoreTasks()`; `storage.js` → `loadTasks()` | Creates DOM from saved data at startup |
| Save task data | `app.js` → `saveTasks()`; `storage.js` | Persists tasks; filtering must not save |

**HTML / JS reminder:** `data-due-date` ↔ `.dataset.dueDate`; between tags ↔ `.textContent`; form controls ↔ `.value`.

## Implementation sequence — Check when verified

### A. Understand and prepare
- [x] A1. Answer product questions D1–D5.
- [x] A2. Locate the existing filter click listener and `applyFilter()`.
- [x] A3. Copy decisions D1–D5 into the full FPT (the original trial still says "proposed").

### B. HTML and CSS
- [x] B1. Add the Today button using `class="filter-btn"` and `data-filter="today"`.
- [x] B2. In browser, verify Today appears and its active highlight switches properly.
- [x] B3. Check four buttons at a narrow viewport; change CSS only if needed.

### C. JavaScript
- [x] C1. Reuse the current click listener (no extra listener needed).
- [x] C2. In `applyFilter()`, read `item.dataset.dueDate` for each task.
- [x] C3. Prepare `today` once and each task's `date` as local Date objects.
- [x] **C4. CURRENT STEP:** Prevent blank/invalid dates from matching Today.
- [x] C5. Compare calendar days by **numeric date values** (not `Date` objects with `===`).
- [x] C6. Extend the existing visibility conditions for `"today"`, retaining All / Active / Completed.
- [x] C7. In the **edit** branch of form submit, reapply the current filter after changes are saved.
- [x] C8. Remove temporary `console.log(dueDate)` after verifying behavior.

### QA. Test and finish
- [x] QA1. Today shows incomplete + completed tasks due today.
- [x] QA2. Today hides yesterday, tomorrow, no date, and invalid dates.
- [x] QA3. Switching among All / Active / Completed / Today works.
- [x] QA4. Add new tasks while Today is selected (matching and nonmatching).
- [x] QA5. Edit a due date today → tomorrow and tomorrow → today while Today is selected.
- [x] QA6. Check/uncheck, delete, sort, and refresh still work.
- [x] QA7. Counters remain global; no console errors; buttons fit mobile.
- [x] QA8. Review `git diff`, update the full FPT test results, and commit.
- [x] QA9. Record commit hash, mark the full FPT **Done**.

## Three important technical gotchas

1. A blank `dueDate` is `""`; `new Date("" + "T00:00:00")` is invalid. Guard empty or invalid values before comparing.
2. `date === today` is not a reliable calendar comparison for two Date objects; use normalized numeric values such as `.getTime()`.
3. Removing `.active` from filter **buttons** only changes which button looks selected. Hiding task **elements** is the separate job of `applyFilter()` using `item.style.display`.

## Work log — Add one brief entry after each session

**Date:** __________ · **Working on:** A3 (sync decisions), then C4 (empty dates)  
**Changed:** __________ · **Why:** __________  
**Tested / observed:** __________ · **Blocked on:** __________  
**Next action:** __________

## Git checkpoint (after passing tests)

- [x] Run `git status` and review the changed files.
- [x] Run `git diff` and `git diff --check`.
- [x] Update FPT decisions, tests, and final behavior notes.
- [x] Stage only relevant files; make a focused feature commit.
- [x] Push `v2-development` after committing.

**Suggested commit:** `feat: add today task filter`

> **If stuck:** First name the checkbox (for example **C5**) and the missing idea. Search the relevant API/docs or ask for a hint on *that step*—not the entire feature.
