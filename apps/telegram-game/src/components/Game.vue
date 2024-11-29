<template>
  <div class="game-block font-serif">
    <div id="game-canvas" ref="stage" />

    <div class="touch-pan-x absolute top-0 left-0 right-0 w-full h-16 py-2">
      <div class="max-w-[28rem] mx-auto px-5">
        <div>Монеты: 53</div>
        <div>Энергия: 41</div>
      </div>
    </div>
    <div class="touch-pan-x absolute bottom-0 left-0 right-0 w-full h-20 bg-amber-950">
      <div class="max-w-[28rem] mx-auto px-5">
        <div class="mt-4 grid grid-cols-3 gap-1">
          <button v-for="item in menu" :key="item.label" class="flex flex-col items-center justify-center gap-0 px-4 py-1 rounded-md text-sm bg-amber-800 text-amber-500" @click="() => { hapticFeedback.impactOccurred('light'); }">
            <Component :is="item.icon" class="w-6 h-6" />
            {{ item.label }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BaseGameAddon } from '@chat-game/game'
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import LucideArchiveRestore from '~icons/lucide/archive-restore'
import LucideGamepad2 from '~icons/lucide/gamepad-2'
import LucideRadioTower from '~icons/lucide/radio-tower'

const route = useRoute()
const token = route.query.token?.toString() ?? ''
const stage = ref<HTMLElement>()

onMounted(async () => {
  const addon = new BaseGameAddon({ token, websocketUrl: getEnv('VITE_WEBSOCKET_URL') })
  await addon.init()
  stage.value?.appendChild(addon.app.canvas)

  return () => addon.destroy()
})

const menu = [
  {
    label: 'Игра',
    icon: LucideGamepad2,
    path: '/play',
  },
  {
    label: 'Инвентарь',
    icon: LucideArchiveRestore,
    path: '/inventory',
  },
  {
    label: 'Стрим',
    icon: LucideRadioTower,
    path: '/stream',
  },
]
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
