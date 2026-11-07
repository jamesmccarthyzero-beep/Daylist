# FPT-001 — Today Filter
**Project:** Daylist · **Milestone:** V2 · **Type:** Feature · **Working branch:** `v2-development`  
**Status of this exercise:** Planning / ready for product sign-off  
**Author:** Daylist developer (training ticket)  
**Purpose:** A fully worked **Feature Planning Template (FPT)**, written *as if we had just received the request and had not coded Today yet*.

> **Important:** This is a planning simulation. In the real Daylist branch, the Today button and some date-preparation code have already been added. The checked boxes below represent the **start-of-feature workflow**, not a claim that your work is unfinished or lost. After this trial, reconcile this plan against the code you've already written.

---

## 1. The request (the "ticket")

### Problem
Daylist can filter tasks by All / Active / Completed, but a user cannot quickly see **which tasks are due today**. They must scan dates manually.

### User story
**As a Daylist user, I want to select a Today view, so that I can focus on tasks whose due date is today.**

### Expected user experience
- A **Today** button appears alongside All, Active, and Completed.
- Clicking it highlights the Today button and changes only **which tasks are visible**.
- Switching to any other view still works.
- The filter does **not delete, modify, or resave** tasks.

### Outcome / success measure
A user can click Today and see exactly the tasks that meet the agreed Today rule, including after tasks are added, edited, checked, or restored.

### Explicitly NOT included in this ticket
Upcoming view; overdue view; notifications; recurring tasks; calendar integration; changing task sort order; changing localStorage format; saving the active filter across reloads.

---

## 2. Clarify requirements BEFORE coding

### Product questions / decision log

| ID | Question | Proposed default for trial | Final decision |
|---|---|---|---|
| D1 | Should Today include completed tasks that are due today? | **Yes** — Today is a date-based view, not an incomplete-only view | **Needs your sign-off** |
| D2 | Does Today include overdue tasks? | **No** — match today's calendar date only | **Needs your sign-off** |
| D3 | What about tasks without a due date? | Hide in Today | Proposed |
| D4 | Should the Today view change the task counters/progress? | No; existing counters remain **global** across all tasks | Proposed |
| D5 | Should Today remain selected after a page refresh? | No new persistence; app starts in existing All state | Proposed |

**Why this matters:** If the product decision changes, the code and tests change. A developer should not quietly guess what "Today" means.

### Acceptance criteria (observable behavior; no implementation details)
- [ ] **AC1:** Given Today exists, when I click it, its button becomes active and the previous filter loses active styling.
- [ ] **AC2:** Given an incomplete task due today, when Today is active, that task is visible.
- [ ] **AC3:** Given a task due yesterday or tomorrow, when Today is active, it is hidden.
- [ ] **AC4:** Given a task without a date, when Today is active, it is hidden.
- [ ] **AC5:** Given a completed task due today, it follows decision D1.
- [ ] **AC6:** Given Today is selected, adding a task immediately applies the Today rule.
- [ ] **AC7:** Given Today is selected, editing a task's due date updates its visibility without switching tabs.
- [ ] **AC8:** Checking or unchecking a task does not leave the view in an inconsistent state.
- [ ] **AC9:** All, Active, and Completed keep their existing behavior.
- [ ] **AC10:** Reloaded tasks are correctly filtered when the user selects Today.
- [ ] **AC11:** Filtering never changes or deletes task data; no new console errors.

### Definition of "today"
The **user's local calendar day**, midnight to just before the following midnight. A due date is a date, not a deadline with a particular hour.

---

## 3. Investigate the existing codebase (read first, edit later)

**Source reviewed:** Your provided `app.js` and the filter-button HTML excerpt.  
**CSS file:** Not provided; find and verify the existing `.filter-btn` and `.active` rules rather than assuming a file name.

### Codebase map — responsibilities, not every line

| Area | Existing element/function | Responsibility today | Relevance |
|---|---|---|---|
| HTML | `<div class="filters">` / `.filter-btn` | Renders filter controls | Add Today using the existing pattern |
| HTML data attribute | `data-filter="all"` etc. | Provides an identifier to JS | Today uses `data-filter="today"` |
| CSS | `.filter-btn`, active styling (verify selectors) | Shows selected button state | Reuse rather than duplicate |
| JS — setup | `filterButtons = document.querySelectorAll(".filter-btn")` | Collects filter buttons | New Today button included if present when script runs |
| JS — event listener | `filterButtons.forEach(...addEventListener("click"...))` | Updates active class, reads `button.dataset.filter`, calls `applyFilter()` | Already routes clicks; should require no new listener |
| JS — filter function | `applyFilter(selectedFilter)` | Iterates every `.task-item` and sets `item.style.display` for All / Active / Completed | **Primary location for Today logic** |
| JS — task DOM | `createTaskElement(task)` | Creates `<li class="task-item">`, saves `dataset.dueDate` and `dataset.priority` | Today can reuse stored due date |
| JS — date UI | `updateDueDateLabel(taskItem)` | Formats date and adds overdue / due-today styles | Existing example of local-midnight date handling; **not** where filtering belongs |
| JS — checkbox change | `taskList.addEventListener("change", ...)` | Refreshes progress, saves, reapplies active filter, updates due date label | Verify Today behavior on check/uncheck |
| JS — form submit, add path | `taskForm.addEventListener("submit", ...)` | Creates, sorts, saves, then reapplies active filter | New tasks should respect Today already |
| JS — form submit, edit path | `if (editingTask !== null) { ... }` | Updates task date/priority/text; sorts, saves | **Gap:** doesn't call `applyFilter()` after an edit |
| JS — storage | `getTasks()`, `saveTasks()`, `storage.js` | Serialize all tasks to localStorage | Should not change |
| JS — restore/sort | `restoreTasks()`, `sortTasksByPriority()` | Rebuilds and sorts task nodes | Filter must work regardless of task order |

### Mini function contracts (what each relevant function promises)

**`applyFilter(selectedFilter)`**  
- **Input:** filter name string (`"all"`, `"active"`, `"completed"`, future `"today"`).  
- **Reads:** current task elements, checkbox state, and for Today, `item.dataset.dueDate`.  
- **Changes:** each task element's visible/hidden state only.  
- **Does not:** change saved task data, task text, or due-date labels.

**`updateDueDateLabel(taskItem)`**  
- **Input:** one whole `<li>` task element.  
- **Reads:** `dataset.dueDate`, checkbox state.  
- **Changes:** the *visible due-date label* and its CSS classes.  
- **Does not:** decide which tasks appear under Today.

**`createTaskElement(task)`**  
- **Input:** task data object.  
- **Output:** a new task `<li>` with child controls and `data-*` attributes.  
- **Why it matters:** guarantees the filter has a common place to read due dates.

**Submit handler (edit branch)**  
- **Role:** modify an existing task and synchronize the UI/storage.  
- **Change needed:** reapply the active filter after editing, because a due-date edit may change whether this task belongs in Today.

**Why use function contracts?** They help you navigate an unfamiliar codebase without writing commentary beside every obvious line.

---

## 4. Technical design — HTML, CSS, JavaScript, data

### HTML design
**Change:** Add a fourth button following existing markup conventions:
- `type="button"` — does not submit the task form.
- `class="filter-btn"` — receives existing styling and the common click handler.
- `data-filter="today"` — machine-readable identifier consumed by JS.
- Visible label: `Today`.

**Naming rule:** lowercase `data-filter` values. `"Today"` and `"today"` are different strings in JS.

### CSS design
**Expected:** No new CSS. The new button reuses `.filter-btn` and `.active` styles.  
**Verify:** Four buttons fit properly on phone and desktop; selected Today looks like selected Active.  
**Only add CSS** if the four-button layout actually needs adjustment.

### Data design
A task already has a saved due date:
- HTML: `<li class="task-item" data-due-date="2026-11-10">`
- JS read: `item.dataset.dueDate`
- Data type: **string**, normally `"YYYY-MM-DD"`, sometimes `""`.
- Checkbox state: boolean from the existing checkbox.
- **No new database fields, no localStorage migration.**

Remember: the data lives on the **whole `<li>` task**, not on the checkbox or its label.

### JavaScript design
**Keep one filtering decision point** inside `applyFilter(selectedFilter)`. Avoid adding a second Today-only click listener or duplicating filtering in `updateDueDateLabel()`.

**Date strategy:**
- Obtain the local current date once per filter run.
- Normalize it to local midnight.
- For a nonempty stored due-date string, interpret it at **local midnight** (your app already uses `dueDate + "T00:00:00"`).
- Compare calendar days, not raw `Date` object references: `dateA === dateB` compares objects, not their dates. Numeric timestamps (e.g. `.getTime()`) work after normalization.
- Never rely on parsing a blank date. Invalid values should not match Today.
- Avoid UTC-based formatting for a local-day filter; UTC conversions can shift the calendar day in some time zones.

### Event/data flow

```text
User clicks Today
    ↓
HTML button: .filter-btn, data-filter="today"
    ↓
Existing click listener:
  - removes .active from other buttons
  - adds .active to Today
  - reads button.dataset.filter
    ↓
applyFilter("today")
    ↓
For each .task-item <li>:
  - read item.dataset.dueDate
  - read checkbox.checked if required by the product decision
  - compare task's calendar date with today's local calendar date
  - set item.style.display to show or hide
    ↓
Task list visually updates
    ↓
No task data is saved just because the filter changed
```

### Other entry points (important integration work)
- **Add task:** existing add path calls `applyFilter(activeFilter)`; verify it.
- **Edit task:** add equivalent refresh after edit (missing in the submitted code).
- **Checkbox change:** existing change handler reapplies active filter; verify completed-task rule.
- **Delete:** task disappears because its `<li>` is removed; no new filter logic needed.
- **Reload:** `restoreTasks()` rebuilds tasks; existing All default remains; selecting Today should work on restored tasks.
- **Sorting:** existing sort remains priority first, then date; Today is a **view**, not a new sort.

---

## 5. Decision table — design behavior before code

For this **trial example only**, assume **D1 = include completed tasks** and **D2 = exactly today**. Confirm or change these before shipping.

| Due date | Completed? | Today view | Reason |
|---|---|---|---|
| Today | No | Show | Date matches |
| Today | Yes | Show* | Date matches; D1 proposed yes |
| Yesterday | No or yes | Hide | Not today |
| Tomorrow | No or yes | Hide | Not today |
| Empty | No or yes | Hide | No date to match |
| Invalid unexpected value | No or yes | Hide | Cannot establish a valid match |

`*` If you choose unfinished-only Today, that row changes to **Hide**, and the implementation/testing plan must reflect it.

**Potential future choice:** If Daylist later gains an Overdue view, today's exact-date behavior avoids overlap.

---

## 6. Work breakdown — implementation slices

A developer completes **one slice at a time**, running its small test before moving on. These are tasks, **not code answers**.

| Step | Work item | Why / dependency | Verify before next step |
|---|---|---|---|
| **0** | Resolve D1 and D2; record answers in this FPT | No ambiguous product rules | Decision table matches agreed behavior |
| **1** | Trace the existing click listener → `applyFilter()` flow | Understand the system before changing it | Can explain where button value comes from |
| **2** | Add Today button using existing HTML pattern | Expose the feature | It appears, gets active styling, no console error |
| **3** | Write sample task scenarios / expected visible results | Tests should guide implementation | Decision table reviewed |
| **4** | Make the task's due date available inside the existing `forEach` | Filter needs task data | Can log the date for a task when function runs |
| **5** | Prepare today's local date and each nonblank task date in comparable form | Prevent string-vs-Date and time-of-day mistakes | Today/tomorrow/blank cases distinguished |
| **6** | Add Today visibility decision **without breaking** existing branches | Core behavior | Today, tomorrow, yesterday, no-date behave as expected |
| **7** | Reapply active filter after an edit is saved | Keep view synchronized | Edit today→tomorrow and tomorrow→today; visibility updates |
| **8** | Verify add, checkbox, sorting, delete, and reload | Integration & regression | Every scenario below passes |
| **9** | Inspect responsive styling, console and Git diff | Quality review | No extra CSS, debug logs, or accidental changes |
| **10** | Update FPT log and commit feature | Traceable delivery | Commit message and test notes recorded |

**Implementation strategy:** Make the smallest targeted change to the existing filtering flow. Refactoring into helper functions is optional, not required for this feature.

**Debugging tip:** `dueDate` declared inside `forEach` is local to that callback. Log it **inside** the callback while `applyFilter()` runs; typing `dueDate` into the top-level browser console will not access it.

---

## 7. Risks, edge cases, and tradeoffs

| Risk | Consequence | Mitigation / test |
|---|---|---|
| Empty date | Invalid date parsing or wrong visibility | Guard no-date case; it never matches |
| JS Date equality with `===` | Two equivalent Date objects compare false | Compare normalized calendar times |
| UTC/local-day mismatch | Off-by-one date near some time zones | Keep date parsing local and test near midnight if needed |
| Completed-task ambiguity | Users see unexpected tasks | Resolve D1 before coding |
| Overdue ambiguity | Today shows too many/few tasks | Resolve D2 before coding |
| Edit changes due date | Old visibility remains | Reapply active filter after edit |
| Existing filters regress | All / Active / Completed show wrong tasks | Regression matrix |
| Four buttons on narrow screen | Controls overflow | Mobile layout check |
| Counter semantics unclear | User thinks count means visible tasks | Document that counters remain global |

**Non-goal:** Automatically updating an already-open Today view exactly at midnight without any user action or refresh. That would require additional behavior; track as a separate ticket if needed.

---

## 8. QA test plan (manual, repeatable)

Use a fixed set of sample tasks with dates relative to **the day you test**, not hardcoded November dates.

| Test ID | Setup / action | Expected result | Result |
|---|---|---|---|
| T01 | Click Today | Today button active; other buttons inactive | ☐ |
| T02 | Incomplete task due today | Visible | ☐ |
| T03 | Completed task due today | Visible under proposed D1 | ☐ |
| T04 | Task due yesterday | Hidden | ☐ |
| T05 | Task due tomorrow | Hidden | ☐ |
| T06 | Task with no due date | Hidden | ☐ |
| T07 | Switch to All | Every task visible | ☐ |
| T08 | Switch to Active | Only incomplete tasks visible | ☐ |
| T09 | Switch to Completed | Only completed tasks visible | ☐ |
| T10 | With Today selected, add task due tomorrow | New task stays hidden | ☐ |
| T11 | With Today selected, add task due today | New task appears | ☐ |
| T12 | With Today selected, edit due today → tomorrow | Edited task disappears | ☐ |
| T13 | With Today selected, edit due tomorrow → today | Edited task appears | ☐ |
| T14 | With Today selected, check and uncheck today's task | Matches completed-task decision | ☐ |
| T15 | Delete a visible task | Task removed; no error | ☐ |
| T16 | Reload, then select Today | Saved tasks display correctly | ☐ |
| T17 | Observe counters/progress under Today | Still represent all stored tasks | ☐ |
| T18 | Check priority/date order of visible tasks | Existing sort behavior preserved | ☐ |
| T19 | Narrow mobile viewport | Buttons usable, no overflow | ☐ |
| T20 | Open DevTools Console and review | No new errors or temporary debugging logs | ☐ |

**Pass rule:** Every acceptance criterion has at least one passing test; bugs are fixed and retested.

---

## 9. Review checklist (what a teammate / reviewer would ask)

- [ ] Do the changes match the ticket, including D1 and D2?
- [ ] Is Today handled in the existing `applyFilter()` rather than parallel logic?
- [ ] Are `.value`, `.textContent`, and `.dataset` used on the appropriate elements?
- [ ] Is no-date behavior deliberate?
- [ ] Is date comparison correct for local calendar days?
- [ ] Do saved task objects and localStorage remain unchanged?
- [ ] Does editing a due date update the active view?
- [ ] Do existing filters still work?
- [ ] Is there duplicated logic or an unnecessarily large function?
- [ ] Did we remove temporary logs and unrelated edits?
- [ ] Can the developer describe the data flow without reading the implementation line by line?

### Example pull request / change summary
**Title:** `feat: add Today task filter`

**Summary:** Added a Today view that displays tasks due on the user's local calendar day using the existing filter infrastructure.

**Files touched:** `index.html`, `app.js`, documentation; CSS only if layout testing reveals a need.

**Testing:** T01–T20 (record actual results before claiming pass).

**Known limitations:** No automatic refresh precisely at midnight; selected filter not persisted across reloads.

---

## 10. Development log — fill while working

### Session 1: Planning (simulation)
- **Goal:** Understand the request and design how the filter fits the existing app.
- **Discovery:** The app already has filter buttons, one filter function, and saved due dates on task `<li>` elements.
- **Design:** Reuse existing event listener and add a Today branch to the existing filter function.
- **Risk found:** Edit/save path does not reapply the current filter.
- **Decisions pending:** D1 and D2.
- **Next step:** Confirm product decisions, then start Step 1 of implementation.

### [YYYY-MM-DD] — Implementation session
- **Step worked on:**
- **My proposed solution / why:**
- **Code changed (file/function):**
- **Expected result:**
- **Observed result:**
- **Bug / fix / lesson:**
- **Next step:**

### [YYYY-MM-DD] — QA and review
- **Tests passed:**
- **Tests failed / fixes:**
- **Feedback received:**
- **Commit hash:**
- **Remaining follow-ups:**

---

## 11. Definition of Done (DoD) / handoff

- [ ] Product decisions confirmed.
- [ ] HTML and behavior implemented to the ticket.
- [ ] Every applicable acceptance criterion satisfied.
- [ ] Test results recorded, not assumed.
- [ ] Existing filters and task editing still work.
- [ ] No new console errors; UI acceptable on mobile.
- [ ] Source diff reviewed; only intended changes included.
- [ ] This FPT reflects actual final behavior and code locations.
- [ ] Git commit created (`feat: add today filter`).
- [ ] Ticket status changed to Done.

### Developer retrospective (after finishing)
1. Which part of the plan did I come up with independently?
2. Where did I need a hint or documentation?
3. Which codebase responsibilities can I now explain?
4. What would I do first if I built a similar filter again?

---

## 12. Reference: Three DOM rules

- **Text between tags?** `.textContent`
- **Input or dropdown?** `.value`
- **A `data-*` HTML attribute?** `.dataset`

### How to use this FPT in a real work session
1. Open this feature's FPT **before** opening `app.js`.
2. Check the **current step** in Section 6 and the **next action** in Section 10.
3. Explain the problem/approach in words; only then write the smallest change.
4. Run that step's verification and update the checkbox/log.
5. If you get stuck, ask for a hint about the **current step**, not a complete code solution.
