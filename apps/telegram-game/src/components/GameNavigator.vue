<template>
  <div class="relative h-8 bg-red-950/15 text-white rounded-full">
    <div v-if="wagonOnNavigator > 3 && wagonOnNavigator < 97" class="absolute transform -translate-x-1/2" :style="{ left: `${wagonOnNavigator}%` }">
      <div class="p-1 bg-purple-200 rounded-xl">
        <Image src="wheel-1.png" class="w-6 h-6" />
      </div>
    </div>

    <div class="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
</script>
