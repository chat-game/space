<template>
  <div class="bg z-50 font-serif touch-pan-x fixed bottom-0 left-0 right-0 w-full h-[100px]">
    <div class="max-w-[28rem] mx-auto px-5">
      <div class="mt-3 grid grid-cols-3 gap-1">
        <button v-for="item in menu" :key="item.label" class="flex flex-col items-center justify-center gap-1 px-4" :class="{ 'button-active': router.currentRoute.value.path === item.path }" @click="handleClick(item.path)">
          <div class="icon-block py-1 w-full rounded-2xl flex flex-row items-center justify-center">
            <Component :is="item.icon" class="w-6 h-6" />
          </div>
          <p class="text text-xs">
            {{ item.label }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import LucideArchiveRestore from '~icons/lucide/archive-restore'
import LucideGamepad2 from '~icons/lucide/gamepad-2'
import LucideShoppingBag from '~icons/lucide/shopping-bag'

const router = useRouter()

const menu = [
  {
    label: 'Игра',
    icon: LucideGamepad2,
    path: '/',
  },
  {
    label: 'Инвентарь',
    icon: LucideArchiveRestore,
    path: '/inventory',
  },
  {
    label: 'Магазин',
    icon: LucideShoppingBag,
    path: '/shop',
  },
]

function handleClick(path: string) {
  if (hapticFeedback.impactOccurred.isAvailable()) {
    hapticFeedback.impactOccurred('light')
  }

  router.push(path)
}
</script>

<style scoped>
.bg {
  background-color: var(--tg-theme-bottom-bar-bg-color);
  border-top: 1px solid var(--tg-theme-section-separator-color);
}
button {
  color: var(--tg-theme-subtitle-text-color);
}
.button-active {
  .icon-block {
    background-color: var(--tg-theme-button-color);
    color: var(--tg-theme-button-text-color);
  }

  .text {
    color: var(--tg-theme-button-color);
  }
}
</style>
