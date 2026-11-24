# 第7章　新增页面或普通业务功能

## 7.1 开始前

1. 明确页面属于哪个域：`workspace` / `user` / `compliance` / `agent` / `assets` / `open` / `data` / `release` / `system` / `service`。
2. 确认是否已有同域页面可复用；不要把新功能塞进无关的 `index.vue`。
3. 查 `git status`，不覆盖他人未提交改动。

## 7.2 落文件

- 页面目录：`src/pages/<domain>/<feature>/`，入口固定 `index.vue`；页面内子组件用小写驼峰，如 `formCard.vue`。
- 目录名同样小驼峰：`knowledgeSource/`，不是 `knowledge-source/`。
- 页面内局部状态用 `ref` / `reactive`；跨组件共享才建 `src/pinia/<domain>/*.ts` 并导出 `use<Domain>Store`。
- 路由挂到 [src/router/index.ts](../../src/router/index.ts) 对应域树下：

```ts
{
  path: "summary",
  name: "示例页面",
  component: () => import("@/pages/agent/summary/index.vue")
}
```

示例路径不存在，仅说明写法；真实新增时把 `summary` 换成实际功能名，并保证文件已存在。

## 7.3 数据与交互

- 需要接口时先按[第8章](02-add-api.md)加类型和方法，页面只调用 `...Api`。
- 判断 `code`：`0` 才用 `result`；失败提示 `msg` 或统一文案，不渲染空成功态。
- 空态、加载态、失败态都要可见；快速切换时防止旧响应覆盖新状态。
- 样式写在 `.vue` 的 `<style lang="less" scoped>`；图标走 Element Plus 或小驼峰资源文件。

## 7.4 收尾

- 运行 `node_modules/.bin/vue-tsc --noEmit -p tsconfig.app.json`，确认新增文件无类型错误。
- 运行 `node scripts/check-knowledge.mjs`；页面结构/入口变化时同步改[目录页](../directory.md)与[模块参考](../modules/README.md)。
- 说明实际命令、结果和未验证项；不要提交/推送，除非用户明确要求。

[下一章：新增一个 API 与配套类型](02-add-api.md) · [返回目录](README.md)
