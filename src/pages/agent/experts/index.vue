<!--
  Copyright (c) 2024-2026 Beaver IM Team
  SPDX-License-Identifier: MIT
  Project: beaver-manager
  https://github.com/wsrh8888/beaver-manager

  专家中心管理页：列官方/自建专家，编辑基础信息与编排（提示词/开场问题）。
  走 backend expert_* → AI console *_expert，底层是 Agent 表，编排唯一真相源是 config_detail。
  模型、工具/MCP 绑定、卡面多语字段不属于 Agent，已从本页移除。
-->

<template>
  <div class="expert-admin">
    <div class="expert-admin-header">
      <h2 class="expert-admin-title">专家中心</h2>
      <p class="expert-admin-hint">管理专家的名称、简介、头像与编排（系统提示词、开场问题）。</p>
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
      <el-table-column prop="description" label="简介" min-width="200" show-overflow-tooltip />
      <el-table-column label="配置" width="90">
        <template #default="{ row }">
          <el-tag size="small">{{ row.config === 2 ? "工作流" : "提示词" }}</el-tag>
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
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="编辑专家" width="640px" destroy-on-close>
      <el-form :model="form" label-width="96px">
        <el-form-item label="专家名称">
          <el-input v-model="form.name" maxlength="40" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" maxlength="200" />
        </el-form-item>
        <el-form-item label="头像路径">
          <el-input v-model="form.avatar" placeholder="相对路径或 URL" />
        </el-form-item>
        <el-form-item label="系统提示词">
          <el-input v-model="form.system" type="textarea" :rows="8" maxlength="8000" show-word-limit />
        </el-form-item>
        <el-form-item label="开场问题">
          <IdTagsEditor v-model="form.openingQuestions" placeholder="输入一个引导问题后按回车" />
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
import { getExpertListApi, updateExpertApi } from '@/api/agent'
import type { IExpertInfo } from '@/types/api/agent'
import IdTagsEditor from '../apps/components/idTagsEditor.vue'

export default defineComponent({
  name: 'ExpertAdmin',
  components: { IdTagsEditor },
  setup() {
    const loading = ref(false)
    const saving = ref(false)
    const experts = ref<IExpertInfo[]>([])
    const keyword = ref('')
    const sourceFilter = ref('')
    const dialogVisible = ref(false)
    const editingId = ref('')

    const form = reactive({
      name: '',
      description: '',
      avatar: '',
      system: '',
      openingQuestions: [] as string[],
    })

    const filtered = computed(() => experts.value.filter(a => {
      if (sourceFilter.value && a.source !== sourceFilter.value) return false
      if (keyword.value) {
        const kw = keyword.value.toLowerCase()
        return a.name.toLowerCase().includes(kw) || a.agentId.toLowerCase().includes(kw)
      }
      return true
    }))

    const load = async () => {
      loading.value = true
      try {
        const res = await getExpertListApi({ page: 1, pageSize: 500 })
        experts.value = res.result?.list || []
      } finally {
        loading.value = false
      }
    }

    const openEdit = (row: IExpertInfo) => {
      editingId.value = row.agentId
      form.name = row.name || ''
      form.description = row.description || ''
      form.avatar = row.avatar || ''
      const prompt = (row.config === 1 && row.configDetail?.prompt) || {}
      form.system = prompt.system || ''
      form.openingQuestions = Array.isArray(prompt.opening_questions) ? prompt.opening_questions.map(String) : []
      dialogVisible.value = true
    }

    const save = async () => {
      if (!editingId.value) return
      saving.value = true
      try {
        await updateExpertApi({
          agentId: editingId.value,
          name: form.name,
          description: form.description,
          avatar: form.avatar,
          config: 1,
          configDetail: {
            type: 1,
            prompt: {
              system: form.system,
              opening_questions: form.openingQuestions.map((q) => q.trim()).filter(Boolean),
            },
          },
        })
        dialogVisible.value = false
        await load()
      } finally {
        saving.value = false
      }
    }

    onMounted(load)
    return {
      loading, saving, experts, keyword, sourceFilter, dialogVisible, form,
      filtered, load, openEdit, save,
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
</style>
