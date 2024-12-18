<template>
  <div class="relative mb-2 h-10 bg-red-950/15 text-white rounded-full">
    <div v-if="wagonOnNavigator > 3 && wagonOnNavigator < 97" class="absolute transform -translate-x-1/2" :style="{ left: `${wagonOnNavigator}%` }">
      <div class="p-1 bg-purple-300 rounded-xl">
        <img src="/wheel-1.png" alt="" class="w-8 h-8">
      </div>
    </div>

    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <div class="mt-6 mx-auto w-2 h-12 bg-red-900 rounded-lg" />
      <div class="min-w-12 h-6 flex flex-col justify-center items-center gap-0 text-red-950">
        <p class="text-sm font-medium">
          {{ Math.floor(playerX ? playerX / 50 : 0) }} м
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { playerX, wagonX } = defineProps<{
  playerX?: number
  wagonX?: number
}>()

const wagonOnNavigator = computed(() => playerX && wagonX ? (wagonX - playerX) / 50 + 50 : 0)

// player can see objects between player X - 2500 and player X + 2500
// calculate wagon position on navigator relative to player X (in the middle)
</script>
