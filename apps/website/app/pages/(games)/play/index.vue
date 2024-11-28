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

        <MainButton @click="showAlert('Hello!')" />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BaseGameAddon } from '@chat-game/game'
import { MainButton, useWebAppPopup } from 'vue-tg'

definePageMeta({
  layout: 'game',
})

const { showAlert } = useWebAppPopup()

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
    height: 100vh;
    overflow: hidden;
    -webkit-user-select: none; /* Safari */
    -ms-user-select: none; /* IE 10 and IE 11 */
    user-select: none; /* Standard syntax */
    background-color: #ffedd5;
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
    padding-top: 60px;
  }

  .game-bottom-interface {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 200px;
    background-color: #fed7aa;
    color: #ffedd5;
  }
</style>
