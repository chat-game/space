<template>
  <div class="relative h-full tg-section-bg p-4 rounded-2xl cursor-pointer active:scale-90 duration-200" @click="handleClick()">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'

function handleClick() {
  if (hapticFeedback.impactOccurred.isAvailable()) {
    hapticFeedback.impactOccurred('light')
  }
}
</script>
