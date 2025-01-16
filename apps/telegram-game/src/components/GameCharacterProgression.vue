<template>
  <div class="flex flex-row gap-2">
    <CharacterAvatar :codename="character?.character.codename" :level="character?.level" />

    <div class="relative h-8 grow bg-blue-900 rounded-2xl overflow-hidden">
      <div class="h-full bg-gradient-to-br from-blue-300 to-blue-600 rounded-r-xl duration-1000" :style="{ width: `${progressWidth}%` }" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row justify-center items-center">
        <p v-if="character?.nextLevel" class="font-semibold text-lg text-white tracking-tight">
          {{ character?.xp ?? 0 }} <span class="text-xs">XP</span>
        </p>
        <p v-else class="font-semibold text-lg text-white tracking-tight">
          MAX
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { character } = useCharacter()

const progressWidth = computed(() => character.value?.xp && character.value.nextLevel && character.value.currentLevel ? ((character.value.xp - character.value.currentLevel.requiredXp) / (character.value.nextLevel.requiredXp - character.value.currentLevel.requiredXp)) * 100 : 100)
</script>
