<template>
  <div class="flex flex-row gap-2">
    <div class="z-10 relative w-14 h-14 flex flex-col justify-center items-center bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl">
      <Image :src="headImage" class="p-2 h-16 w-16" />
      <div class="absolute -bottom-1 -right-3 px-1 w-fit min-w-6 bg-orange-50 text-orange-600 text-base font-semibold text-center rounded-full">
        {{ character?.level ?? 1 }}
      </div>
    </div>

    <div class="relative h-7 grow bg-blue-900 rounded-2xl">
      <div class="h-full w-[4%] bg-gradient-to-br from-blue-300 to-blue-600 rounded-2xl" :style="{ width: `${width > 10 ? width : 10}%` }" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row justify-center items-center">
        <p class="font-semibold text-lg text-white tracking-tight">
          {{ character?.xp ?? 0 }} <span class="text-xs">XP</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()

const headImage = computed(() => character.value?.character.codename ? `units/${character.value?.character.codename}/head.png` : 'units/santa/head.png')
const width = computed(() => character.value?.xp && character.value.nextLevel ? (character.value.xp / character.value.nextLevel.requiredXp) * 100 : 100)
</script>
