<template>
  <ClientOnly>
    <div class="game-block">
      <div id="game-canvas" ref="stage" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BaseGameAddon } from '@chat-game/addon'

definePageMeta({
  layout: 'game',
})

const { public: publicEnv } = useRuntimeConfig()
const route = useRoute()
const token = route.query.token?.toString() ?? ''
const stage = ref<HTMLElement>()

onMounted(async () => {
  const addon = new BaseGameAddon({ token, websocketUrl: publicEnv.websocketUrl, cdnUrl: '/cdn' })
  await addon.init()
  stage.value?.appendChild(addon.app.canvas)

  return () => addon.destroy()
})
</script>

<style scoped>
  .game-block {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }

  #game-canvas {
    width: 100%;
    height: 200px;
    bottom: 0;
    position: absolute;
    overflow: hidden;
  }
</style>
