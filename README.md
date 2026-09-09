# First Things First

A mobile-friendly app to identify which business routines to automate first.

## Run

Open `index.html` in a browser. No dependencies or build step required.

## Files

- `index.html`: app layout
- `style.css`: responsive styling
- `app.js`: configuration, five-question audit, scoring, annual time estimates, result copying, and priority history

The clearly labelled config block at the top of `app.js` contains all questions, options, points, verdict bands, fixed explanations, and estimate constants.

History is saved in localStorage in the current browser. Clear list removes saved routines. No accounts or AI services are used.

## Verified example

Routine: Copying leads from forms into the CRM

Answers: Daily · 15–60 min · Mostly the same · Sometimes · A real problem

Result: **72/100**, **Automate parts of it**, **250 runs/year × 37.5 minutes ÷ 60 = 156 hours/year**, rounded.

All 432 answer combinations and repeated calculations were checked during implementation. Hours estimate time spent, not guaranteed savings.
