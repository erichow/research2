## Context

当前前端项目中，JavaScript 通常通过 CSS 类名（`.input-email`）或 DOM 结构（`parent.querySelector`）来定位元素。当设计师改版 UI 时，类名和结构变化会导致 JS 代码断裂。本项目提出"语义层"方案：用 `data-ref` / `data-action` 属性作为 HTML 与 JS 之间的稳定契约。`useDataRef()` 按语义名收集元素、`useDataAction()` 按语义名绑定交互。

**约束**：零依赖、纯浏览器 ESM、每个源文件 < 1KB。

## Goals / Non-Goals

**Goals:**
- 实现 `useDataRef(root)`：扫描 `[data-ref]` 返回 Proxy，同名多元素智能分发
- 实现 `useDataAction({ root, actions })`：事件委托绑定 `[data-action]` 到回调
- 模块入口 `src/index.js` 统一导出
- 浏览器原生 ESM，无需构建工具即可直接使用

**Non-Goals:**
- 不做 TypeScript 类型定义（后续 change 追加）
- 不做 npm 包发布配置
- 不做 Demo 页面或文档站点
- 不处理 Shadow DOM 穿透
- 不支持 IE11（使用 Proxy 和 ESM）

## Decisions

### 1. ESM over IIFE/UMD

**选择**：浏览器原生 ES Module（`.js` + `type="module"`）。

**理由**：零构建目标下 ESM 是唯一标准方案。`<script type="module">` 在所有现代浏览器中原生支持，无需打包器即可 `import { useDataRef } from './src/index.js'`。

**替代方案**：IIFE 需要手动管理全局命名空间；UMD 需要构建步骤。

### 2. Proxy over 显式 getter/setter

**选择**：`useDataRef` 返回 `Proxy` 对象，对属性访问做智能分发。

**理由**：调用方写 `refs.username.value` 不用关心 `username` 是单元素还是多元素。Proxy 拦截 `get`：
- 若值为 `HTMLElement[]`：
  - 属性在数组原型链上（`length`、`forEach`、`[0]`、`map`…）→ 委托给数组自身
  - 否则 → 透传到 `array[0]`（如 `.value`、`.textContent`、`.focus()`）
- 若值为单个 `HTMLElement` → 直接透传

**替代方案**：显式区分 `refs.username.single` / `refs.username.multi` 增加心智负担；`refs.username()` vs `refs.username[]` 语法繁琐。

### 3. 事件委托 over 逐元素绑定

**选择**：在 `root` 上挂一个事件监听器，通过 `event.target.closest('[data-action]')` 路由。

**理由**：动态增删元素时无需重新绑定；只需一个 `click` 监听器（`data-action` 元素的主要交互是点击）。可扩展 `keydown` 等事件类型按需追加。

**替代方案**：逐元素 `addEventListener` 在 DOM 变化时容易泄漏，且违背零配置理念。

### 4. 查询范围限定 root

**选择**：`useDataRef` 和 `useDataAction` 均接受 `root` 参数，仅在 `root` 子树内查询。

**理由**：支持页面上存在多个独立组件实例，每个实例的 `data-ref` 不会互相干扰。

### 5. 文件拆分

| 文件 | 职责 | 预估大小 |
|------|------|---------|
| `src/useDataRef.js` | `querySelectorAll('[data-ref]')` + Proxy 包装 | ~0.3KB |
| `src/useDataAction.js` | 事件委托 + `data-action` 路由 | ~0.2KB |
| `src/index.js` | re-export | ~0.05KB |

## Risks / Trade-offs

| 风险 | 缓解 |
|------|------|
| Proxy 不支持 IE11 / 旧版 Android WebView | 明确 non-goal，目标为现代浏览器（ES2015+Proxy） |
| 同名 data-ref 但期望「始终单元素」的场景，Proxy 会误判为数组 | 调用方始终知道自己的 HTML 结构；文档建议同名单元素只声明一次 |
| `data-action` 仅支持 click 事件 | 第一个版本先覆盖 90% 场景；后续 change 可扩展 `data-action-event` 属性 |
| `querySelectorAll` 在巨型 DOM 下的性能 | root 限定子树后影响可控；如有需求后续可加 MutationObserver 缓存 |
