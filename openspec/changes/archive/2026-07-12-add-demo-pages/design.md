## Context

核心库 `useDataRef` / `useDataAction` 已实现。现在需要构建两个 Demo 页面来展示"同一份 JS 驱动不同 UI"的核心价值主张。Demo 题材是 AI 聊天助手——这是用户熟悉的交互模式（豆包、ChatGPT 等），复杂度适中，能覆盖大部分 `data-ref` / `data-action` 场景。

## Goals / Non-Goals

**Goals:**
- 两份风格显著不同的 HTML（豆包风 vs Material Design），共用 `demo/shared.js`
- 完整会话管理：新建、切换、删除、搜索
- 消息收发：输入发送、Enter 键、流式回复打字机效果
- 首次体验：欢迎页 + 快捷提问卡片
- 亮色/暗色模式切换（CSS 变量驱动）
- 选中文件后显示文件名（不上传真实文件）

**Non-Goals:**
- 不做真实 AI API 对接（模拟回复即可）
- 不做会话持久化（刷新后重置）
- 不做移动端适配
- 不做真实文件上传
- 不做无障碍（ARIA）

## Decisions

### 1. CSS 变量实现主题切换

**选择**：所有颜色定义为 CSS 自定义属性（`--bg`, `--text`, `--panel-bg`…），通过 `[data-theme="dark"]` 选择器切换。

**理由**：一份 JS 只需 toggle `document.documentElement.dataset.theme`，两份 HTML 各自定义自己的配色变量。零 JS 侵入样式。

### 2. 流式回复用 `setInterval` 模拟

**选择**：收到"发送消息"事件后，逐字追加 `textContent` 到消息气泡，每 30ms 一个字，完成前显示 typingIndicator。

**理由**：不用真实 SSE/WebSocket，纯前端模拟即可展示 data-ref 的响应式能力。

### 3. 会话数据结构

```js
sessions = [
  { id, title, messages: [{ role: 'user'|'assistant', text }] }
]
currentSessionId — 指向当前活跃会话
```

**理由**：最小够用。刷新丢失是 non-goal，所以纯内存数组。

### 4. HTML 各自内联样式

**选择**：每个 HTML 自带 `<style>` 块，不抽公共 CSS 文件。

**理由**：强调"设计稿各自独立"的理念。两个 HTML 之间零共享样式，只有 `data-ref` / `data-action` 属性名是契约。

### 5. 文件上传仅模拟

**选择**：`<input type="file" hidden>` 配合可见按钮，选中后显示文件名，不实际读取。

**理由**：展示 `data-action="uploadFile"` 的绑定模式，不引入 FileReader 复杂度。

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| 两份 HTML 样式代码较长 | 内联在各自文件中，不污染 shared.js |
| 模拟回复内容单调 | 预设一组随机回复语料，让体验不枯燥 |
| `closest('[data-action]')` 可能穿透到非预期祖先 | data-action 只在叶子交互元素上使用 |
