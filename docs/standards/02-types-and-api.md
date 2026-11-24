# 第3章　TypeScript 类型、接口请求与数据契约

## 3.1 四条接口命名铁律

来自接口层既有约定（[src/api/readme.md](../../src/api/readme.md)），现在以本章为统一正文：

1. 所有接口类型以 `I` 开头。
2. 请求对象以 `Req` 结尾：`I<Action>Req`。
3. 响应对象以 `Res` 结尾：`I<Action>Res`。
4. 对外请求方法以精确大小写 `Api` 结尾：`getAgentListApi`，不是 `getListAPI` / `get_agent_list`。

仿写既有文件，不自由发明第二套模板。请求/响应类型放在 `src/types/api/` 对应域文件，API 方法放在 `src/api/` 对应域文件。

## 3.2 真实请求封装

[src/utils/request/index.ts](../../src/utils/request/index.ts) 创建 axios 实例，并：

- 请求拦截器注入 `Token`（来自 `localStorage.token`）与 `deviceId`；
- 响应返回 `{ code, msg, result }` 信封；
- `code !== 0` 且 URL 包含 `authentication` 时清理本地登录态并跳登录页；
- 网络异常以 rejected Promise 抛出，不伪装成功响应。

**约束**：API 层只声明 `ajax<I...Res>({ method, url, params/data })`；调用方必须先看 `code`，失败分支不能假定 `result` 存在。未知输入先校验再收窄，不用 `as unknown as` 让不兼容契约“看起来能编译”。

**写法示例（不是已有端点）**：

```ts
export interface IGetSummaryReq { agentId: string }
export interface IGetSummaryRes { title: string; itemCount: number }

export function getSummaryApi(params: IGetSummaryReq) {
  return ajax<IGetSummaryRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-admin/api/backend/agent/v1/summary`,
    params
  })
}
```

示例中 `config.baseAPI` 只含 origin；完整业务路径写在每个 API 的 `url` 中，来源见 [src/config/env.ts](../../src/config/env.ts)。

## 3.3 类型跟着边界走

- 网络响应、JSON 解析、`localStorage` 读取都属于外部输入：先当未知值，校验后使用。
- UI 表单模型、后端实体、请求/响应各自建模；不把后端对象直接当组件可写状态。
- 导出的边界函数写明参数与返回类型；局部 `any` 只允许在明确边界并注明来源，不外溢到业务层。
- 接口字段变更必须同步：类型 → API → 页面 → 相关文档。不为旧字段保留映射层或空占位字段。

## 3.4 评审检查

- `I...Req/Res` 与 `...Api` 是否齐全，是否仿写同域既有文件？
- 失败分支是否访问了可能不存在的 `result`？未知输入是否校验？
- 契约变化是否同步到所有调用方；是否残留旧字段兼容代码？

[下一章：Vue 组件、Pinia 状态、样式和资源](03-vue-and-state.md) · [返回目录](../README.md)
