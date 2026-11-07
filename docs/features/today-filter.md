# Feature Plan — Today Filter (Daylist V2)

> **Example based on your actual Daylist code.** This plan is intentionally not a full code solution. Its purpose is to show how to think through and track a feature while you write it.

## 0. Ticket and status

- **Feature:** Today task filter
- **Branch:** `v2-development`
- **Status:** **In progress**
- **Next feature:** Upcoming filter (later)
- **Current implementation:** Today button added; `applyFilter()` identified; due date and current date prepared.

## 1. Goal — what and why?

**User story:** As a Daylist user, I want to click **Today** to see tasks due on today's date, so I can focus on what needs attention.

**Success:** Clicking Today hides tasks that don't match the Today rule while leaving saved data and other filters intact.

**Out of scope:** Notifications, calendar sync, recurring tasks, new storage fields.

## 2. Acceptance criteria

- [ ] Today button becomes visually active when clicked.
- [ ] Task due today appears.
- [ ] Task due tomorrow does not appear.
- [ ] Overdue task does not appear **if** Today means exactly today's date.
- [ ] Task without a date does not appear.
- [ ] Completed tasks obey the completion rule you choose below.
- [ ] All, Active, Completed still work.
- [ ] Adding a task while Today is selected respects the current view.
- [ ] Editing a task's date while Today is selected immediately updates visibility.
- [ ] Checking/unchecking tasks doesn't create incorrect visibility.
- [ ] Reloaded saved tasks still filter correctly.
- [ ] No new console errors.

### Product decisions — YOU decide before writing the rule

**Should a completed task due today appear under Today?**
- **A.** Yes; Today includes *all* tasks due today.
- **B.** No; Today shows only *incomplete* tasks due today.

**Your decision and why:** `[write here]`

**Should Today mean exactly today or today plus overdue tasks?**
- **Proposed:** Exactly today (overdue could become a separate view).
- **Your decision:** `[confirm/change]`

It's normal for developers to clarify ambiguous requirements before coding them.

## 3. Existing app: what to reuse

**HTML:** The `.filters` container already contains buttons like:

```html
<button type="button" class="filter-btn" data-filter="today">Today</button>
```

**CSS:** The current `.filter-btn` / `.active` rules should handle selected styling. Verify visually before adding CSS.

**JavaScript:**
- Filter button listener already reads `button.dataset.filter` and calls `applyFilter(selectedFilter)`.
- `applyFilter()` currently loops through `.task-item` elements and handles `"active"` and `"completed"`.
- The current task's due date is `item.dataset.dueDate` (a string, possibly empty).
- The current task's checkbox is found by `item.querySelector(".task-checkbox")`; its checked state is a boolean.
- `updateDueDateLabel()` already uses Date objects and local midnight.
- The checkbox change listener and add-task path reapply the selected filter.
- **Important gap:** Saving an *edited* task currently updates data, sorts, and saves, but does **not** reapply the selected filter. Today will expose that bug if the date changes.

**Storage:** No changes expected. Filtering changes what's displayed, not what is saved.

## 4. The behavior flow (before any new code)

```text
Click Today button
  ↓
Existing listener removes/adds .active to the filter buttons
  ↓
Read clicked button's data-filter  →  "today"
  ↓
Call applyFilter("today")
  ↓
For EACH .task-item <li>:
    read this item's due date
    read completion state if the chosen rule uses it
    check whether due date matches the current local day
    show matching item, hide nonmatching item
  ↓
The list displays only the selected view
```

**Why `forEach(item)` matters:** `item` refers to **one whole `<li>` task** in that iteration. `checkbox` is a separate element found *inside* that item. `item.dataset.dueDate` reads information stored *on* the item.

### Algorithm in ordinary English

1. Find every task.
2. Get today's local date *once*, with the time set to midnight.
3. For each task, read its saved due-date string.
4. If there's no due date, it cannot match Today.
5. If there is a due date, compare it to today using equivalent date representations.
6. If Today is selected, apply the match rule you chose above.
7. Otherwise preserve the existing Active, Completed, and All behavior.
8. After relevant task changes, reapply the current selected filter.

### Date details (technical design note)

Your already-added code is using:
- `today = new Date()` and `today.setHours(0, 0, 0, 0)`
- `dueDate = item.dataset.dueDate` (e.g. `"2026-11-10"`)
- `taskDate = new Date(dueDate + "T00:00:00")`

That converts the task's date string into a Date object at **local midnight**, making it comparable to `today`.

**Two traps:**
- Date objects compared directly with `===` are different references. Compare their numeric times via `.getTime()` or another deliberate day comparison.
- If `dueDate === ""`, constructing `new Date("T00:00:00")` produces an invalid date. Account for no-date tasks in the logic; don't quietly treat the result as a real date.

## 5. Responsibilities by file

| Area | Planned change | Status |
|---|---|---|
| `index.html` | Today button with lowercase `data-filter="today"` | Done |
| CSS | Likely no change; reuse active button styling | Verify |
| `app.js` — `applyFilter()` | Add Today show/hide decision while preserving other filters | In progress |
| `app.js` — edit/save path | Reapply selected filter after changing a due date | To do |
| `storage.js` | No schema or saving change | Not needed |

## 6. Work breakdown — small, verifiable slices

- [x] **Slice 1:** Add Today filter button. **Verify:** It can receive `.active` when clicked.
- [x] **Slice 2:** Identify `applyFilter()` and read `item.dataset.dueDate` in its loop.
- [x] **Slice 3:** Prepare `today` and `taskDate`. **Note:** Guard/check blank due dates before relying on the comparison.
- [ ] **Slice 4:** Write the Today visibility rule in one English sentence, including completed/no-date behavior. **Verify:** Test against example tasks *on paper*.
- [ ] **Slice 5:** Implement that rule inside `applyFilter()` alongside the existing branches. **Verify:** Today vs tomorrow/no date.
- [ ] **Slice 6:** Ensure edited dates reapply the active filter. **Verify:** Change today → tomorrow and tomorrow → today while Today stays selected.
- [ ] **Slice 7:** Run regression tests below; review diff; commit.

**NEXT smallest action:** Fill in the two product decisions in section 2. Then describe your proposed Today match rule in words, *before* more JavaScript.

## 7. Manual test matrix

| Task / action | View selected | Expected | Test result |
|---|---|---|---|
| Task dated today, unchecked | Today | Visible | ☐ |
| Task dated tomorrow | Today | Hidden | ☐ |
| Task dated yesterday | Today | Hidden if exactly today | ☐ |
| Task with no date | Today | Hidden | ☐ |
| Completed task dated today | Today | Depends on chosen product rule | ☐ |
| Mixed completed / incomplete | Active | Only incomplete | ☐ |
| Mixed completed / incomplete | Completed | Only completed | ☐ |
| All tasks | All | All visible | ☐ |
| Add tomorrow task while Today active | Today | Hidden | ☐ |
| Edit today task to tomorrow while Today active | Today | Becomes hidden | ☐ |
| Edit tomorrow task to today while Today active | Today | Becomes visible | ☐ |
| Toggle checkbox while Today active | Today | Matches product rule | ☐ |
| Reload page and select Today | Today | Saved tasks filter consistently | ☐ |

## 8. Development log

### Initial sessions — Starting Today
- **Completed:** Today button added, selected filter structure found, due-date lookup placed inside the task loop, date normalization prepared.
- **Learning:** `forEach(function(item) {...})` visits one complete task `<li>` at a time; `item.querySelector(...)` retrieves a child without changing `item`.
- **Still needed:** Choose Today rules, handle missing date, integrate if/else behavior, re-filter after edits, test.
- **Next action:** Resolve the two product decisions in section 2.

### [DATE] — [NEXT SESSION]
- **Goal:**
- **What I changed:**
- **Expected:**
- **Actual result:**
- **Bug / decision / lesson:**
- **Next:**

## 9. Definition of Done

- [ ] Product rule is clear.
- [ ] Acceptance criteria and test matrix pass.
- [ ] Existing filters still work.
- [ ] No unexpected console errors.
- [ ] I can describe the click → data → decision → display flow.
- [ ] Git diff reviewed, changes committed.
- [ ] This plan updated to `Done`.

**Suggested commit:** `feat: add Today task filter`

---

**Later:** Make `upcoming-filter.md` by copying `FEATURE_TEMPLATE.md`. Decide whether Upcoming includes today and how far ahead it reaches before touching JavaScript.
