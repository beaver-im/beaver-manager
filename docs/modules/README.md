# 第四篇　模块参考与定位索引

最后核验：2026-11-24（Asia/Shanghai）。从任务类型选一两页，不必全部加载。

| 问题 / 变更 | 指南 | 首选关键词 |
| --- | --- | --- |
| 智能体、专家、模型、工具、知识源 | [Agent 控制台](agent-console.md) | `getAgentListApi`、`configDetail`、`knowledgeSource` |
| 用户、好友、群、消息、表情、圈子、动态、审计 | [用户与合规](user-compliance.md) | `getUserListApi`、`getChatMessageListApi`、`moderation` |
| 机器人、数字伙伴、OAuth、工作台 | [开放平台](open-platform.md) | `getOpenBotListApi`、`digital`、`oauth` |
| 工作台、数据日志、文件、系统权限、发布 | [运营与平台](platform-ops.md) | `getDashboardOverviewApi`、`queryLogsApi`、`releasePolicy` |

方法：文件名/符号精确检索 → 定点读源码 → 追到必要调用方与契约 → 验证。
可用工具自带检索；不要用 `node_modules`、`dist`、日志、缓存的重复文本当实现。
接口跨度超过一页时回看[架构](../architecture.md)，并在交接中记录实际追到的文件。

[返回全书目录](../README.md)
