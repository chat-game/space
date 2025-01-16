<template>
  <div class="relative w-16 h-16 flex flex-col justify-center items-center bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl">
    <Image :src="codename ? `units/${codename}/head.png` : 'units/telegramo/head.png'" class="p-0.5 h-16 w-16" />
    <div v-if="level" class="absolute -bottom-2 -right-3 px-1 w-fit min-w-6 bg-orange-50 text-orange-600 text-base font-semibold text-center rounded-full">
      {{ level }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ codename?: string | null, level?: number }>()
</script>
