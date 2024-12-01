<template>
  <PageContainer :back="false" />
</template>

<script setup lang="ts">
import { exitFullscreen, isFullScreen } from '@telegram-apps/sdk-vue'
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()

watch(width, () => {
  if (width.value > 600 && isFullScreen()) {
    exitFullscreen()
  }
})
</script>
