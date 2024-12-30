<template>
  <div v-if="isActive" class="px-8 tg-accent-text text-center font-medium leading-tight">
    Это твой активный персонаж
  </div>
  <Button v-else @click="activateCharacter()">
    Активировать
  </Button>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'

const { characterId } = defineProps<{
  characterId: string
}>()

const { characters, refreshCharacters } = useCharacters()
const { profile, refreshProfile, useApiFetch } = useTelegramProfile()

const character = computed(() => characters.value?.find(({ id }) => id === characterId))
const isActive = computed(() => profile.value?.profile?.activeEditionId === character.value?.editions?.find(({ profileId }) => profileId === profile.value?.profile.id)?.id)

async function activateCharacter() {
  await useApiFetch(`/character/${characterId}/activate`).get().json()
  await refreshProfile()
  await refreshCharacters()

  if (hapticFeedback.impactOccurred.isAvailable()) {
    hapticFeedback.notificationOccurred('success')
  }
}
</script>
