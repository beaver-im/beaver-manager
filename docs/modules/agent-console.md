# 第9章　智能体、专家、模型与工具编排

## 9.1 入口

- 页面：`src/pages/agent/apps/`、`src/pages/agent/experts/`、`src/pages/agent/models/`、`src/pages/agent/tools/`、`src/pages/agent/mcp/`、`src/pages/agent/digitals/`。
- 知识源页面：`src/pages/agent/apps/knowledgeSource/`（目录小驼峰；入口 `index.vue`，子组件如 `ksDetailView.vue`）。
- API：[src/api/agent.ts](../../src/api/agent.ts)、[src/api/knowledgeSource.ts](../../src/api/knowledgeSource.ts)、[src/api/digital.ts](../../src/api/digital.ts)。
- 类型：[src/types/api/agent.ts](../../src/types/api/agent.ts) 及同目录领域文件。

## 9.2 编排契约

AI 侧 Agent 的唯一编排真相源是 `config` + `config_detail`：

- `config` 是裸数字：`1` 提示词、`2` 工作流。
- `config_detail` 是对象，内部键 snake_case：`{ type, prompt?, workflow? }`。
- `prompt` 含 `system`、`opening_message`、`opening_questions`、`variables`；变量字段是 `name`、`label`、`type`、`default`、`required`、`options`，类型取 `text | textarea | select`。

前端只做读写与展示：页面不再提交模型选择、生成参数、工具/MCP 绑定或专家卡面字段；工具/MCP 页面是注册表浏览，启用属于用户本机能力。

## 9.3 常见改动

| 改动 | 必查位置 |
| --- | --- |
| 编排字段变化 | `src/types/api/agent.ts` → `src/pages/agent/apps/detail/tabs/orchestrationTab.vue` → `shared.ts` |
| 专家列表/编辑 | `src/api/agent.ts` 的 `getExpertListApi` 等 → `src/pages/agent/experts/index.vue` |
| 知识源上传/召回 | `src/api/knowledgeSource.ts` → `src/pages/agent/apps/knowledgeSource/**` |
| 数字伙伴绑定 | `src/api/digital.ts` → 服务端 AI/backend 契约 |

字段变化必须一路改齐，不留旧字段兜底或空占位。

[返回模块索引](README.md) · [返回全书目录](../README.md)
