## 1. Project Scaffold

- [x] 1.1 Create `src/` directory with `index.js` entry point that re-exports both modules

## 2. useDataRef Implementation

- [x] 2.1 Implement `useDataRef(root)` — `querySelectorAll('[data-ref]')` and group elements by `data-ref` value into a `{ name: HTMLElement | HTMLElement[] }` map
- [x] 2.2 Implement Proxy wrapper: array properties (`length`, `forEach`, `[n]`, `map`, `filter`, `find`) delegate to array; all others forward to `array[0]`; single-element values pass through directly
- [x] 2.3 Handle edge cases: missing ref → `undefined`; empty root → empty Proxy

## 3. useDataAction Implementation

- [x] 3.1 Implement `useDataAction({ root, actions })` — attach `click` event listener on `root`, use `event.target.closest('[data-action]')` to find the action trigger
- [x] 3.2 Route to action callback with `(event, element)` signature; skip silently if action name not in `actions` map
- [x] 3.3 Handle nested clicks: click on child of `[data-action]` element still triggers the action

## 4. Validation

- [x] 4.1 Create `test/basic.html` — a manual test page that exercises all spec scenarios for both `useDataRef` and `useDataAction`
- [x] 4.2 Verify in at least two browsers (Chrome, Firefox) that all scenarios pass
