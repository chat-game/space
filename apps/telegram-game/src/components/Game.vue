<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden select-none bg-orange-200" :class="{ hidden: !isGameOpened }">
    <div ref="canvas" class="absolute w-full h-full bottom-10" />
    <div class="absolute w-full h-35 bottom-0 bg-red-950" />

    <div class="touch-pan-x absolute top-0 left-0 right-0 w-full h-16">
      <div class="max-w-[28rem] mx-auto px-4 space-y-2">
        <GameNavigator :player-x="game.player?.x" :wagon-x="game.wagon?.x" />
        <GameCharacterProgression />

        <div v-if="profile && profile.energy >= 0" class="hidden w-fit h-10 px-5 py-0 flex-row items-center gap-2 bg-orange-100/80 text-amber-600 rounded-full">
          <Image src="energy.png" class="w-auto h-8" />
          <p class="text-xl font-semibold leading-none tracking-tight">
            {{ profile?.energy }}
          </p>
        </div>

        <div class="hidden">
          {{ game.websocketService.socket.status }} {{ roomConnected }}
        </div>
      </div>
    </div>
  </div>

  <GameLoader />
</template>

<script setup lang="ts">
import type { BaseGameAddon } from '@chat-game/game'
import { initData } from '@telegram-apps/sdk-vue'
import { gameClient, isLoading, roomConnected, setAsLoaded } from '../utils/gameClient'

const { refreshCharacter } = useCharacter()
const { hmbanan666 } = useRoom()
const { profile } = useTelegramProfile()

const data = initData.user()
const router = useRouter()
const canvas = ref<HTMLElement>()
const game = ref<BaseGameAddon>(gameClient)
const isGameOpened = ref(false)

onMounted(async () => {
  if (!data?.id) {
    return
  }

  isLoading.value = true

  await game.value.init(data.id.toString())
  canvas.value?.appendChild(game.value.app.canvas)

  setAsLoaded()

  game.value.updateUI = async () => {
    await refreshCharacter()
    setAsLoaded()
  }

  return () => game.value.destroy()
})

watch(router.currentRoute, (value) => {
  isGameOpened.value = value.path === '/'
})

watch(
  () => hmbanan666.value && game.value.player,
  () => {
    if (!roomConnected.value) {
      game.value.websocketService.connect('12345')
      roomConnected.value = '12345'
    }
  },
)
</script>
