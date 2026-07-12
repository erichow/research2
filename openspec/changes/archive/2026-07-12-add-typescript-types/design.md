## Context

`useDataRef` 返回 `Proxy`，`useDataAction` 接受 action map。TypeScript 需要知道：
- `useDataRef(root)` 返回的 Proxy 上可以访问哪些属性名（由 HTML 中的 `data-ref` 值决定）
- `useDataAction({ root, actions })` 的 actions 对象中每个 key 对应什么签名的回调

## Goals / Non-Goals

**Goals:**
- 提供 `useDataRef` 的类型签名，允许用户通过泛型参数传入 ref 名称联合类型
- 提供 `useDataAction` 的类型签名，泛型约束 actions 的 key
- 单文件 `src/index.d.ts`，零依赖

**Non-Goals:**
- 不做构建工具集成（tsconfig、tsc）
- 不做 jsdoc 注释（类型文件已足够）

## Decisions

### 1. 泛型参数由调用方传入

`useDataRef<Refs>(root)` — 用户定义 `type Refs = 'username' | 'item'` 传入，返回类型为 `{ [K in Refs]: HTMLElement | HTMLElement[] }` 的 Proxy。

Proxy 层的智能分发（数组属性→数组，DOM 属性→首元素）在类型层面难以精确建模——数组方法返回类型和 DOM 透传不可兼得。折中：返回值类型为简单的 indexed access，不模拟 Proxy 分发。

### 2. DataActions 泛型

```ts
useDataAction<Actions extends Record<string, (ev: Event, el: HTMLElement) => void>>({ root, actions })
```

用户定义 action 签名后，调用处自动补全和类型检查。

### 3. 文件位置

`src/index.d.ts` — 与 `src/index.js` 并列，编辑器自动关联。
