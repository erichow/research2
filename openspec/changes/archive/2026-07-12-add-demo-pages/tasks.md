## 1. Project Structure

- [x] 1.1 Create `demo/` directory

## 2. Shared Logic (shared.js)

- [x] 2.1 Implement session data model: `sessions` array + `currentSessionId`, helper to add/switch/delete sessions
- [x] 2.2 Implement `sendMessage` — append user message, clear input, hide welcome, trigger simulated AI reply
- [x] 2.3 Implement simulated streaming reply — typing indicator → character-by-character text in assistant bubble
- [x] 2.4 Implement session CRUD: `newSession`, `selectSession`, `deleteSession` actions
- [x] 2.5 Implement `searchSession` — filter session list by search input text
- [x] 2.6 Implement `quickQuestion` — send card text as user message + trigger AI reply
- [x] 2.7 Implement `switchModel` — update selected model name in UI
- [x] 2.8 Implement `uploadFile` — trigger hidden file input, show selected filename
- [x] 2.9 Implement `clearMessages` — clear current session messages, show welcome screen
- [x] 2.10 Implement theme toggle — toggle `data-theme` attribute on `<html>`
- [x] 2.11 Wire all `useDataRef` + `useDataAction` calls, handle Enter key for send

## 3. Design Variant: v1 (豆包风格)

- [x] 3.1 Create `demo/v1.html` with full layout (dual-panel: session panel + chat panel)
- [x] 3.2 Style in 豆包-inspired design language (rounded bubbles, gradient accents, specific color palette)
- [x] 3.3 Include all required data-ref elements (sessionList, chatMessages, chatInput, searchInput, typingIndicator, welcomeScreen, modelSelector)
- [x] 3.4 Include all required data-action elements (sendMessage, selectSession, newSession, deleteSession, searchSession, clearMessages, quickQuestion, switchModel, uploadFile)
- [x] 3.5 Add CSS variables for light/dark theme support

## 4. Design Variant: v2 (Material Design 风格)

- [x] 4.1 Create `demo/v2.html` with full layout
- [x] 4.2 Style in Material Design language (cards, elevation shadows, Roboto-like, FAB, distinct color palette)
- [x] 4.3 Same data-ref/data-action contract as v1 (identical attribute names, potentially different structure)
- [x] 4.4 Add CSS variables for light/dark theme support

## 5. Verification

- [x] 5.1 Open both v1.html and v2.html in browser, verify all interactions work identically
- [x] 5.2 Verify dark/light toggle works in both variants
- [x] 5.3 Verify shared.js has zero CSS class or DOM structure dependencies
