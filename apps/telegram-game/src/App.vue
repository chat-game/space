<template>
  <main>
    <Game />
    <RouterView />
  </main>
  <Navigation />
</template>

<script setup lang="ts">
import { exitFullscreen, isFullScreen } from '@telegram-apps/sdk-vue'
import { useWindowSize } from '@vueuse/core'

useBackButton()

// Application is in fullscreen mode only on small screens!
const { width } = useWindowSize()

watch(width, () => {
  if (width.value > 600 && isFullScreen()) {
    exitFullscreen()
  }
})
</script>
