<template>
  <div class="absolute top-0 left-0 right-0 bottom-0 overflow-hidden select-none bg-orange-200" :class="{ hidden: !isGameOpened }">
    <div ref="canvas" class="absolute w-full h-full bottom-10" />
    <div class="absolute w-full h-35 bottom-0 bg-red-950" />

    <div class="touch-pan-x mt-2 w-full h-16 tg-safe-area">
      <div class="max-w-[28rem] mx-auto px-4 space-y-2 tg-content-safe-area">
        <GameNavigator :player-x="game.player?.x" :wagon-x="game.wagon?.x" />
        <GameCharacterProgression />

        <div v-if="profile && profile.energy >= 0" class="hidden w-fit h-10 px-5 py-0 flex-row items-center gap-2 bg-orange-100/80 text-amber-600 rounded-full">
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

  <Modal title="Приветствуем в игре!" :is-opened="isHelpModalOpened" @close="isHelpModalOpened = false">
    <p class="leading-tight">
      Тапай куда угодно, чтобы передвигаться. Тапай деревья, чтобы их срубить.
    </p>
    <p class="tg-hint leading-tight">
      Что дальше: прокачивай персонажа, получай награды за уровни. Открывай новых персонажей.
    </p>
  </Modal>

  <GameLoader />
</template>

<script setup lang="ts">
import type { BaseGameAddon } from '@chat-game/game'
import { hapticFeedback, initData } from '@telegram-apps/sdk-vue'
import { gameClient, isLoading, roomConnected, setAsLoaded } from '../utils/gameClient'

const { refreshCharacter } = useCharacter()
const { profile } = useTelegramProfile()

const data = initData.user()
const router = useRouter()
const canvas = ref<HTMLElement>()
const game = ref<BaseGameAddon>(gameClient)
const isGameOpened = ref(false)

const isHelpModalOpened = ref(true)

onMounted(async () => {
  if (!data?.id) {
    return
  }

  isLoading.value = true

  await game.value.init(data.id.toString())
  canvas.value?.appendChild(game.value.app.canvas)

  setAsLoaded()

  game.value.openLoader = () => {
    isLoading.value = true
  }

  game.value.updateUI = async () => {
    await refreshCharacter()
    setAsLoaded()
  }

  game.value.vibrate = () => {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light')
    }
  }

  return () => game.value.destroy()
})

watch(router.currentRoute, (value) => {
  isGameOpened.value = value.path === '/'
})

watch(
  () => game.value.player,
  () => {
    if (!roomConnected.value) {
      const roomId = '12345'
      game.value.websocketService.connect(roomId)
      roomConnected.value = roomId
    }
  },
)
</script>
