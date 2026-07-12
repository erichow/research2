## Why

当前 `useDataRef` 和 `useDataAction` 返回 `Proxy` 对象，IDE 无法推断属性名和回调签名，开发者在 TypeScript 项目中得不到自动补全和类型检查。添加声明文件让类型安全覆盖整个 API 表面。

## What Changes

- 新增 `src/index.d.ts`：导出 `useDataRef` 和 `useDataAction` 的完整类型签名
- `useDataRef` 返回泛型 Proxy 类型，支持按 `data-ref` 名称自动补全
- `useDataAction` 的 `actions` 参数根据传入的 action 名推导回调签名
- 不修改任何运行时代码（`.d.ts` 只是类型声明）

## Capabilities

### New Capabilities

- `typescript-types`: TypeScript 类型声明文件，为 `useDataRef` 和 `useDataAction` 提供完整的类型定义

### Modified Capabilities

<!-- 不修改已有 capability -->

## Impact

| 维度 | 说明 |
|------|------|
| 代码 | 新增 `src/index.d.ts`，不修改 `.js` 文件 |
| 依赖 | 零外部类型依赖 |
| 使用方 | 在 `tsconfig.json` 或 `package.json` 的 `types` 字段中指向该文件后，编辑器自动加载 |
