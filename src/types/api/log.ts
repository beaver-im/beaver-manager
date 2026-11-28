/**
 * Copyright (c) 2024-2026 Beaver IM Team
 * SPDX-License-Identifier: MIT
 * Project: beaver-manager
 * https://github.com/wsrh8888/beaver-manager
 *
 * 中文：
 * 本文件为海狸 IM（Beaver IM）开源项目源代码。
 * 版权所有 © 2024-2026 Beaver IM Team，基于 MIT 协议授权。
 * 禁止删除、篡改或替换本文件头部版权与许可声明。
 * 使用与商业授权说明：https://wsrh8888.github.io/beaver-docs/community/license.html
 *
 * English:
 * This file is part of the Beaver IM open-source project.
 * Copyright (c) 2024-2026 Beaver IM Team. Licensed under the MIT License.
 * Do not remove, alter, or replace this copyright and license header.
 * Usage & commercial licensing: https://wsrh8888.github.io/beaver-docs/community/license.html
 *
 * beaver-manager-header-v1
 */

// ========================= 日志接口类型 =========================
// 只有一个桶 beaver-logs：服务端运行日志（Vector 采集）与客户端日志（SDK 上报）同索引，
// 靠 source 字段区分，便于按 traceId / userId 把两端串起来排查。
// source 是上报方自报的值，服务端不枚举白名单：server（Vector）/ main、render（桌面）/ flutter（移动端）。
// 只有日志检索，没有统计聚合——统计能力已整体移除。
export type LogSource = string

export interface ILogEntry {
  level: string
  message: string
  source: string
  module: string
  scene: string
  caller: string
  traceId: string
  userId: string
  deviceId: string
  platform: string
  projectName: string
  version: string
  timestamp: number
  createdAt: string
}

export interface IQueryLogsReq {
  source?: LogSource
  level?: string
  startTime: number
  endTime: number
  keyword?: string
  page?: number
  pageSize?: number
}

export interface IQueryLogsRes {
  total: number
  logs: ILogEntry[]
}

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error"
}
