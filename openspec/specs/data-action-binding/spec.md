## ADDED Requirements

### Requirement: Bind actions via event delegation

`useDataAction({ root, actions })` SHALL bind an event listener on `root` that routes clicks on `[data-action]` elements to the corresponding callback in the `actions` map.

#### Scenario: Click triggers matching action callback

- **WHEN** the DOM contains `<button data-action="submit">` within `root`
- **AND** `useDataAction({ root, actions: { submit: mockFn } })` is called
- **AND** user clicks the button
- **THEN** `mockFn` SHALL be called exactly once

#### Scenario: Click on element without data-action is ignored

- **WHEN** user clicks an element within `root` that has no `data-action` attribute (and no ancestor with `data-action`)
- **THEN** no action callback SHALL be invoked

#### Scenario: Nested data-action element

- **WHEN** `<button data-action="save"><span>Save</span></button>` within `root`
- **AND** user clicks the inner `<span>`
- **THEN** the `save` callback SHALL be invoked (via `closest('[data-action]')` traversal)

### Requirement: Action receives event and element context

The action callback SHALL receive the original `Event` object and the `[data-action]` element as arguments.

#### Scenario: Callback receives event and element

- **WHEN** `<button data-action="delete" data-id="42">` is clicked
- **AND** action callback is `(event, el) => { ... }`
- **THEN** `event` SHALL be the `MouseEvent` (or equivalent pointer event)
- **AND** `el` SHALL be the button element
- **AND** `el.dataset.id` SHALL equal `"42"`

### Requirement: Action name not in map is no-op

When a `[data-action]` element is clicked but its action name is not present in `actions`, no error SHALL be thrown.

#### Scenario: Unregistered action

- **WHEN** `<button data-action="unknown">` is clicked
- **AND** `actions` does not contain `unknown`
- **THEN** no error SHALL be thrown and no callback SHALL be invoked

### Requirement: Query scope limited to root

`useDataAction({ root, actions })` SHALL only respond to clicks originating within the given `root` subtree.

#### Scenario: Click outside root is ignored

- **WHEN** `<button data-action="save">` exists outside the `root` element
- **AND** user clicks it
- **THEN** no action callback SHALL be invoked
