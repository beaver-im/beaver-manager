# 第10章　用户、合规与消息审计

## 10.1 入口

- 用户：`src/pages/user/list/`、`src/pages/user/profile/`，API 为 [src/api/user.ts](../../src/api/user.ts)、[src/api/friend.ts](../../src/api/friend.ts)、[src/api/group.ts](../../src/api/group.ts)。
- 消息审计：`src/pages/compliance/messages/`、`src/pages/compliance/sessions/`，API 为 [src/api/chat.ts](../../src/api/chat.ts)。
- 圈子/动态：`src/api/circle.ts`、`src/api/moment.ts`；表情相关在 `src/pages/assets/emojiPackages/`（小驼峰目录）与 [src/api/emoji.ts](../../src/api/emoji.ts)。
- 风控处置：[src/api/moderation.ts](../../src/api/moderation.ts) 的 `executeUserControlApi`。

## 10.2 操作边界

- 列表、详情、删除、批量恢复等操作统一走对应域 `...Api`，不在页面里直接请求网关。
- 审计查询条件与时间范围属于外部输入，先校验再提交；返回为空要显示空态，不把失败当空结果。
- 删除、封禁、清空会话等破坏性动作必须有二次确认；页面提示不得伪造服务端结果。
- 用户资料页展示的字段以服务端响应为准；接口删字段时同步删页面展示，不保留空占位。

## 10.3 常见改动

| 改动 | 必查位置 |
| --- | --- |
| 用户列表筛选/批量操作 | `src/pages/user/list/index.vue` + `src/api/user.ts` + `src/types/api/user.ts` |
| 消息检索/恢复 | `src/pages/compliance/messages/index.vue` + `src/api/chat.ts` |
| 用户 360 展示字段 | `src/pages/user/profile/**` + 对应用户/关系 API |
| 风控动作 | `src/api/moderation.ts` + 调用页面 |

[返回模块索引](README.md) · [返回全书目录](../README.md)
