<!--
  Copyright (c) 2024-2026 Beaver IM Team
  SPDX-License-Identifier: MIT
  Project: beaver-manager
  https://github.com/wsrh8888/beaver-manager

  中文：
  本文件为海狸 IM（Beaver IM）开源项目源代码。
  版权所有 © 2024-2026 Beaver IM Team，基于 MIT 协议授权。
  禁止删除、篡改或替换本文件头部版权与许可声明。
  使用与商业授权说明：https://wsrh8888.github.io/beaver-docs/community/license.html

  English:
  This file is part of the Beaver IM open-source project.
  Copyright (c) 2024-2026 Beaver IM Team. Licensed under the MIT License.
  Do not remove, alter, or replace this copyright and license header.
  Usage & commercial licensing: https://wsrh8888.github.io/beaver-docs/community/license.html

  beaver-manager-header-v1

  知识源文档类型图标：word / excel / faq，使用静态 SVG 资源。
  对齐 cloud-console 的 LibraryTypeIcon 视觉语义。
-->

<template>
  <img
    class="lib-type-icon"
    :src="iconSrc"
    :style="{ width: `${size}px`, height: `${size}px` }"
    role="img"
    :aria-label="`${type} 文档`"
  />
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from "vue"
import type { PropType } from "vue"
import wordIcon from "@/assets/images/knowledgeSource/word.svg"
import excelIcon from "@/assets/images/knowledgeSource/excel.svg"
import faqIcon from "@/assets/images/knowledgeSource/faq.svg"

type IconType = "word" | "excel" | "faq"

export default defineComponent({
  name: "LibraryTypeIcon",
  props: {
    type: { type: String as PropType<IconType>, default: "word" },
    size: { type: Number, default: 22 }
  },
  setup(props) {
    const iconSrc = computed(() => {
      if (props.type === "excel") return excelIcon
      if (props.type === "faq") return faqIcon
      return wordIcon
    })
    return { ...toRefs(props), iconSrc }
  }
})
</script>

<style scoped lang="less">
.lib-type-icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
</style>
