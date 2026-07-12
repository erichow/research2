## MODIFIED Requirements

### Requirement: Session management

用户 SHALL 能创建、切换、删除和搜索会话。

#### Scenario: Create new session

- **WHEN** 用户触发新建会话操作
- **THEN** 一个具有默认标题的新会话 SHALL 出现在会话列表中
- **AND** 该会话 SHALL 成为当前活跃会话
- **AND** 欢迎界面 SHALL 重新显示

#### Scenario: Switch session

- **WHEN** 用户选择某个会话
- **THEN** 该会话 SHALL 成为活跃会话
- **AND** 该会话的历史消息 SHALL 被展示

#### Scenario: Delete session

- **WHEN** 用户删除某个会话
- **THEN** 该会话 SHALL 从会话列表中移除
- **AND** 如果删除的是当前活跃会话，其他会话 SHALL 自动成为活跃会话

#### Scenario: Search sessions

- **WHEN** 用户在搜索框中输入文字
- **THEN** 仅标题包含搜索文字的会话 SHALL 可见

### Requirement: Message sending and display

用户 SHALL 能发送消息并查看对话历史。

#### Scenario: Send message

- **WHEN** 用户输入文本并触发发送操作
- **THEN** 用户消息 SHALL 出现在对话区域
- **AND** 输入框 SHALL 被清空

#### Scenario: Send via keyboard

- **WHEN** 用户在输入框中按下 Enter（非 Shift+Enter）
- **THEN** 消息 SHALL 被发送（等价于触发发送操作）

#### Scenario: Welcome screen visibility

- **WHEN** 活跃会话没有消息
- **THEN** 欢迎界面 SHALL 可见
- **AND** 对话区域 SHALL 不可见或为空

#### Scenario: Welcome screen hidden after first message

- **WHEN** 用户在空会话中发送第一条消息
- **THEN** 欢迎界面 SHALL 隐藏
- **AND** 对话区域 SHALL 显示消息

### Requirement: Simulated streaming reply

用户发送消息后，系统 SHALL 模拟 AI 回复并以逐字打字效果呈现。

#### Scenario: Streaming reply

- **WHEN** 用户发送一条消息
- **THEN** 输入中提示 SHALL 短暂出现
- **AND** 一条 AI 回复 SHALL 出现
- **AND** 回复文本 SHALL 逐字显示（打字机效果）
- **AND** 输入中提示 SHALL 在流式输出完成后消失

### Requirement: Quick questions

空会话的欢迎界面 SHALL 提供快捷问题入口。

#### Scenario: Quick question click

- **WHEN** 用户点击快捷问题
- **THEN** 问题文本 SHALL 作为用户消息发出
- **AND** AI 模拟回复 SHALL 随后出现

### Requirement: Theme toggle

用户 SHALL 能在亮色和暗色模式之间切换。

#### Scenario: Toggle theme

- **WHEN** 用户触发主题切换操作
- **THEN** 页面配色 SHALL 在亮色和暗色之间切换

### Requirement: Model selector

用户 SHALL 能从多个 AI 模型中选择。

#### Scenario: Switch model

- **WHEN** 用户选择不同模型
- **THEN** 所选模型名称 SHALL 被记录
- **AND** 后续 AI 回复 SHALL 以所选模型的身份生成（模拟）

### Requirement: File upload simulation

用户 SHALL 能选择文件并附加到消息中。

#### Scenario: File selected

- **WHEN** 用户触发文件选择并选中文件
- **THEN** 文件名 SHALL 显示在输入区域附近
- **AND** 下一条发送的消息 SHALL 引用该文件

### Requirement: Two design variants sharing one JS

两份设计稿 SHALL 使用同一份 `demo/shared.js`，所有交互行为完全一致。

#### Scenario: Same JS drives both variants

- **WHEN** `shared.js` 在两份 HTML 中以 `<script type="module">` 加载
- **THEN** 所有交互功能（发送消息、切换会话、搜索、主题切换等）SHALL 正常工作
- **AND** `shared.js` 中 SHALL 不包含对特定 DOM 结构或 CSS 选择器的假设
