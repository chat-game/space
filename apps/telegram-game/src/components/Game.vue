<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 font-serif overflow-hidden select-none bg-orange-200" :class="{ hidden: !isOpened }">
    <div ref="canvas" class="w-full h-full" />

    <div class="tg-content-safe-area-top font-serif touch-pan-x absolute top-0 left-0 right-0 w-full h-16">
      <div class="max-w-[28rem] mx-auto px-5">
        <div>Энергия: 41</div>

        <div class="opacity-15">
          {{ gameClient.websocketService.socket.status.value }} {{ roomConnected }} {{ gameClient.websocketService.socket.data }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gameClient, roomConnected } from '../utils/gameClient'

const router = useRouter()
const canvas = ref<HTMLElement>()
const isOpened = ref(false)

onMounted(async () => {
  await gameClient.init()
  canvas.value?.appendChild(gameClient.app.canvas)

  return () => gameClient.destroy()
})

watch(router.currentRoute, (value) => {
  isOpened.value = value.path === '/'
})
</script>
