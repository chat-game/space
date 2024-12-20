<template>
  <Button v-if="character?.price" class="min-h-14">
    <div v-if="isClickedFirstTime" @click="unlockCharacter()">
      <p>Нажми еще раз чтобы подтвердить</p>
    </div>
    <div v-else class="flex flex-row gap-2 items-center justify-center" @click="setWaitingApproval()">
      <p>Разблокировать за</p>
      <div class="flex flex-row gap-2 items-center text-lg">
        <p>{{ character?.price }}</p>
        <img src="/coin-small.png" alt="" class="w-6 h-6">
      </div>
    </div>
  </Button>
  <div v-else class="px-8 tg-hint text-center font-medium leading-tight">
    Персонажа нельзя разблокировать за Монеты
  </div>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

const { characterId } = defineProps<{
  characterId: string
}>()

const { characters, refreshCharacters } = useCharacters()
const { profile, refreshProfile } = useTelegramProfile()
const { pop: popConfetti } = useConfetti()

const character = computed(() => characters.value?.find(({ id }) => id === characterId))

async function unlockCharacter() {
  const { data } = await useFetch(`https://chatgame.space/api/telegram/profile/${profile.value?.id}/character/${characterId}/unlock`).get().json<{ ok: boolean }>()
  await refreshProfile()
  await refreshCharacters()

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
