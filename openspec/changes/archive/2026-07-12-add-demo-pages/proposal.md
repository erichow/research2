## Why

核心库已就绪，现在需要一个实际可跑的 Demo 来验证 "语义层 + 设计稿 + Agent = 前端代码" 的完整闭环——证明同一份 JS 确实可以驱动风格迥异的 UI，且设计稿变更不需要改业务逻辑。

## What Changes

- 新增 `demo/v1.html`：豆包风格 AI 聊天助手界面
- 新增 `demo/v2.html`：Material Design 风格 AI 聊天助手界面
- 新增 `demo/shared.js`：两份 HTML 共用的交互逻辑，基于 `useDataRef` / `useDataAction`
- 实现 8 个 `data-ref`（sessionList, chatMessages, chatInput, searchInput, typingIndicator, welcomeScreen, modelSelector）+ 1 个隐式 ref
- 实现 9 个 `data-action`（sendMessage, selectSession, newSession, deleteSession, searchSession, clearMessages, quickQuestion, switchModel, uploadFile）
- 亮色/暗色模式切换（CSS 变量 + JS toggle）
- 模拟 AI 流式回复（打字机效果）

## Capabilities

### New Capabilities

- `chat-demo`: AI 聊天助手 Demo，包含全屏布局、会话管理、消息收发、流式回复、亮暗主题切换的全部交互

### Modified Capabilities

<!-- 不修改已有 capability -->

## Impact

| 维度 | 说明 |
|------|------|
| 代码 | 新增 `demo/` 目录：`v1.html`、`v2.html`、`shared.js`，不修改 `src/` 核心库 |
| 依赖 | 仅依赖 `../src/index.js`（浏览器 ESM import），零外部依赖 |
| 平台 | 现代浏览器（支持 ESM + CSS 变量） |
| 验证 | 两份 HTML 在浏览器中直接打开即可体验，所有交互共用 `shared.js` |
