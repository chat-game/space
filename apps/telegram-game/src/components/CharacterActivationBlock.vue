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
const { character, refreshCharacter } = useCharacter()
const { refreshProfile, useApiFetch } = useTelegramProfile()

const isActive = computed(() => character.value?.characterId === characterId)

async function activateCharacter() {
  const { data } = await useApiFetch(`/character/${characterId}/activate`).get().json<{ ok: true }>()

  if (data.value?.ok) {
    await refreshProfile()
    await refreshCharacter()

    gameClient.websocketService.connect('12345')

    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }
  }
}
</script>
