<template>
  <div class="game-block absolute top-0 left-0 right-0 bottom-0 font-serif" :class="{ hidden: !isOpened }">
    <div id="game-canvas" ref="stage" />

    <div class="font-serif touch-pan-x absolute top-0 left-0 right-0 w-full h-16 pt-25">
      <div class="max-w-[28rem] mx-auto px-5">
        <div>Монеты: 53</div>
        <div>Энергия: 41</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseGameAddon } from '@chat-game/game'

const router = useRouter()
const stage = ref<HTMLElement>()
const isOpened = ref(false)

onMounted(async () => {
  const addon = new BaseGameAddon({ websocketUrl: getEnv('VITE_WEBSOCKET_URL') })
  await addon.init()
  stage.value?.appendChild(addon.app.canvas)

  return () => addon.destroy()
})

watch(router.currentRoute, (value) => {
  isOpened.value = value.path === '/'
})
</script>

<style scoped>
.game-block {
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
}
</style>
