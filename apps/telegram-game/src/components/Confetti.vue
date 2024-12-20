<template>
  <div v-if="isShown" class="z-50 mx-auto h-dvh w-full fixed top-0 left-0 right-0 bottom-0 overflow-y-hidden overscroll-y-none">
    <div v-confetti="{ particleCount: 240, duration: 4500, stageHeight: 1200, stageWidth: 900, force: 0.4 }" />
  </div>
</template>

<script setup lang="ts">
import { vConfetti } from '@neoconfetti/vue'

const { isShown } = useConfetti()
</script>
