## ADDED Requirements

### Requirement: Session management

The demo SHALL support creating, switching, deleting, and searching sessions via `data-action` bindings.

#### Scenario: Create new session

- **WHEN** user clicks an element with `data-action="newSession"`
- **THEN** a new session with a default title SHALL appear in the session list
- **AND** the new session SHALL become the active session
- **AND** the chat area SHALL show the welcome screen

#### Scenario: Switch session

- **WHEN** user clicks a session item with `data-action="selectSession"`
- **THEN** that session SHALL become active
- **AND** its message history SHALL be displayed in the chat area

#### Scenario: Delete session

- **WHEN** user clicks delete on a session (`data-action="deleteSession"`)
- **THEN** that session SHALL be removed from the list
- **AND** if it was the active session, a different session SHALL become active

#### Scenario: Search sessions

- **WHEN** user types in the search input (`data-ref="searchInput"`)
- **THEN** only sessions whose titles contain the search text SHALL be visible

### Requirement: Message sending and display

The demo SHALL allow users to send messages and display them in the chat area.

#### Scenario: Send message via button click

- **WHEN** user types text in `data-ref="chatInput"` and clicks an element with `data-action="sendMessage"`
- **THEN** the user's message SHALL appear in `data-ref="chatMessages"`
- **AND** the input SHALL be cleared

#### Scenario: Send message via Enter key

- **WHEN** user presses Enter while focused on `data-ref="chatInput"`
- **THEN** the message SHALL be sent (same behavior as button click)
- **AND** Shift+Enter SHALL NOT send (allow newline)

#### Scenario: Welcome screen visibility

- **WHEN** the active session has no messages
- **THEN** `data-ref="welcomeScreen"` SHALL be visible
- **AND** `data-ref="chatMessages"` SHALL be hidden or empty

#### Scenario: Welcome screen hidden after first message

- **WHEN** user sends the first message in a session
- **THEN** `data-ref="welcomeScreen"` SHALL be hidden
- **AND** `data-ref="chatMessages"` SHALL be visible

### Requirement: Simulated streaming reply

After a user sends a message, the demo SHALL simulate an AI reply with a character-by-character typing effect.

#### Scenario: Streaming reply

- **WHEN** user sends a message
- **THEN** `data-ref="typingIndicator"` SHALL briefly appear
- **AND** an assistant message bubble SHALL appear
- **AND** the reply text SHALL appear character by character
- **AND** `data-ref="typingIndicator"` SHALL disappear when streaming completes

### Requirement: Quick questions

The welcome screen SHALL display quick question cards that automatically send a message when clicked.

#### Scenario: Quick question click

- **WHEN** user clicks a card with `data-action="quickQuestion"`
- **THEN** the card's question text SHALL be sent as a user message
- **AND** a simulated AI reply SHALL follow

### Requirement: Theme toggle

The demo SHALL support light/dark mode switching via a toggle element.

#### Scenario: Toggle dark mode

- **WHEN** user clicks the theme toggle with `data-action="switchModel"` (or dedicated theme action)
- **THEN** the `data-theme` attribute on `<html>` SHALL toggle between `"light"` and `"dark"`
- **AND** all colors SHALL update via CSS variables

### Requirement: Model selector

The demo SHALL provide a model selector dropdown.

#### Scenario: Switch model

- **WHEN** user selects a different option from `data-ref="modelSelector"`
- **THEN** the selected model name SHALL be displayed in the UI
- **AND** subsequent AI replies SHALL use the selected model's persona (simulated)

### Requirement: File upload simulation

The demo SHALL allow simulating file uploads.

#### Scenario: File selected

- **WHEN** user triggers `data-action="uploadFile"` and selects a file
- **THEN** the file name SHALL be displayed near the input area
- **AND** the file SHALL be referenced in the next sent message

### Requirement: Two design variants sharing one JS

Both `demo/v1.html` and `demo/v2.html` SHALL use the same `demo/shared.js` without modification, and all data-ref/data-action bindings SHALL work identically in both.

#### Scenario: Same JS drives both variants

- **WHEN** `shared.js` is loaded via `<script type="module">` in either HTML
- **THEN** all interactions (send, switch session, search, theme toggle, etc.) SHALL function
- **AND** no CSS selectors or DOM structure assumptions SHALL be present in `shared.js`
