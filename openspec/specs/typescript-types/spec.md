## ADDED Requirements

### Requirement: Type-safe useDataRef

The type declaration SHALL allow users to specify ref names via a generic type parameter.

#### Scenario: Inferred ref names

- **WHEN** a user writes `useDataRef<'username' | 'item'>(root)`
- **THEN** the return value SHALL autocomplete `.username` and `.item`
- **AND** `.nonexistent` SHALL be a type error

#### Scenario: Multiple elements per ref

- **WHEN** `useDataRef<'item'>(root)` is used where `data-ref="item"` maps to multiple elements
- **THEN** `refs.item` SHALL be typed as `HTMLElement[]`

### Requirement: Type-safe useDataAction

The type declaration SHALL allow users to define action callback signatures.

#### Scenario: Action key constraints

- **WHEN** a user supplies `actions: { submit: (ev, el) => void, delete: (ev, el) => void }`
- **THEN** only `'submit'` and `'delete'` SHALL be valid `data-action` values
- **AND** callbacks SHALL receive `(MouseEvent, HTMLElement)` arguments

#### Scenario: Unregistered action is no-op (type level)

- **WHEN** HTML contains `data-action="unknown"` not in the actions type
- **THEN** the runtime behavior SHALL be no-op (this is guaranteed by implementation, not types)
