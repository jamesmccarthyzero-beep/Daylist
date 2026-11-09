# FPT-[ID] — [Feature name]

**Project:** Daylist | **Milestone:** [V2 etc.] | **Branch:** [branch]  
**Status:** Planning / Approved / In progress / QA / Done  
**Owner:** [developer] | **Date:** [YYYY-MM-DD]

> Copy this file for each new feature. Define behavior first. Fill out the code map **from the actual project**. Keep implementation steps small and testable. Mark sections N/A if genuinely unnecessary.

## 1. The request (ticket)
**Problem:** [What problem exists?]  
**User story:** As a [user], I want [capability], so that [benefit].  
**Expected user experience:** [What the user sees and does.]  
**Success measure:** [What proves it works?]  
**Out of scope:** [What this ticket will not do.]

## 2. Clarify requirements BEFORE coding
| ID | Question / ambiguity | Proposed behavior | Decision / owner |
|---|---|---|---|
| D1 | [e.g. completed items included?] | | |
| D2 | [e.g. empty data?] | | |

**Acceptance criteria** (observable behavior, not code):
- [ ] AC1: Given [state], when [action], then [result].
- [ ] AC2:
- [ ] AC3:
- [ ] Existing feature still works:

## 3. Investigate the codebase
**Source files inspected:** [actual files]

| Area | Element / function / selector | What it currently does | Why relevant |
|---|---|---|---|
| HTML | | | |
| CSS | | | |
| JS — listener | | | |
| JS — function | | | |
| Data / storage | | | |

### Function contracts (one per important function involved)
**`functionName(input)`**  
- **Input:**  
- **Reads:**  
- **Changes/returns:**  
- **Must not do:**  

**Existing functionality to reuse:**  
**Potential integration gap spotted:**

## 4. Technical design — HTML / CSS / JS / data
**HTML:** [new element? attributes? existing selectors?]  
**CSS:** [reuse or new styles? responsive behavior?]  
**Data:** [source, data type, shape, persisted?]  
**JS:** [event, key decision/function, display update, storage effect?]  

**Event / data flow:**
```text
User action
  ↓
HTML element / event
  ↓
Existing listener (or proposed listener)
  ↓
Input data and source
  ↓
Decision / validation
  ↓
DOM/UI changes
  ↓
Save? Other UI updates?
```

**Other entry points to review:** Add / edit / delete / change / reload / sort.

## 5. Decision table (examples before code)
| Input / state | Expected behavior | Reason |
|---|---|---|
| Normal | | |
| Empty | | |
| Edge case | | |

## 6. Work breakdown — one verified slice at a time
| Step | Work | Why / dependency | How to verify |
|---|---|---|---|
| 0 | Resolve open decisions | | |
| 1 | Explore code and write scenarios | | |
| 2 | Small UI/data change | | |
| 3 | Small behavior change | | |
| 4 | Integration update | | |
| 5 | Regression tests and review | | |
| 6 | Documentation and commit | | |

**Next smallest action:**

## 7. Risks / edge cases
| Risk | Impact | Mitigation / test |
|---|---|---|
| Empty/missing value | | |
| Invalid value | | |
| Editing existing data | | |
| Interaction with other features | | |
| After reload | | |

## 8. QA test plan
| Test ID | Setup / action | Expected | Pass / notes |
|---|---|---|---|
| T01 | Typical action | | ☐ |
| T02 | Edge case | | ☐ |
| T03 | Regression | | ☐ |
| T04 | Reload / persistence | | ☐ |
| T05 | Mobile visual test | | ☐ |

## 9. Code review checklist
- [ ] Meets acceptance criteria and chosen product rules
- [ ] Uses existing functions; avoids unnecessary duplicates
- [ ] Handles empty and unexpected data deliberately
- [ ] Doesn't accidentally alter saved data
- [ ] Existing features still behave correctly
- [ ] No temporary logs or unrelated edits
- [ ] Developer can explain the click → data → decision → UI flow

**Change summary / PR draft:**  
**Files touched:**  
**Testing evidence:**

## 10. Development log
### [YYYY-MM-DD] — [session]
- **Goal:**
- **My proposed approach and why:**
- **Files/functions changed:**
- **Expected:**
- **Observed:**
- **Blocker / bug / lesson:**
- **Next action:**

## 11. Definition of Done / handoff
- [ ] Decisions recorded
- [ ] All acceptance criteria met
- [ ] QA table filled with actual results
- [ ] Diff reviewed; no unrelated changes
- [ ] Documentation and function map updated
- [ ] Committed with descriptive message
- [ ] Status changed to Done

**Git commit:**  
**Known limitations / follow-up tickets:**

## 12. Retrospective (learn the engineering process)
- What did I decide on my own?
- Where did I need help or documentation?
- What code do I understand better now?
- What would I do differently next time?

---
**DOM reminder:** Between tags → `.textContent`; form control → `.value`; `data-*` attribute → `.dataset`.
