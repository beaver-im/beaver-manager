# 工程目录速查

找文件、判断能否改、确认副作用。这里只记录事实位置，规范见[第二篇](standards/README.md)。最后核验：2026-11-24。

## 顶层

| 路径 | 作用 | 改动注意 |
| --- | --- | --- |
| `src/` | 全部前端源码 | 命名规则见[第2章](standards/01-boundaries-and-naming.md) |
| `docs/` | 本工程手册 | 改入口/契约/命令时同次更新 |
| `scripts/add-copyright-header.mjs` | 版权头脚本 | 由 `npm run add-copyright-header` 调用 |
| `scripts/check-knowledge.mjs` | 文档/命名检查 | 对应[知识清单](knowledge-checks.json) |
| `types/auto/` | Vite 自动生成的类型声明 | 自动生成，不手改 |
| `.env.dev` / `.env.test` / `.env.prod` | 各模式环境变量 | 不读取/记录真实令牌 |

## src 分区

| 路径 | 作用 | 常见改动 |
| --- | --- | --- |
| `src/App.vue` | 根组件，唯一大写例外 | 挂载点变化时改 `src/main.ts` |
| `src/main.ts` | 应用入口 | Pinia、Router、Element Plus 装配 |
| `src/api/` | HTTP 方法，一域一文件 | 增加 `...Api`，类型放 `src/types/api/` |
| `src/assets/images/` | 图片与 SVG | 文件名小驼峰，如 `knowledgeSource/segmentSpark.svg` |
| `src/config/` | `env.ts`、`menu.ts`、`track.ts` | `baseAPI` 来自环境变量 |
| `src/layouts/` | 布局外壳与 `components/` | `sidebar/`、`navigationBar/`、`appMain/` |
| `src/pages/` | 业务页面，按域分子目录 | 入口 `index.vue`，页面内组件小驼峰 |
| `src/pinia/` | 共享状态 | `use<Domain>Store` |
| `src/router/index.ts` | hash 路由与登录守卫 | 新页面挂到域路由树 |
| `src/types/api/` | 请求/响应与实体类型 | `I...Req/Res` |
| `src/types/pages/`、`src/types/utils/` | 页面/工具本地类型 | 不把领域契约塞这里 |
| `src/utils/request/index.ts` | axios 封装与 Token 注入 | 鉴权头、响应信封在这里 |
| `src/utils/` 其余子目录 | 存储、上传、校验、工具 | 复用既有，不造平行实现 |

## 改名后的关键路径

| 旧名（已废弃） | 当前路径 |
| --- | --- |
| `src/app.vue` | [src/App.vue](../src/App.vue) |
| `src/layouts/components/app-main/` | `src/layouts/components/appMain/` |
| `src/layouts/components/navigation-bar/` | `src/layouts/components/navigationBar/` |
| `src/pages/agent/apps/knowledge-source/` | `src/pages/agent/apps/knowledgeSource/` |
| `src/pages/assets/emoji-packages/` | `src/pages/assets/emojiPackages/` |
| `src/assets/images/knowledge-source/` | `src/assets/images/knowledgeSource/` |
| `src/pages/common/error/404.vue` | `src/pages/common/error/notFound.vue` |
| `src/api/README.md` | `src/api/readme.md` |

旧路径只作历史索引，不存在兼容文件；所有 import 与文档链接都指向当前路径。

[返回全书目录](README.md)
