## Why

上一版 demo 的两个页面 DOM 结构几乎相同（两块面板并排），只是换了 CSS 变量，本质上像换肤。需要重做两个**DOM 结构、交互隐喻、视觉语言都截然不同**的 UI，来真正证明"同一份 JS 驱动迥异 UI"这一抽象层的价值。

另一个问题是上一版的 proposal 已经预设了"全屏布局、面板分左右"这些 UI 细节——产品经理不应该越界去限定布局形式，只需要描述要实现的**功能**。

## What Changes

- 删除 `demo/v1.html`、`demo/v2.html`
- 新增 `demo/terminal.html`：终端模拟器风格，线性单列 DOM，命令行式输入，tab 切换会话
- 新增 `demo/mobile.html`：移动端即时通讯风格，双视图 push/pop，聊天气泡，手机框居中
- `demo/shared.js` 保持不变，所有 class（`.session-item`、`.msg`、`.bubble`、`.time`）由 CSS 各自诠释
- 更新功能 spec：移除所有布局预设，仅描述用户能完成什么交互

## Capabilities

### Modified Capabilities

- `chat-demo`：重写 spec，移除布局词汇，纯功能描述

## Impact

| 维度 | 说明 |
|------|------|
| 代码 | 替换 `demo/v1.html` `demo/v2.html` → `demo/terminal.html` `demo/mobile.html`，`shared.js` 不改 |
| 依赖 | 不变，仅依赖 `../src/index.js` |
| 平台 | 现代浏览器 |
| 验证 | 两份 HTML 各自在浏览器中打开，所有交互共用 `shared.js` |
