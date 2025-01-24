<template>
  <div v-if="!isUnlocked">
    <Button v-if="character?.price" class="min-h-14">
      <div v-if="isClickedFirstTime" @click="unlockCharacter()">
        <p>{{ t('character.unlock.pressToConfirm') }}</p>
      </div>
      <div v-else class="flex flex-row gap-1 items-center justify-center" @click="setWaitingApproval()">
        <p>{{ t('character.unlock.for') }}</p>
        <div class="flex flex-row gap-1.5 items-center text-lg">
          <p>{{ character?.price }}</p>
          <Image src="coin-small.png" class="w-5 h-5" />
        </div>
      </div>
    </Button>
    <div v-else class="px-8 tg-hint text-center font-medium leading-tight">
      {{ t('character.unlock.notForCoins') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useI18n } from 'vue-i18n'

const { characterId } = defineProps<{
  characterId: string
}>()

const { t } = useI18n()
const { characters, refreshProfileCharacters, profileCharacters } = useCharacters()
const { refreshProfile, useApiFetch } = useTelegramProfile()
const { pop: popConfetti } = useConfetti()

const character = computed(() => characters.value?.find(({ id }) => id === characterId))
const isUnlocked = computed(() => profileCharacters.value?.some((c) => c.characterId === character.value?.id))

async function unlockCharacter() {
  const { data } = await useApiFetch(`/character/${characterId}/unlock`).get().json<{ ok: boolean }>()
  await refreshProfile()
  await refreshProfileCharacters()

  if (data.value?.ok) {
    popConfetti()

    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }
  }
}

const isClickedFirstTime = ref(false)

watch(() => characterId, () => {
  isClickedFirstTime.value = false
})

function setWaitingApproval() {
  isClickedFirstTime.value = true
}
</script>
