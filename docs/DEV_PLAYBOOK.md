# Daylist — Developer Playbook
*A real-world, lightweight process for planning, building, testing, and recording features.*

**Current project:** Daylist V2  
**Development branch:** `v2-development`  
**Stable release:** V1 is on `main` and tagged `v1.0.0`  
**Active feature:** Today filter

## Why this exists

The goal is to move from **“AI tells me which line to add”** to **“I can plan an implementation, make a small change, test it, and ask AI targeted questions when I need help.”**

This is a simplified version of what developers do around a work ticket. Team processes differ, but planning behavior, understanding existing code, implementing in slices, testing, and reviewing changes are broadly useful habits.

## The eight-step feature workflow

| Stage | Question | Artifact |
|---|---|---|
| **1. Define** | What does the user want and why? | One-sentence goal |
| **2. Specify** | How can we tell it works? | Acceptance criteria |
| **3. Investigate** | What already exists in our app? | Code map |
| **4. Design** | What happens from click to result? | HTML/CSS/JS/data flow |
| **5. Break down** | What's the smallest sensible sequence? | Implementation checklist |
| **6. Implement** | What's the next small code change? | Small change, not giant rewrite |
| **7. Verify** | Did it work and did we break anything? | Test results |
| **8. Record** | What changed, and what's next? | Dev log + Git commit |

**Before writing code, be able to describe the feature in everyday language.** A plan can be incomplete; identifying unknowns is itself valuable.

### The standard interactive-feature flow

```text
User action (click, submit, change)
    ↓
HTML element triggers browser event
    ↓
JavaScript event listener
    ↓
Read information (input, dataset, checkbox, existing state)
    ↓
Apply business rule (if / else / comparisons)
    ↓
Update DOM (text, style, classes, task elements)
    ↓
Persist data when it changed (localStorage)
    ↓
Refresh related display (sorting / counts / progress / filters / labels)
    ↓
Test
```

Some features only change what is **visible** and do not need a storage change.

## Daylist project anatomy

```text
Daylist/
├── index.html               HTML structure, form, filter buttons, task list
├── [existing stylesheet]    Layout, colors, filter/button styling
├── app.js                   Events, tasks, filtering, sorting, editing, DOM updates
├── storage.js               Loading/saving tasks in localStorage
└── docs/
    ├── DEV_PLAYBOOK.md      This guide
    ├── FEATURE_TEMPLATE.md  Copy for every new feature
    └── features/
        ├── today-filter.md  Example: current feature
        └── ...              One plan per feature
```

The exact CSS filename is not known from the shared JavaScript; check its `<link>` in `index.html`.

### The task data

Your app stores tasks with these fields:

```js
{
  text: "Pay Electric Bill",
  completed: false,
  dueDate: "2026-11-10", // or "" for no date
  priority: "high"       // or "normal"
}
```

`createTaskElement()` creates an `<li class="task-item">` for each task. It uses `data-due-date` and `data-priority` attributes to keep important task data on the DOM element.

**Three different layers:**
- **Saved task object:** Data that can survive reload through `storage.js`.
- **DOM task element:** The current `<li>` and its checkbox, text, badge, dates, buttons.
- **Filter selection:** Which existing elements are shown. Hiding a task is *not* deleting it.

### Which Daylist code is responsible for what?

| Responsibility | Existing code |
|---|---|
| Handle filter button click | `filterButtons.forEach(...)` and its listener |
| Read selected filter value | `button.dataset.filter` |
| Choose visible tasks | `applyFilter(selectedFilter)` |
| Get current task element | `taskList.querySelectorAll(".task-item")` and `forEach(item => ...)` |
| Read task due date | `item.dataset.dueDate` |
| Read completion | `item.querySelector(".task-checkbox").checked` |
| Change date label & overdue state | `updateDueDateLabel(taskItem)` |
| Create HTML for a task | `createTaskElement(task)` |
| Save/load task data | `getTasks()`, `saveTasks()`, `restoreTasks()`, `storage.js` |
| Sort tasks | `sortTasksByPriority()` |
| Update progress/counters | `updateProgress()`, `updateTaskCount()` |
| Add/edit task data | `taskForm` submit listener |
| Delete/edit buttons | `taskList` click listener |

This map helps you **look for existing behavior before creating new functions**.

## V2 feature board (living roadmap)

Already implemented on your V2 branch: add/delete/edit; duplicate prevention; title formatting; dates and overdue/today labels; high/normal priority; sorting; clear due date; checkbox completion; All/Active/Completed filters; progress/counters; localStorage.

| Feature | Status | Things to decide or check |
|---|---|---|
| **Today filter** | **In progress** | Exact-today meaning, completed tasks, date-less tasks, edited tasks |
| **Upcoming filter** | Not started | Tomorrow onward or today included? Next 7 days or all future? |
| **V2 polish** | Not started | State consistency, empty states, date logic, accessibility, layout |
| **V2 release** | Later | Full tests, merge to `main`, tag/release |

Keep this updated. New ideas go onto the board, **not straight into the code**.

## Using the two planning files

1. For a new feature, copy **`FEATURE_TEMPLATE.md`** to **`features/<feature-name>.md`**.
2. Complete at least **Goal**, **Acceptance Criteria**, **Existing Code**, **HTML/CSS/JS Flow**, **Implementation Slices**, and **Tests**.
3. Mark unknowns as questions; resolve ones that change the feature's behavior.
4. Work through one small checklist item; test it before moving on.
5. Fill a short **Dev Log** after the session. Save notable decisions and bugs.
6. Review your changes with `git diff` / `git status`, then commit a coherent, working change.

**Start with** `features/today-filter.md`, which is based on your real code and partially completed work.

### What planning looks like at a company

A request like “Add Today filter” might arrive as a ticket rather than instructions. A developer clarifies the expected behavior, studies the existing system, chooses where to modify it, adds tests, makes a change, and submits it for review. The company might use Jira, Linear, GitHub Issues, pull requests, design docs, etc. You can build the same *thinking habits* with Markdown and Git before you need those tools.

## Using AI without becoming dependent on it

Ask for the *smallest useful help*:

1. **Plan review:** “Is my approach sound? What case am I overlooking?”
2. **Concept hint:** “I know the goal; which browser/JS concept is relevant?”
3. **Syntax hint:** “Give a tiny generic example, not Daylist's solution.”
4. **Debugging:** “Here is my code, error message, expected and actual result.”
5. **Full example:** Only when requested or necessary to unblock you.

**Suggested working agreement:** You propose the next step. I ask questions, review reasoning, and give hints first. I shouldn't prescribe the next exact line by default.

### Useful quick reminder

- **Between HTML tags?** `.textContent`
- **Input or dropdown?** `.value`
- **Starts with `data-`?** `.dataset`

## Git checkpoints

Before code, confirm branch (`git branch --show-current`) and read the plan. After a working slice, inspect `git diff`. Commit when the behavior is coherent and tested (e.g., `feat: add Today task filter`). Push `v2-development` as needed. Once V2 is tested, merge to `main` and create a release tag.

**Bottom line: A feature isn't just the code. It's the goal, the design, the small steps, the tests, and the record of why you made those decisions.**
