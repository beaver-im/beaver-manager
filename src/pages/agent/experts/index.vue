<!--
  Copyright (c) 2024-2026 Beaver IM Team
  SPDX-License-Identifier: MIT
  Project: beaver-manager
  https://github.com/wsrh8888/beaver-manager

  专家中心管理页：列表官方/自建专家，编辑其卡面展示字段。
  字段契约对齐 WorkBuddy plugin.json v2.0，走管理后台 agent CRUD，
  内容落库、由后台可配——不在前端或 py 代码里硬编码专家清单。
-->

<template>
  <div class="expert-admin">
    <div class="expert-admin-header">
      <h2 class="expert-admin-title">专家中心</h2>
      <p class="expert-admin-hint">管理专家在 AI 面板卡片墙上展示的分类、职业、标签、简介与推荐提示词。</p>
    </div>

    <el-form :inline="true" class="expert-admin-form">
      <el-form-item label="关键词">
        <el-input v-model="keyword" placeholder="名称 / ID" clearable style="width: 180px" />
      </el-form-item>
      <el-form-item label="来源">
        <el-select v-model="sourceFilter" style="width: 130px">
          <el-option label="全部" value="" />
          <el-option label="官方" value="official" />
          <el-option label="自建" value="custom" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="load">搜索</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="filtered" border stripe>
      <el-table-column prop="name" label="专家名称" min-width="150" />
      <el-table-column prop="agentId" label="ID" min-width="150" show-overflow-tooltip />
      <el-table-column label="类型" width="90">
        <template #default="{ row }">
          <el-tag :type="row.expertType === 'team' ? 'warning' : 'primary'" size="small">
            {{ row.expertType === 'team' ? '团队' : '个人' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="categoryId" label="分类" min-width="130" />
      <el-table-column label="职业" min-width="120">
        <template #default="{ row }">{{ i18nText(row.profession) }}</template>
      </el-table-column>
      <el-table-column label="标签" min-width="160">
        <template #default="{ row }">
          <el-tag v-for="(t, i) in parseArr(row.tags).slice(0, 3)" :key="i" size="small" class="tag-gap">
            {{ t.zh || t.en }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'" size="small">
            {{ row.status === 1 ? "启用" : "停用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑卡面</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑专家卡面" width="640px" destroy-on-close>
      <el-form :model="form" label-width="96px">
        <el-form-item label="专家名称">
          <el-input v-model="form.name" maxlength="40" />
        </el-form-item>
        <el-form-item label="分类 ID">
          <el-input v-model="form.categoryId" placeholder="如 01-ProductDesign" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.expertType" style="width: 140px">
            <el-option label="个人" value="persona" />
            <el-option label="团队" value="team" />
          </el-select>
        </el-form-item>
        <el-form-item label="职业(中/英)">
          <div class="i18n-row">
            <el-input v-model="form.profession.zh" placeholder="中文" />
            <el-input v-model="form.profession.en" placeholder="English" />
          </div>
        </el-form-item>
        <el-form-item label="头像路径">
          <el-input v-model="form.avatar" placeholder="相对路径或 URL" />
        </el-form-item>
        <el-form-item label="展示名(中/英)">
          <div class="i18n-row">
            <el-input v-model="form.nameI18n.zh" placeholder="中文" />
            <el-input v-model="form.nameI18n.en" placeholder="English" />
          </div>
        </el-form-item>
        <el-form-item label="简介(中/英)">
          <div class="i18n-row">
            <el-input v-model="form.descriptionI18n.zh" placeholder="中文 40-50 字" />
            <el-input v-model="form.descriptionI18n.en" placeholder="English" />
          </div>
        </el-form-item>
        <el-form-item label="标签(中/英)">
          <div v-for="(tag, i) in form.tags" :key="i" class="i18n-row tag-edit">
            <el-input v-model="tag.zh" placeholder="中文" />
            <el-input v-model="tag.en" placeholder="English" />
            <el-button link type="danger" @click="form.tags.splice(i, 1)">删</el-button>
          </div>
          <el-button link type="primary" :disabled="form.tags.length >= 3" @click="addTag">+ 标签（最多 3）</el-button>
        </el-form-item>
        <el-form-item label="提示词(中/英)">
          <div v-for="(q, i) in form.quickPrompts" :key="i" class="i18n-row tag-edit">
            <el-input v-model="q.zh" placeholder="中文" />
            <el-input v-model="q.en" placeholder="English" />
            <el-button link type="danger" @click="form.quickPrompts.splice(i, 1)">删</el-button>
          </div>
          <el-button link type="primary" :disabled="form.quickPrompts.length >= 3" @click="addPrompt">+ 提示词（最多 3）</el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { getAgentListApi, updateAgentApi } from '@/api/agent'
import type { IAgentInfo } from '@/types/api/agent'

interface I18nPair { zh: string, en: string }

export default defineComponent({
  name: 'ExpertAdmin',
  setup() {
    const loading = ref(false)
    const saving = ref(false)
    const agents = ref<IAgentInfo[]>([])
    const keyword = ref('')
    const sourceFilter = ref('')
    const dialogVisible = ref(false)
    const editingId = ref('')

    const form = reactive({
      name: '',
      categoryId: '',
      expertType: 'persona',
      avatar: '',
      profession: { zh: '', en: '' } as I18nPair,
      nameI18n: { zh: '', en: '' } as I18nPair,
      descriptionI18n: { zh: '', en: '' } as I18nPair,
      tags: [] as I18nPair[],
      quickPrompts: [] as I18nPair[],
    })

    const filtered = computed(() => agents.value.filter(a => {
      if (sourceFilter.value && a.source !== sourceFilter.value)
        return false
      if (keyword.value) {
        const kw = keyword.value.toLowerCase()
        return a.name.toLowerCase().includes(kw) || a.agentId.toLowerCase().includes(kw)
      }
      return true
    }))

    const parseObj = (raw: string): I18nPair => {
      if (!raw)
        return { zh: '', en: '' }
      try {
        const o = JSON.parse(raw)
        return { zh: o.zh || '', en: o.en || '' }
      } catch {
        return { zh: raw, en: '' }
      }
    }
    const parseArr = (raw: string): I18nPair[] => {
      if (!raw)
        return []
      try {
        const arr = JSON.parse(raw)
        return Array.isArray(arr) ? arr.map(x => (typeof x === 'string' ? { zh: x, en: x } : x)) : []
      } catch {
        return []
      }
    }
    const i18nText = (raw: string): string => {
      const o = parseObj(raw)
      return o.zh || o.en || ''
    }

    const load = async () => {
      loading.value = true
      try {
        const res = await getAgentListApi({ page: 1, pageSize: 500 })
        // 专家 = 有分类ID 或 persona/team 类型的 Agent；排除场景智能体（无 expertType 语义的按分类空串过滤）
        agents.value = (res.result?.list || []).filter((a: IAgentInfo) => a.categoryId || a.expertType)
      } finally {
        loading.value = false
      }
    }

    const openEdit = (row: IAgentInfo) => {
      editingId.value = row.agentId
      form.name = row.name
      form.categoryId = row.categoryId || ''
      form.expertType = row.expertType || 'persona'
      form.avatar = row.avatar || ''
      form.profession = parseObj(row.profession)
      form.nameI18n = parseObj(row.nameI18n)
      form.descriptionI18n = parseObj(row.descriptionI18n)
      form.tags = parseArr(row.tags)
      form.quickPrompts = parseArr(row.openingQuestions)
      dialogVisible.value = true
    }

    const addTag = () => form.tags.push({ zh: '', en: '' })
    const addPrompt = () => form.quickPrompts.push({ zh: '', en: '' })

    const save = async () => {
      if (!editingId.value)
        return
      saving.value = true
      try {
        await updateAgentApi({
          agentId: editingId.value,
          name: form.name,
          categoryId: form.categoryId,
          expertType: form.expertType,
          avatar: form.avatar,
          profession: JSON.stringify(form.profession),
          nameI18n: JSON.stringify(form.nameI18n),
          descriptionI18n: JSON.stringify(form.descriptionI18n),
          tags: JSON.stringify(form.tags.filter(t => t.zh || t.en)),
          openingQuestions: JSON.stringify(form.quickPrompts.filter(q => q.zh || q.en)),
        })
        dialogVisible.value = false
        await load()
      } finally {
        saving.value = false
      }
    }

    onMounted(load)
    return {
      loading, saving, agents, keyword, sourceFilter, dialogVisible, form,
      filtered, parseArr, i18nText, load, openEdit, addTag, addPrompt, save,
    }
  },
})
</script>

<style scoped>
.expert-admin { padding: 20px; }
.expert-admin-header { margin-bottom: 16px; }
.expert-admin-title { margin: 0 0 6px; font-size: 18px; }
.expert-admin-hint { margin: 0; color: #8a9196; font-size: 12px; }
.expert-admin-form { margin-bottom: 8px; }
.tag-gap { margin-right: 4px; }
.i18n-row { display: flex; align-items: center; gap: 8px; width: 100%; }
.i18n-row .el-input { flex: 1; }
.tag-edit { margin-bottom: 6px; }
</style>
