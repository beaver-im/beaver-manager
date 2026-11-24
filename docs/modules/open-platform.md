# 第11章　开放平台：机器人、数字伙伴与 OAuth

## 11.1 入口

- 页面：`src/pages/open/bots/`、`src/pages/open/digitals/`、`src/pages/open/oauth/`、`src/pages/open/workbench/`。
- API：[src/api/open.ts](../../src/api/open.ts)（OAuth 列表与状态、机器人列表与状态）、[src/api/digital.ts](../../src/api/digital.ts)、[src/api/workbench.ts](../../src/api/workbench.ts)。
- 类型：`src/types/api/open.ts`、`src/types/api/digital.ts`、`src/types/api/workbench.ts`。

## 11.2 边界

- 管理台只做审核、启停、列表与配置入口；应用凭据、密钥与真实调用发生在服务端/开放平台服务。
- 数字伙伴的编排详情来自 AI 侧 `config_detail`；开放平台侧只持有 `agentId` 引用与渠道参数，前端不复制一份编排真相。
- OAuth 与机器人状态变更必须回读服务端结果；禁止用本地乐观更新冒充成功。
- 长连接接入等运行时形态由服务端契约决定，前端只呈现状态，不自行拼 websocket 地址或凭据。

## 11.3 常见改动

| 改动 | 必查位置 |
| --- | --- |
| 机器/OAuth 审核 | `src/api/open.ts` + `src/pages/open/bots/**`、`src/pages/open/oauth/**` |
| 数字伙伴列表/创建 | `src/api/digital.ts` + `src/pages/open/digitals/**` |
| 工作台应用 | `src/api/workbench.ts` + `src/pages/open/workbench/**` |

[返回模块索引](README.md) · [返回全书目录](../README.md)
