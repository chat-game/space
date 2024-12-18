<template>
  <button class="p-3 tg-button w-full rounded-2xl font-medium cursor-pointer active:scale-95 duration-200" @click="handleClick()">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'

function handleClick() {
  if (hapticFeedback.impactOccurred.isAvailable()) {
    hapticFeedback.impactOccurred('light')
  }
}
</script>
