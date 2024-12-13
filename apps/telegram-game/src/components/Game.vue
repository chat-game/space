<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 font-serif overflow-hidden select-none bg-orange-200" :class="{ hidden: !isOpened }">
    <div ref="canvas" class="absolute w-full h-full bottom-10" />
    <div class="absolute w-full h-35 bottom-0 bg-amber-950" />

    <div class="tg-content-safe-area-top font-serif touch-pan-x absolute top-0 left-0 right-0 w-full h-16">
      <div class="max-w-[28rem] mx-auto px-5">
        <div>Энергия: ??</div>

        <div class="opacity-15">
          {{ game.websocketService.socket.status }} {{ roomConnected }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseGameAddon } from '@chat-game/game'
import { initData } from '@telegram-apps/sdk-vue'
import { gameClient, roomConnected } from '../utils/gameClient'

const data = initData.user()
const router = useRouter()
const canvas = ref<HTMLElement>()
const game = ref<BaseGameAddon>(gameClient)
const isOpened = ref(false)

onMounted(async () => {
  if (!data?.id) {
    return
  }

  await game.value.init(data.id.toString())
  canvas.value?.appendChild(game.value.app.canvas)

  return () => game.value.destroy()
})

watch(router.currentRoute, (value) => {
  isOpened.value = value.path === '/'
})
</script>
