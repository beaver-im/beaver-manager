/**
 * 智能体详情 Tab 共享工具函数。
 *
 * 编排详情唯一真相源是 Agent.config_detail（type=1 prompt / 2 workflow），
 * 内部键 snake_case，与 AI 侧同构原样透传。这里只做空值兜底与深拷贝。
 */
import type { IPromptVariable, IAgentConfigDetail, IAgentPromptDetail } from "@/types/api/agent"

export type GenerationStyle = "stable" | "balanced" | "creative" | "custom"

export { type IPromptVariable }

/** JSON 数组字符串 → 字符串数组（仅用于 knowledgeIds 这类仍以字符串承载的 ID 列表） */
export function parseIdList(raw: string): string[] {
  if (!raw || raw.trim().charAt(0) !== "[") return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.filter((item): item is string => typeof item === "string")
  } catch {
    /* ignore */
  }
  return []
}

/** 从 configDetail 取提示词块（type=1）；NULL/非对象一律空字典 */
export function promptOf(detail: IAgentConfigDetail | null | undefined): IAgentPromptDetail {
  if (!detail || detail.type !== 1 || !detail.prompt || typeof detail.prompt !== "object") return {}
  return detail.prompt
}

/** 开场问题数组兜底 */
export function openingQuestionsOf(detail: IAgentConfigDetail | null | undefined): string[] {
  const q = promptOf(detail).opening_questions
  return Array.isArray(q) ? q.map(String) : []
}

/** 变量数组兜底（深拷贝，避免直接改到 props 里的对象） */
export function varsOf(detail: IAgentConfigDetail | null | undefined): IPromptVariable[] {
  const v = promptOf(detail).variables
  if (!Array.isArray(v)) return []
  return v.map((item) => ({
    name: String(item.name || ""),
    label: String(item.label || ""),
    type: (item.type as IPromptVariable["type"]) || "text",
    options: Array.isArray(item.options) ? item.options.map(String) : [],
    default: String(item.default || ""),
    required: !!item.required
  }))
}

/** 构造 type=1 提示词编排详情，内部键 snake_case */
export function buildPromptDetail(p: {
  system: string
  opening_message: string
  opening_questions: string[]
  variables: IPromptVariable[]
}): IAgentConfigDetail {
  return {
    type: 1,
    prompt: {
      system: p.system,
      opening_message: p.opening_message,
      opening_questions: p.opening_questions.map((q) => q.trim()).filter(Boolean),
      variables: p.variables
    }
  }
}
