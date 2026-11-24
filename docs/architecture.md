# 第1章　系统全貌：单页管理台、布局、路由与数据流

最后核验：2026-11-24（Asia/Shanghai）。这里是**当前事实**，不把设计愿望当实现。

## 1.1 进程与运行时

beaver-manager 是 **Vue 3 + TypeScript + Vite 7** 的单页管理台，不是 Electron 应用，也没有独立主进程/插件系统。运行时只有浏览器渲染进程：

- [package.json](../package.json) 是脚本与依赖事实源：`dev`、`build_prod`、`build_test`、`lint`、`add-copyright-header`。根没有 `test` 脚本。
- [vite.config.ts](../vite.config.ts) 定义 `@` → `src` 别名、Element Plus 自动导入与组件解析；`base: "./"` 便于子目录静态托管。
- [tsconfig.app.json](../tsconfig.app.json) 开启 `strict`、`noUnusedLocals`、`noUnusedParameters`。
- [src/App.vue](../src/App.vue) 是唯一大写开头的源文件，由 [src/main.ts](../src/main.ts) 挂载；其余文件/目录按[第2章](standards/01-boundaries-and-naming.md)小驼峰。

## 1.2 一次页面加载经过什么

```text
浏览器 → src/App.vue → src/main.ts（Pinia + Router + Element Plus）
       → src/router/index.ts（hash 路由，懒加载 pages/*）
       → src/layouts/index.vue（Sidebar + navigationBar + router-view）
       → src/pages/<domain>/<feature>/index.vue
       → src/api/<domain>.ts → src/utils/request/index.ts → 网关
```

**真实事实**：路由采用 `createWebHashHistory`；布局外壳固定在 `src/layouts/index.vue`，导航组件是 `src/layouts/components/navigationBar/index.vue`，侧栏是 `src/layouts/components/sidebar/index.vue`。
路由里的 `component` 一律用 `@/pages/...` 动态 import，新增页面必须挂到对应域的路由树下。

## 1.3 数据流的四个职责层

| 层 | 真实位置 | 职责 | 不应做 |
| --- | --- | --- | --- |
| 页面 | `src/pages/<domain>/...` | 表单、列表、交互、局部状态 | 不自己拼鉴权头、不散落 URL |
| API | `src/api/*.ts` | 一个动作一个 `...Api` 方法，声明 `I...Req/Res` 与 URL | 不导入组件、不弹窗、不改 Pinia |
| 请求封装 | `src/utils/request/index.ts` | axios 实例、Token/deviceId 注入、`code/msg/result` 信封 | 不替业务决定列表合并与重试 |
| 状态 | `src/pinia/**` | 跨组件共享的登录态、菜单、公共数据 | 不作为持久化事实源 |

**配置来源**：[src/config/env.ts](../src/config/env.ts) 导出 `config.baseAPI`（只含 origin，不含路径）与 `config.env`；每个接口的完整路径写在 API 文件里，形如 `/beaver-admin/api/backend/{group}/v1/{action}`。

## 1.4 后端边界

本管理台只对接网关的管理面与开放平台面；路径段与鉴权由服务端决定，前端不自行判断“内部/外部”。
业务契约在下述位置追踪：

- `src/types/api/*`：各域请求/响应与实体类型；
- `src/api/*`：实际 URL 与 HTTP 方法；
- 服务端 `beaver-server` / `beaver-server-open` / `beaver-server-backend`：接口与数据的真相源。

接口字段变化必须同时改类型、API、页面和文档；不因为“前端暂时没用到”保留旧字段映射。

## 1.5 页面域速览

`src/pages` 下按业务域分目录，每页通常以 `index.vue` 作入口：

| 域 | 说明 |
| --- | --- |
| `workspace` | 运营工作台首页 |
| `user` | 用户列表、用户 360 |
| `compliance` / `safety` | 消息检索、会话审计、申诉 |
| `agent` | 智能体、专家、模型、工具、MCP、数字伙伴与知识源 |
| `assets` | 表情包、表情、文件 |
| `open` | 开放平台的机器人、数字伙伴、OAuth、工作台 |
| `data` / `release` / `system` / `service` / `common` | 数据、发布、系统、反馈、登录与错误页 |

具体符号与入口见[第四篇模块参考](modules/README.md)。

[下一章：目录、命名、依赖方向与模块边界](standards/01-boundaries-and-naming.md) · [返回目录](README.md)
