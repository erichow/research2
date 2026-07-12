## 1. Type Definitions

- [x] 1.1 Define `DataRefProxy<Refs>` type — maps ref names to return type (HTMLElement for single, HTMLElement[] for multi)
- [x] 1.2 Define `useDataRef<Refs extends string>(root: Element): DataRefProxy<Refs>` signature
- [x] 1.3 Define `DataActions` type constraint — `Record<string, (event: Event, element: HTMLElement) => void>`
- [x] 1.4 Define `useDataAction<Actions extends DataActions>(opts: { root: Element; actions: Actions }): void` signature
- [x] 1.5 Create `src/index.d.ts` with all type exports

## 2. Validation

- [x] 2.1 Create `test/types-test.ts` — a type-level test file that exercises the generics (compile-check only, not executed)
- [x] 2.2 Verify with `tsc --noEmit` (if TypeScript available) or manual review
