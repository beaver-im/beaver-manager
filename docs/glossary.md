# 术语表

跨章高频且易混淆的名词只在这里定义一次；各章使用本表口径。

| 术语 | 含义 |
| --- | --- |
| 管理面 / `beaver-admin` | 管理台调用的网关面；前端路径形如 `/beaver-admin/api/backend/{group}/v1/{action}` |
| 开放平台面 / `beaver-open` | 开发者、机器人、OAuth 等开放能力所在网关面 |
| `...Api` | 前端对外请求方法，精确大小写后缀；例如 `getAgentListApi` |
| `I...Req` / `I...Res` | 请求/响应数据接口，`src/types/api/` 中定义 |
| `code` / `msg` / `result` | 统一响应信封；`code === 0` 才表示成功 |
| `config` / `config_detail` | AI Agent 编排契约：`config` 为 1 提示词 / 2 工作流，`config_detail` 为 JSON 对象 |
| `knowledgeSource` | 知识源，后端一等实体；前端页面目录为 `src/pages/agent/apps/knowledgeSource/` |
| Store | `src/pinia/**` 中导出的 `use<Domain>Store`，只承担跨组件共享状态 |
| 根组件 | `src/App.vue`，唯一允许大写开头的源文件 |
| 小驼峰 | lowerCamelCase；文件名/目录名默认规则，如 `formCard.vue`、`knowledgeSource/` |
| kebab-case | 短横线小写；仅用于 CSS 类名/HTML 属性，不用于文件名 |
| 兼容性代码 | 仅为旧接口/旧路径/旧字段存在的适配层、双轨分支或空占位；本项目禁止 |

[返回全书目录](README.md)
