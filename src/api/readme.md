# 接口层命名约定

本文件是接口层原有约定的落点；统一正文以[第3章：TypeScript 类型、接口请求与数据契约](../../docs/standards/02-types-and-api.md)为准，冲突时改齐两边，不保留双份规则。

1. 所有接口前端类型必须加 `I`。
2. 请求参数以 `Req` 结尾：`IXXXReq`。
3. 请求响应以 `Res` 结尾：`IXXXRes`。
4. 接口方法以 `Api` 结尾：`getAgentListApi`。
5. 仿写其他文件，不自由发挥；模板架构已定好。
