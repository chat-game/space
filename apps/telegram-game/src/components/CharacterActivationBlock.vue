<template>
  <div v-if="isActive" class="px-8 tg-hint text-center font-medium leading-tight">
    Это твой активный персонаж
  </div>
  <Button v-else class="mt-3" @click="activateCharacter()">
    Активировать
  </Button>
</template>

<script setup lang="ts">
import { useFetch } from '@vueuse/core'

const { characterId } = defineProps<{
  characterId: string
}>()

const { characters, refreshCharacters } = useCharacters()
const { profile, refreshProfile } = useTelegramProfile()

const character = computed(() => characters.value?.find(({ id }) => id === characterId))
const isActive = computed(() => profile.value.profile?.activeEditionId === character.value?.editions?.find(({ profileId }) => profileId === profile.value?.profile.id)?.id)

async function activateCharacter() {
  await useFetch(`https://chatgame.space/api/telegram/profile/${profile.value.id}/character/${characterId}/activate`).get().json<{ ok: boolean }>()
  await refreshProfile()
  await refreshCharacters()
}
</script>
