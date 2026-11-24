# ADR 0001：文件命名以 App.vue 为唯一大写例外

- 状态：已确认（用户明确指定，2026-11-24）
- 决策者：项目所有者
- 相关规范：[第2章](../standards/01-boundaries-and-naming.md)

## 背景

仓库中曾出现 PascalCase、kebab-case 与 lowerCamelCase 混用；Windows 大小写不敏感的文件系统还产生过仅大小写不同的路径，导致导入与文档链接不稳定。需要一套可直接机械验证的命名规则。

## 决策

- **唯一例外**：`src/App.vue` 大写开头，遵循 Vue 根组件约定。
- `src` 下其余文件与目录一律小驼峰（lowerCamelCase），包括组件、工具、类型、图片/SVG 与 `readme.md`。
- `index.vue` 可作为目录入口；CSS 类名和 HTML 属性继续用 kebab-case，不属于文件名规则。
- 改名必须同步全部引用，不保留旧路径占位、转发文件或兼容导出。

## 影响

- 所有新文件按此命名；存量差异在触及任务中直接改正。
- [check-knowledge.mjs](../../scripts/check-knowledge.mjs) 将 `src` 命名作为机械检查项，其他例外须显式加入清单并说明理由。

## 替代方案

- 全部 PascalCase：与 Vue 根组件惯例冲突，用户未选。
- 目录用 kebab-case：与本决策的小驼峰要求冲突，用户未选。
- 保留双路径兼容：违反“无历史包袱、不留兼容代码”的最高原则。

## 验证

- 文档检查通过；`src` 命名扫描无违规项。
- `vue-tsc` 与构建确认所有 import、路由懒加载和静态资源引用指向改名后的真实文件。

[返回 ADR 索引](README.md) · [返回全书目录](../README.md)
