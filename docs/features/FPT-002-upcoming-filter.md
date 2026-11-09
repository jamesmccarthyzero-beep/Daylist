# FPT-002 — Upcoming Filter + Shared Date-Range Helper

**Project:** Daylist | **Milestone:** V2 | **Branch:** `v2-development`  
**Status:** Approved — learning and design before code  
**Owner:** Daylist developer | **Date:** 2026-11-08

> **Permanent feature record.** Uses the established 12-section FPT template. Requirements have been approved; implementation has **not** started. Use `docs/WorkBoard.md` for the current task. **Teaching process:** Learn → Understand → Plan → Implement → Verify → Review. Never treat an untested checkbox as complete.

## 1. The request (ticket)

**Problem:** Daylist's Today filter makes today's work visible, but there is no quick way to focus on near-future tasks. The Today and Upcoming filters also need similar date-checking logic, which we should not duplicate.

**User story:** As a Daylist user, I want an Upcoming view so I can focus on unfinished tasks due over the next week.

**Expected user experience:** Click **Upcoming** next to the existing filter buttons. The **same** task list displays only unfinished tasks due tomorrow through the seventh day after today. Selecting another filter restores its view. No tasks are deleted.

**Success measure:** Exact date boundaries, completion rule, dynamic updates after add/edit/check, existing filter regressions passing, usable layout, and saved task data unchanged.

**Out of scope:** Additional task lists/pages, new storage fields, calendar, notifications, recurring tasks, different sorting, automatic midnight refresh, further V2 filters.

## 2. Clarify requirements BEFORE coding

**All product decisions D1–D6 are APPROVED by the product owner.**

| ID | Question / ambiguity | Approved behavior | Decision / owner |
|---|---|---|---|
| D1 | Date window | **Tomorrow through day +7 inclusive**, based on local calendar days; excludes today | Approved — developer |
| D2 | Completed future tasks | **Hide** them; Upcoming is for incomplete work | Approved — developer |
| D3 | Overdue, today, undated, invalid dates | **Hide** all of them in Upcoming | Approved — developer |
| D4 | Sort Upcoming differently? | **No**; keep current priority-first, then due-date sorting | Approved — developer |
| D5 | Remember selected view after reload? | **No**; start on All | Approved — developer |
| D6 | Change counters/progress to visible-only? | **No**; global counts remain | Approved — developer |

**Acceptance criteria** — observable behavior; leave unchecked until tested:

- [ ] **AC1:** Upcoming button becomes selected and filters existing task elements, without a new task list.
- [ ] **AC2:** Incomplete tasks due **tomorrow** and **day +7** appear.
- [ ] **AC3:** Tasks due today, yesterday, day +8, without a date, or with an invalid date are hidden.
- [ ] **AC4:** Completed tasks in the Upcoming window are hidden.
- [ ] **AC5:** Newly added or edited tasks immediately enter/leave the view when appropriate.
- [ ] **AC6:** Checking off an Upcoming task hides it immediately.
- [ ] **AC7:** Existing All, Active, Completed, and **Today** still work after refactoring.
- [ ] **AC8:** Counters/progress remain global and task data is not deleted/changed by filtering.
- [ ] **AC9:** Five buttons fit and remain usable on narrow screens.
- [ ] **AC10:** Reload starts on All and saved task data remains intact.

**Engineering decision (design, not a new product rule):** Extract **one** date-range helper to share date validation and numeric range comparison. Keep one `applyFilter()` that decides visibility. First refactor Today **without changing its behavior**; verify; then add Upcoming.

## 3. Investigate the codebase

**Source files:** `index.html`, `style.css`, `app.js`, `storage.js`, FPT-001.  
**Grounding:** Function/DOM map below is based on the last `app.js` supplied. Confirm your current local file before editing; actual CSS rules have not been inspected here.

| Area | Element / function / selector | What it currently does | Why relevant |
|---|---|---|---|
| HTML | `index.html` → `<div class="filters">` | Contains All, Active, Completed, Today | Add Upcoming as fifth button |
| HTML | `.filter-btn`, `data-filter` | Shared button selector and filter identifier | `data-filter="upcoming"` joins existing event flow |
| CSS | `style.css` → search `.filters`, `.filter-btn`, `.active` | Layout and selected state | Verify responsive layout; don't invent styles |
| JS | `const filterButtons = document.querySelectorAll(".filter-btn")` | Gets filter buttons | Reuse unchanged |
| JS | `filterButtons.forEach(...)` click callback | Updates selected `.active` button and calls `applyFilter()` | Reuse unchanged |
| JS | `applyFilter(selectedFilter)` | Loops each `.task-item` and sets inline display | One visibility controller for all views |
| JS | `item.dataset.dueDate` | Reads date string from task `<li>` | Shared helper's task-date input |
| JS | `.task-checkbox.checked` | Reads completed status | Upcoming excludes completed |
| JS | `updateDueDateLabel(taskItem)` | Controls date label and overdue/today decoration | Do not move filtering into here |
| JS | Form submit listener | Add/edit, sort/save, reapply selected filter | Confirm both paths still work |
| JS | Task-list change listener | Checkbox changes, progress/save/filter/label | Completed Upcoming task must disappear |
| JS | `sortTasksByPriority()` | Priority-first then due-date order | Keep unchanged |
| Data | `getTasks()`, `saveTasks()`, `restoreTasks()`, `storage.js` | LocalStorage serialization and restoration | No changes needed |

### Function contracts

**`isDueDateInRange(dueDateString, startDate, endDate)` — proposed new helper**
- **Input:** One task's `"YYYY-MM-DD"` string (or empty), and two JavaScript Date boundaries normalized to local midnight.
- **Reads:** Only its arguments. It must not depend on DOM elements or active filter buttons.
- **Returns:** Boolean — `true` when a **valid** task calendar date falls between start/end **inclusive**; `false` for blank/invalid/out-of-range dates.
- **Must not do:** Query DOM, hide tasks, mutate inputs, save data, or decide completion status.
- **Validity note:** Check real local calendar validity (and whether parsing rolls over an impossible date) as part of the design; timestamp finiteness alone may not reject every impossible date.
- **Learning concepts:** Parameters vs. arguments, return values, booleans, scope, and one-function/one-responsibility.

**`applyFilter(selectedFilter)` — existing function, to refactor**
- **Input:** Selected view string (`"all"`, `"active"`, `"completed"`, `"today"`, `"upcoming"`).
- **Reads:** Existing task `<li>` elements, each due-date dataset string, completion status, current local calendar day.
- **Changes/returns:** Hides/shows each task using `item.style.display`; no meaningful return.
- **Must not do:** Delete tasks, create second list, save, or change sorting.
- **Design:** Today uses helper with `start = today, end = today`. Upcoming uses helper with `start = tomorrow, end = day +7`, plus the incomplete rule. Other existing branches stay intact.

**Filter button click listener — existing**
- **Input:** Button click; gets `button.dataset.filter`.
- **Effect:** Changes `.active` visual state, calls `applyFilter()`. No new listener necessary.

**Form submit / checkbox listeners — existing**
- **Effect:** Change task data and reapply selected filter. Must keep doing so after helper refactor.

**Existing functionality to reuse:** The four working filters, task dataset, add/edit reapplication, checkbox handler, sorting, storage.  
**Potential integration gaps:** Five-button mobile layout; local calendar boundary and Daylight Saving Time; invalid date rollover; Today regression after refactor; clock crossing midnight while page stays open.

## 4. Technical design — HTML / CSS / JS / data

**HTML:** Add an `Upcoming` button inside the existing `.filters` container using `type="button"`, `class="filter-btn"`, `data-filter="upcoming"`; do not build a separate view container.

**CSS:** First reuse the existing classes. Test the five buttons on desktop and narrow screens. Only change `.filters`/button rules if they do not fit.

**Data:** Existing `item.dataset.dueDate` strings (`"YYYY-MM-DD"` or `""`) and checkbox state. No new localStorage fields. Current date, window start/end are computed from local calendar dates.

**JavaScript responsibilities (design, no code yet):**
1. Teach helper function **parameters**, **arguments**, **return**, and why helper is independent of DOM.
2. Agree and document helper input/output contract; make an example table before coding.
3. Verify baseline Today behavior so refactor can be evaluated.
4. Implement helper only; test it independently using simple examples and console logs.
5. Refactor **Today** to use helper; retest the exact Today requirements.
6. Add Upcoming UI and check responsiveness.
7. Calculate tomorrow and day+7 boundaries using calendar-day movement (e.g. `Date.setDate()` rather than adding a fixed number of milliseconds across DST).
8. Use same helper for Upcoming, plus an incomplete-task check.
9. Extend `applyFilter()` with Upcoming branch; test integration and regressions.
10. Remove temporary logs, update docs, code review, Git.

**Shared helper design:**

```text
                 Task due-date string + start Date + end Date
                                     |
                                     v
             [isDueDateInRange: validate + compare calendar dates]
                                     |
                              true or false
                                     |
                      +--------------+--------------+
                      |                             |
                 Today rule                    Upcoming rule
               range = today..today           range = tomorrow..day+7
               completed allowed              completed excluded
                      |                             |
                      +--------------+--------------+
                                     |
                            applyFilter()
                                     |
                       Show/hide the SAME task <li>
```

**Date boundaries:** Inclusive on both ends, e.g. tomorrow is eligible and day+7 is eligible, but today and day+8 are not.

**Event / data flow:**

```text
User clicks Upcoming
  ↓
Existing button listener changes active class
  ↓
Read button.dataset.filter → "upcoming"
  ↓
applyFilter("upcoming")
  ↓
Compute local start/end window (tomorrow, day +7)
  ↓
For each task: read dataset.dueDate and checkbox.checked
  ↓
Call shared helper → is date inside window?
  ↓
Apply incomplete rule (Upcoming only)
  ↓
Hide non-matches / show matches
  ↓
Same task list, same saved data, no new storage
```

**Other entry points to review:** Adding, editing, checking/unchecking, deleting, clear completed, sorting, page reload; automatic midnight update explicitly out of scope.

## 5. Decision table (examples before code)

| Input / state | Expected behavior | Reason |
|---|---|---|
| Today: valid due today, incomplete | Visible in Today | Helper checks today..today |
| Today: valid due today, completed | Visible in Today | FPT-001 D1 remains unchanged |
| Today: due tomorrow / blank | Hidden in Today | Not in today's exact range |
| Upcoming: incomplete, due tomorrow | Visible | Inclusive first day |
| Upcoming: incomplete, due day +7 | Visible | Inclusive last day |
| Upcoming: incomplete, due day +8 | Hidden | Outside window |
| Upcoming: incomplete, due today/yesterday | Hidden | Today and overdue excluded |
| Upcoming: blank/invalid task date | Hidden | Helper rejects invalid/missing |
| Upcoming: completed due tomorrow | Hidden | Completion rule in `applyFilter()` |
| Switch to All | Every task visible | Filtering never deletes |
| Edit a due date into/out of range | View updates immediately | Existing submit reapplication |
| Check off task in Upcoming | Disappears immediately | Existing checkbox reapplication |
| Reload | All selected, saved tasks preserved | Existing behavior |

## 6. Work breakdown — one verified slice at a time

| Step | Work | Why / dependency | How to verify |
|---|---|---|---|
| 0 | Confirm D1–D6, requirements and proposed shared-helper design | Avoid changing behavior accidentally | Decisions marked approved |
| 1 | **LEARN:** Parameters, arguments, return values, pure helper, and responsibility | Understand design before writing code | Explain helper's inputs/output in plain English |
| 2 | **PLAN:** Function contract + valid/invalid/range examples | Translate requirement to a testable operation | Example table reviewed |
| 3 | Verify existing Today behavior before refactor | Establish baseline | Existing Today scenarios pass |
| 4 | Write and test helper independently | Validate calculation before UI integration | Logs show correct booleans for representative dates |
| 5 | Refactor Today to use helper; run regression tests | Reuse logic with no behavior change | Today remains exactly as FPT-001 |
| 6 | Add Upcoming HTML button, verify responsive styling | Reuse filter UI | Button toggles active; layout fits |
| 7 | Build upcoming calendar boundaries, test with logs | Correct inclusive local-day window | Tomorrow/day+7/day+8 behavior |
| 8 | Add Upcoming condition using helper and incomplete rule | Integrate new view | Decision table passes |
| 9 | Verify add/edit/checkbox, all filters, storage, sorting, counts | Regression prevention | QA checklist passes |
| 10 | Remove debug logs, review diff, complete FPT, commit and push | Release quality | Clean branch and recorded commit(s) |

**Next smallest action:** **Step 1 (LEARN)** — explain *parameters, arguments, and return values* using a small non-Daylist example; then review the helper's proposed contract. No application code yet.

## 7. Risks / edge cases

| Risk | Impact | Mitigation / test |
|---|---|---|
| Empty/invalid date string | Erroneous visibility | Helper returns false; test blank and impossible dates |
| Date object identity vs. value | Incorrect comparison | Normalize to local days; compare numeric timestamps |
| DST and month/year boundaries | Off-by-one errors | Use calendar-day advancement (`setDate`), not fixed milliseconds |
| Refactor changes Today | Regression | Today baseline before and after refactor |
| Completed task in Upcoming | Incorrect contents | Completion rule remains outside helper |
| Editing/adding/changing completion | Stale visibility | Verify existing filter reapplication |
| Five buttons on mobile | Crowded/overflow | Test at narrow widths |
| Midnight crossing while page open | Window becomes stale | Known out-of-scope limitation |
| Excess abstraction | Harder-to-read code | One small focused helper; avoid multiple parallel filter functions |

## 8. QA test plan

| Test ID | Setup / action | Expected | Pass / notes |
|---|---|---|---|
| T01 | Helper with valid in-range task date | true | [ ] Not run |
| T02 | Helper with blank/invalid/out-of-range dates | false | [ ] Not run |
| T03 | Today after refactor: due today (open or completed) | Visible | [ ] Not run |
| T04 | Today after refactor: yesterday/tomorrow/blank | Hidden | [ ] Not run |
| T05 | Click Upcoming | Active styling and existing list filtered | [ ] Not run |
| T06 | Upcoming: tomorrow and day+7, incomplete | Visible | [ ] Not run |
| T07 | Upcoming: today, yesterday, day+8, blank/invalid | Hidden | [ ] Not run |
| T08 | Upcoming: completed future task | Hidden | [ ] Not run |
| T09 | Add and edit tasks into/out of window | Immediate correct visibility | [ ] Not run |
| T10 | Check a visible Upcoming task | Disappears; stored data remains | [ ] Not run |
| T11 | All/Active/Completed unchanged | Correct counts/visibility | [ ] Not run |
| T12 | Reload app | All initially active; tasks restored | [ ] Not run |
| T13 | Global progress/count and priority sort | Unchanged | [ ] Not run |
| T14 | Narrow viewport and browser console | Usable five buttons; no new errors | [ ] Not run |

## 9. Code review checklist

- [ ] Product rules and acceptance criteria met
- [ ] Helper has clear name, documented input/output and **no DOM side effects**
- [ ] No duplicated date parsing/range comparison between Today and Upcoming
- [ ] Completion rule remains separate from date helper
- [ ] Existing Today behavior unchanged after refactor
- [ ] Handles blank and invalid dates
- [ ] Local calendar boundaries and inclusive range verified
- [ ] No accidental storage, sorting, or counter modifications
- [ ] No temporary logs or unrelated edits
- [ ] I can explain input → helper → boolean → `applyFilter()` → task visibility

**Change summary / PR draft:** Pending.  
**Files expected:** `app.js`, `index.html`, optionally `style.css`, FPT and WorkBoard.  
**Testing evidence:** Pending.

## 10. Development log

### 2026-11-08 — Requirements approval / architecture planning
- **Goal:** Upcoming as last planned V2 view and shared helper design.
- **My proposed approach and why:** Reuse `applyFilter()` and extract date-range validation/comparison into one helper; refactor Today safely before adding Upcoming.
- **Files/functions changed:** Documentation only. No FPT-002 application code yet.
- **Expected:** Approved behavior and teach-first implementation plan.
- **Observed:** D1–D6 approved; helper extraction proposed and accepted for planning.
- **Blocker / bug / lesson:** Need to learn function contracts, parameters/arguments/return values before coding.
- **Next action:** WorkBoard L1 — Learn and explain helper inputs/output without writing code.

## 11. Definition of Done / handoff

- [x] Product decisions D1–D6 recorded
- [ ] All acceptance criteria met
- [ ] QA table filled with observed results
- [ ] Code diff reviewed and no unrelated changes
- [ ] Documentation and function map updated after implementation
- [ ] Focused code/doc commit(s) made and pushed
- [ ] Commit hash(es) recorded
- [ ] FPT status changed to Done

**Suggested code commit:** `feat: add upcoming task filter`  
**Git commit(s):** Pending.  
**Known limitations / follow-ups:** View not automatically recomputed at midnight until another UI interaction/reload. Additional filters beyond Upcoming are not planned for V2.

## 12. Retrospective (learn the engineering process)

- **What did I decide on my own?** Noticed common Today/Upcoming date logic and proposed reusability.
- **Where did I need help/documentation?** Pending implementation.
- **What code do I understand better now?** Pending implementation.
- **What would I do differently next time?** Pending implementation.

---

**DOM reminder:** Between tags → `.textContent`; input/dropdown → `.value`; `data-*` attribute → `.dataset`.
