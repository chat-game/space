<template>
  <div v-if="isActive" class="px-8 tg-accent-text text-center font-medium leading-tight">
    {{ t('character.activeLabel') }}
  </div>
  <Button v-else @click="activateCharacter()">
    {{ t('activate') }}
  </Button>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useI18n } from 'vue-i18n'
import { gameClient } from '../utils/gameClient'

const { characterId } = defineProps<{
  characterId: string
}>()

const { t } = useI18n()
const { refreshCharacter } = useCharacter()
const { characters, refreshCharacters } = useCharacters()
const { profile, refreshProfile, useApiFetch } = useTelegramProfile()

const character = computed(() => characters.value?.find(({ id }) => id === characterId))
const isActive = computed(() => profile.value?.profile?.activeEditionId === character.value?.editions?.find(({ profileId }) => profileId === profile.value?.profile.id)?.id)

async function activateCharacter() {
  const { data } = await useApiFetch(`/character/${characterId}/activate`).get().json<{ ok: true }>()

  if (data.value?.ok) {
    await refreshProfile()
    await refreshCharacters()
    await refreshCharacter()

    gameClient.websocketService.connect('12345')

    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }
  }
}
</script>
