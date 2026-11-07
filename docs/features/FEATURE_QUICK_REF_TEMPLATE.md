# FPT-___ — [Feature Name] | Working Quick Reference

**Project / release:** __________ · **Branch:** __________ · **Status:** Planning / In progress / Review / Done  
**Full specification:** [Link to the feature's complete FPT](./FPT-___-name.md)  
**Purpose:** Keep this file short and practical. The full FPT holds the detailed requirements, reasoning, and test evidence.

## START HERE — Current state and next action

- **Already exists:** [...]
- **Already implemented:** [...]
- **Not yet implemented:** [...]
- **NEXT (one specific action):** [File → function/element → change or decision]
- **Done with this step when:** [Observable verification]
- **Current checklist item:** [e.g., C3]

## Product decisions — Agreed rules

| ID | Question / rule | Final decision |
|---|---|---|
| D1 | [...] | [...] |
| D2 | [...] | [...] |

**In scope:** [...]  
**Out of scope:** [...]

## Event and data flow (plain English first)

```text
User action / system trigger
         ↓
HTML element / event
         ↓
JavaScript event handler
         ↓
Read data from [DOM / storage / API]
         ↓
Choose behavior / compute result
         ↓
Update [DOM / state / storage]
         ↓
User sees [...]
```

## Find it fast — Feature-specific code map

| Need | File → exact selector/function | Existing or new? | Responsibility |
|---|---|---|---|
| HTML control | `index.html` → [...] | [...] | [...] |
| CSS rules | `style.css` → [...] | [...] | [...] |
| JS reference | `app.js` → [...] | [...] | [...] |
| Event handler | `app.js` → [...] | [...] | [...] |
| Core logic | `app.js` → [...] | [...] | [...] |
| Data source | `storage.js` / `data-*` → [...] | [...] | [...] |
| UI update | `app.js` → [...] | [...] | [...] |

**What NOT to change:** [...]  
**Key attributes/data shapes:** [...]

## Implementation sequence — Only check once verified

### A. Requirements and discovery
- [ ] A1. Confirm product decisions and observable acceptance criteria.
- [ ] A2. Locate existing code and map reusable functions.
- [ ] A3. Describe the data flow before coding.

### B. HTML and CSS
- [ ] B1. Add/update the required HTML control or element.
- [ ] B2. Verify the element appears and interactions are reachable.
- [ ] B3. Reuse existing styles; test mobile and desktop.

### C. JavaScript and data
- [ ] C1. Connect the event to the existing or new handler.
- [ ] C2. Locate/read the data the feature needs.
- [ ] C3. Write the decision/processing logic in small changes.
- [ ] C4. Update the UI and/or save data only as required.
- [ ] C5. Handle edge cases and relevant updates from other actions.

### D. Testing, review, and delivery
- [ ] D1. Test the happy path against acceptance criteria.
- [ ] D2. Test edge cases and existing-feature regressions.
- [ ] D3. Check browser console and responsive layout.
- [ ] D4. Review source changes (`git diff`); remove debug code.
- [ ] D5. Update the full FPT with actual test results and decisions.
- [ ] D6. Make a focused Git commit; record hash and push.
- [ ] D7. Mark the FPT Done only after verification.

## Test mini-matrix

| Scenario | Expected | Pass / Fail / Not run |
|---|---|---|
| Normal case | [...] | Not run |
| Edge case | [...] | Not run |
| Existing feature | [...] | Not run |

## Work log

**Date:** __________ · **Current item:** __________  
**Code changed:** __________ · **Reason:** __________  
**Expected:** __________ · **Observed:** __________  
**Blocked on / researched:** __________  
**Next action:** __________

## Git checkpoint

**Commit message:** `type: describe the change`  
**Commit hash:** __________ · **Push completed:** [ ]

> Keep the quick reference updated when the next step changes. It should help someone resume work within 30 seconds, not replace the complete FPT.
