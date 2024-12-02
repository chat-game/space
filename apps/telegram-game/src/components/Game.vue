<template>
  <div class="game-block absolute top-0 left-0 right-0 bottom-0 font-serif" :class="{ hidden: !isOpened }">
    <div id="game-canvas" ref="stage" />

    <div class="font-serif touch-pan-x absolute top-0 left-0 right-0 w-full h-16 pt-25">
      <div class="max-w-[28rem] mx-auto px-5">
        <div>Монеты: 53</div>
        <div>Энергия: 41</div>

        <div v-if="connectedToRoom">
          Room {{ connectedToRoom }}
        </div>
        <button v-else class="z-50 p-4 bg-amber-800 text-white" @click="() => { connectFunc('12345'); connectedToRoom = '12345' }">
          Подключиться
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseGameAddon } from '@chat-game/game'

const router = useRouter()
const stage = ref<HTMLElement>()
const isOpened = ref(false)
const connectFunc = ref<(roomId: string) => void>(() => {})
const connectedToRoom = ref<string | null>(null)

const addon = new BaseGameAddon({ websocketUrl: getEnv('VITE_WEBSOCKET_URL'), client: 'TELEGRAM_CLIENT' })

onMounted(async () => {
  await addon.init()
  connectFunc.value = addon.websocketService.connect.bind(addon.websocketService)
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
