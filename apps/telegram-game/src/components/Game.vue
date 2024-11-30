<template>
  <div class="game-block font-serif">
    <div id="game-canvas" ref="stage" />
  </div>
</template>

<script setup lang="ts">
import { BaseGameAddon } from '@chat-game/game'

const stage = ref<HTMLElement>()

onMounted(async () => {
  const addon = new BaseGameAddon({ websocketUrl: getEnv('VITE_WEBSOCKET_URL') })
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
    background-color: #ffedd5;
    padding-top: var(--tg-content-safe-area-inset-top);
  }

  #game-canvas {
    width: 100%;
    height: 100%;
    bottom: 0;
    position: absolute;
    overflow: hidden;
  }
</style>
