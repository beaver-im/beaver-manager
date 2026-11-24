# 第12章　运营、数据、文件与发布

## 12.1 入口

- 运营工作台：`src/pages/workspace/operations/`，API 为 [src/api/overview.ts](../../src/api/overview.ts)、[src/api/operations.ts](../../src/api/operations.ts)。
- 数据与日志：`src/pages/data/**`，API 为 [src/api/track.ts](../../src/api/track.ts)、[src/api/monitor.ts](../../src/api/monitor.ts)。
- 文件：`src/pages/assets/files/`，API 为 [src/api/file.ts](../../src/api/file.ts) 与 `src/utils/upload/**`。
- 系统权限：`src/pages/system/**`，API 为 [src/api/system.ts](../../src/api/system.ts)。
- 发布：`src/pages/release/**`，API 为 [src/api/update.ts](../../src/api/update.ts)。
- 反馈：`src/pages/service/feedback/`，API 为 [src/api/feedback.ts](../../src/api/feedback.ts)。

## 12.2 边界

- 概览图表与趋势数据来自后端聚合；前端不在页面内二次编造统计口径。
- 日志查询条件、时间范围与分页是外部输入，先校验；失败不能渲染成空图表。
- 文件上传走统一上传工具，不在页面里散落 Qiniu/表单实现；删除文件需要确认。
- 菜单、角色、管理员变更影响登录后可访问页面，必须与服务端权限契约同步；前端路由守卫不是权限系统（见[第5章](../standards/04-auth-and-routing.md)）。
- 发布版本与策略变更属于高风险操作，按服务端返回展示结果，不本地推断发布成功。

## 12.3 常见改动

| 改动 | 必查位置 |
| --- | --- |
| 工作台卡片/趋势 | `src/pages/workspace/operations/index.vue` + `src/api/overview.ts` |
| 日志检索 | `src/pages/data/clientLog/**` + `src/api/track.ts` |
| 菜单/角色/管理员 | `src/pages/system/**` + `src/api/system.ts` |
| 版本与发布策略 | `src/pages/release/**` + `src/api/update.ts` |

[返回模块索引](README.md) · [返回全书目录](../README.md)
