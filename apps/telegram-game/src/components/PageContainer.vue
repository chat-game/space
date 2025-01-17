<template>
  <div class="tg-secondary-bg tg-text tg-safe-area overflow-hidden z-30 h-full min-h-dvh w-full">
    <div class="tg-content-safe-area">
      <div class="px-4 py-2 max-w-[28rem] mx-auto flex flex-col gap-y-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hideBackButton } from '@telegram-apps/sdk-vue'

const { back = true } = defineProps<{ back?: boolean }>()

onMounted(() => {
  if (!back) {
    hideBackButton()
  }
})
</script>
