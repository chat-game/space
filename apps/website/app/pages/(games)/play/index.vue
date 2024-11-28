<template>
  <ClientOnly>
    <div class="game-block">
      <div class="game-top-interface">
        <div>Монеты: 53</div>
        <div>Энергия: 41</div>
      </div>
      <div id="game-canvas" ref="stage" />
      <div class="game-bottom-interface">
        Интерфейс
      </div>
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
const token = route.query.token?.toString() ?? ''
const stage = ref<HTMLElement>()

onMounted(async () => {
  const addon = new BaseGameAddon({ token, websocketUrl: publicEnv.websocketUrl })
  await addon.init()
  stage.value?.appendChild(addon.app.canvas)

  return () => addon.destroy()
})
</script>

<style scoped>
  .game-block {
    width: 100vw;
    height: 100dvh;
    overflow: hidden;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
  }

  #game-canvas {
    width: 100%;
    height: 100%;
    bottom: 0;
    position: absolute;
    overflow: hidden;
  }

  .game-top-interface {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 64px;
    background-color: transparent;
  }

  .game-bottom-interface {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 200px;
    background-color: #fff7ed;
    color: #ffedd5;
  }
</style>
