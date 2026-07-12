## ADDED Requirements

### Requirement: Collect elements by data-ref attribute

`useDataRef(root)` SHALL scan the `root` element's subtree for all elements with a `data-ref` attribute and return a Proxy object keyed by the attribute value.

#### Scenario: Single element per ref name

- **WHEN** the DOM contains exactly one `<input data-ref="email">` within `root`
- **THEN** `useDataRef(root).email` SHALL return that single `HTMLInputElement`

#### Scenario: Multiple elements with same ref name

- **WHEN** the DOM contains multiple `<li data-ref="item">` within `root`
- **THEN** `useDataRef(root).item` SHALL return an `Array` of those elements (a live `NodeList` converted to `HTMLElement[]`)

#### Scenario: Missing ref name

- **WHEN** no element has `data-ref="nonexistent"` within `root`
- **THEN** `useDataRef(root).nonexistent` SHALL return `undefined`

### Requirement: Proxy auto-dispatch for multi-element refs

When a `data-ref` name maps to multiple elements, the Proxy SHALL intelligently dispatch property access:

- Array prototype properties (`length`, `forEach`, `map`, `filter`, `find`, `[index]`, etc.) SHALL be delegated to the underlying array.
- All other properties SHALL be forwarded to the **first** element in the array (`array[0]`).

#### Scenario: Array property access on multi-element ref

- **WHEN** the DOM contains 3 `<li data-ref="item">` elements
- **THEN** `useDataRef(root).item.length` SHALL return `3`
- **AND** `useDataRef(root).item.forEach` SHALL be callable and iterate all 3 elements
- **AND** `useDataRef(root).item[1]` SHALL return the second element

#### Scenario: DOM property access on multi-element ref

- **WHEN** the DOM contains 2 `<input data-ref="username">` elements and the first has `value="alice"`
- **THEN** `useDataRef(root).username.value` SHALL return `"alice"` (forwarded to first element)

#### Scenario: Single-element ref behaves normally

- **WHEN** the DOM contains exactly one `<input data-ref="password">`
- **THEN** `useDataRef(root).password.value` SHALL return the element's `value` property directly

### Requirement: Query scope limited to root

`useDataRef(root)` SHALL only query elements within the given `root` subtree.

#### Scenario: Elements outside root are ignored

- **WHEN** the page has `<input data-ref="outside">` located outside of the `root` element passed to `useDataRef`
- **THEN** `useDataRef(root).outside` SHALL be `undefined`
