## Why

前端开发中，JavaScript 代码通过 CSS 类名或 DOM 结构定位元素，UI 改版后这些选择器频繁断裂。本库引入"语义层"作为 HTML 与 JS 之间的稳定契约——`data-ref` 标记元素引用、`data-action` 标记用户操作——让 UI 自由迭代而业务代码不用改。

## What Changes

- 新增 `useDataRef(root)` 函数：扫描 `[data-ref]` 元素，返回 Proxy 对象，同名多元素智能分发（数组属性→数组，DOM 属性→首个元素）
- 新增 `useDataAction({ root, actions })` 函数：通过事件委托绑定 `[data-action]` 元素到对应的回调
- 新增 `src/index.js` 统一导出
- 零依赖，纯浏览器 ESM，每个文件 < 1KB

## Capabilities

### New Capabilities

- `data-ref-binding`: 通过 `data-ref` 属性声明式收集 DOM 元素引用，Proxy 层自动处理单元素 / 多元素语义
- `data-action-binding`: 通过 `data-action` 属性声明事件委托，将 DOM 交互路由到 JS 回调

### Modified Capabilities

<!-- 首个 change，无已有 capability 需要修改 -->

## Impact

| 维度 | 说明 |
|------|------|
| 代码 | 新增 `src/useDataRef.js`、`src/useDataAction.js`、`src/index.js`，不影响已有代码（项目从零开始） |
| 依赖 | 零外部依赖，浏览器原生 ESM（`type="module"`） |
| API | 两个公开函数：`useDataRef(root)` 返回 `Proxy<Record<string, HTMLElement | HTMLElement[]>>`；`useDataAction({ root, actions })` 无返回值 |
| 平台 | 所有支持 ES2015+ 的现代浏览器 |
