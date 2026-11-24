# 第8章　新增一个 API 与配套类型

## 8.1 先确认服务端契约

从服务端路由/处理器确认：HTTP 方法、完整路径、请求参数位置（`params` 还是 `data`）、字段名与响应结构。
路径形如 `/beaver-admin/api/backend/{group}/v1/{action}`；`config.baseAPI` 只提供 origin，不在这里拼业务路径。

## 8.2 加类型

在 `src/types/api/<domain>.ts` 按[第3章](../standards/02-types-and-api.md)声明：

```ts
export interface IGetSummaryReq { agentId: string }
export interface IGetSummaryRes { title: string; itemCount: number }
```

- 只用真实字段；不为一个接口造通用大对象。
- 后端字段变化直接改类型与所有消费者，不保留旧字段别名。

## 8.3 加 API 方法

在 `src/api/<domain>.ts` 仿写同域既有方法：

```ts
export function getSummaryApi(params: IGetSummaryReq) {
  return ajax<IGetSummaryRes>({
    method: "GET",
    url: `${config.baseAPI}/beaver-admin/api/backend/agent/v1/summary`,
    params
  })
}
```

示例端点不存在，仅表达写法。方法名必须以精确大小写 `Api` 结尾；不在 API 层导入页面、弹窗或 Pinia。

## 8.4 调用方

- 页面/store 调用 `...Api`，先判断 `code`，`0` 才读 `result`。
- 失败提示 `msg`，并按[第6章](../standards/05-errors-and-resources.md)处理局部状态与资源。
- 若接口改变登录态语义，同步检查[第5章](../standards/04-auth-and-routing.md)的封装与守卫行为。

## 8.5 收尾

- `vue-tsc --noEmit -p tsconfig.app.json` 检查类型；必要时 `vite build --mode test` 验证打包。
- 更新相关模块页与文档；说明实际验证命令与结果。

[下一章：智能体、专家、模型与工具编排](../modules/agent-console.md) · [返回目录](README.md)
