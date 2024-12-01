<template>
  <nav class="bg z-50 font-serif touch-pan-x fixed bottom-0 left-0 right-0 w-full h-[100px]">
    <div class="max-w-[28rem] mx-auto">
      <div class="mt-3 grid grid-cols-5">
        <button v-for="route in routes" :key="route.path" class="flex flex-col items-center justify-center gap-1 px-4 cursor-pointer" :class="{ 'button-active': router.currentRoute.value.path === route.path }" @click="handleClick(route.path)">
          <div class="icon-block py-1 w-full rounded-2xl flex flex-row items-center justify-center">
            <Component :is="route.icon" class="w-6 h-6" />
          </div>
          <p class="text text-xs">
            {{ route.meta.title }}
          </p>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { routes } from '../router'

const router = useRouter()

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
