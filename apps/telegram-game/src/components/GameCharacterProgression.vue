<template>
  <div class="flex flex-row gap-2">
    <ActiveCard class="!p-0" @click="isCharacterProgressionOpened = true">
      <CharacterAvatar :codename="character?.character.codename" :level="character?.level" />
    </ActiveCard>

    <div class="relative h-8 grow bg-blue-900 rounded-2xl overflow-hidden">
      <div class="h-full bg-gradient-to-br from-blue-300 to-blue-600 rounded-r-2xl duration-1000" :style="{ width: `${progressWidth}%` }" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row justify-center items-center">
        <p v-if="character?.nextLevel" class="font-semibold text-lg text-white tracking-tight">
          {{ character?.xp ?? 0 }} <span class="text-xs">XP</span>
        </p>
        <p v-else class="font-semibold text-lg text-white tracking-tight">
          {{ t('character.maxLevel') }}
        </p>
      </div>
    </div>
  </div>

  <CharacterProgressionModal
    v-if="character?.levels"
    :levels="character.levels"
    :current-level="character.level"
    :is-opened="isCharacterProgressionOpened"
    @close="isCharacterProgressionOpened = false"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { character } = useCharacter()
const { pop: popConfetti } = useConfetti()

const progressWidth = computed(() => character.value?.xp && character.value.nextLevel && character.value.currentLevel ? ((character.value.xp - character.value.currentLevel.requiredXp) / (character.value.nextLevel.requiredXp - character.value.currentLevel.requiredXp)) * 100 : 100)

const isCharacterProgressionOpened = ref(false)

const currentCharacterId = ref<string | null>(null)
const currentLevel = ref<number>(character.value?.level ?? 0)

watch(() => character.value?.level, () => {
  if (!character.value?.level) {
    return
  }

  if (!currentCharacterId.value) {
    currentCharacterId.value = character.value.id
  }

  // New or changed character
  if (currentLevel.value === 0 || currentCharacterId.value !== character.value.id) {
    currentCharacterId.value = character.value.id
    currentLevel.value = character.value.level
    return
  }

  if (currentLevel.value !== character.value?.level) {
    // Level up!
    popConfetti()
    currentLevel.value = character.value.level
  }
})
</script>
