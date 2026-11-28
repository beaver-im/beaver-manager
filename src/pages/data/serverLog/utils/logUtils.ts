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

import type { ILogEntry } from "@/types/api/log"

export const logTimePresets = [
  { label: "最近15分钟", value: "15m", minutes: 15 },
  { label: "最近1小时", value: "1h", minutes: 60 },
  { label: "最近6小时", value: "6h", minutes: 360 },
  { label: "最近24小时", value: "24h", minutes: 1440 },
  { label: "自定义", value: "custom", minutes: 0 }
]

export type LogViewMode = "raw" | "table"

export interface LogHistogramBar {
  label: string
  count: number
  height: number
}

export interface LogQueryFilters {
  level: string
  source: string
  keyword: string
}

/** 服务端返回毫秒时间戳；缺失时回退用采集时间 createdAt。 */
export function normalizeLogEntry(log: ILogEntry): ILogEntry {
  const ts = Number(log.timestamp) || Date.parse(log.createdAt) || 0
  return {
    level: String(log.level || ""),
    message: String(log.message || ""),
    source: String(log.source || ""),
    module: String(log.module || ""),
    scene: String(log.scene || ""),
    caller: String(log.caller || ""),
    traceId: String(log.traceId || ""),
    userId: String(log.userId || ""),
    deviceId: String(log.deviceId || ""),
    platform: String(log.platform || ""),
    projectName: String(log.projectName || ""),
    version: String(log.version || ""),
    timestamp: ts,
    createdAt: log.createdAt || ""
  }
}

export function getLogTimeRange(preset: string, customRange: string[]) {
  const endTime = Date.now()
  if (preset === "custom" && customRange.length === 2) {
    return {
      startTime: new Date(customRange[0]).getTime(),
      endTime: new Date(customRange[1]).getTime()
    }
  }
  const item = logTimePresets.find(p => p.value === preset)
  const minutes = item?.minutes || 15
  return { startTime: endTime - minutes * 60 * 1000, endTime }
}

/** 只认 level: / source: 前缀，其余部分整体作为关键词。 */
export function parseLogQuery(query: string): LogQueryFilters {
  const result: LogQueryFilters = { level: "", source: "", keyword: "" }
  const trimmed = query.trim()
  if (!trimmed || trimmed === "*") {
    return result
  }
  const keywords: string[] = []
  for (const part of trimmed.split(/\s+AND\s+/i).map(s => s.trim()).filter(Boolean)) {
    const match = part.match(/^([\w.]+)\s*:\s*(.+)$/i)
    if (!match) {
      keywords.push(part)
      continue
    }
    const key = match[1].toLowerCase()
    const value = match[2].trim()
    if (key === "level") {
      result.level = value
    } else if (key === "source") {
      result.source = value
    } else {
      keywords.push(part)
    }
  }
  result.keyword = keywords.join(" ")
  return result
}

export function buildHistogramBars(logs: ILogEntry[]): LogHistogramBar[] {
  if (!logs.length) {
    return []
  }
  const bucketMap = new Map<string, number>()
  for (const log of logs) {
    const d = new Date(log.timestamp)
    const label = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
    bucketMap.set(label, (bucketMap.get(label) || 0) + 1)
  }
  const entries = [...bucketMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  const max = Math.max(...entries.map(([, c]) => c), 1)
  return entries.map(([label, count]) => ({
    label,
    count,
    height: Math.max(8, Math.round((count / max) * 100))
  }))
}

export function sortLogs(logs: ILogEntry[], sortDesc: boolean) {
  return [...logs].sort((a, b) => {
    const diff = (a.timestamp || 0) - (b.timestamp || 0)
    return sortDesc ? -diff : diff
  })
}

export function formatTs(ts: number) {
  return ts ? new Date(ts).toLocaleString() : "-"
}

export function formatTsFull(ts: number) {
  if (!ts) return "-"
  const d = new Date(ts)
  const pad = (n: number, len = 2) => String(n).padStart(len, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
}

export function getLogLevel(log: ILogEntry) {
  return log.level || ""
}

export function getLogMessage(log: ILogEntry) {
  return log.message || ""
}

/** 已知来源的展示文案；source 由上报方自报，未知值原样透出，便于新增端不用改前端。 */
const SOURCE_LABELS: Record<string, string> = {
  server: "服务端",
  main: "桌面主进程",
  render: "桌面渲染",
  flutter: "移动端"
}

export function getSourceLabel(source: string) {
  if (!source) return "-"
  return SOURCE_LABELS[source] || source
}

/** 来源徽标配色：服务端与客户端视觉上区分开。 */
export function getSourceTagType(source: string) {
  if (source === "server") return "info"
  return "success"
}

/** 原始视图：message 本身通常就是一行结构化日志，直接展示。 */
export function formatLogRaw(log: ILogEntry) {
  return log.message || JSON.stringify(log, null, 2)
}

export function getLevelType(level: string) {
  switch ((level || "").toLowerCase()) {
    case "error": return "danger"
    case "warn": return "warning"
    case "info": return "success"
    default: return "info"
  }
}
