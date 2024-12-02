<template>
  <ClientOnly>
    <div class="game-block">
      <div id="game-canvas" ref="stage" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BaseGameAddon } from '@chat-game/game'

definePageMeta({
  layout: 'game',
})

const { public: publicEnv } = useRuntimeConfig()
const route = useRoute()
const id = route.query.id?.toString() ?? ''
const stage = ref<HTMLElement>()

onMounted(async () => {
  const game = new BaseGameAddon({ websocketUrl: publicEnv.websocketUrl, client: 'WAGON_CLIENT' })
  await game.init()
  game.websocketService.connect(id)
  stage.value?.appendChild(game.app.canvas)

  return () => game.destroy()
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
    height: 250px;
    bottom: -100px;
    position: absolute;
    overflow: hidden;
  }
</style>
