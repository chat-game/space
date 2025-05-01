<template>
  <ActiveCard class="aspect-square">
    <div v-if="!edition" class="z-10 absolute top-0 left-0 right-0 bottom-0 tg-secondary-bg opacity-40" />

    <div v-if="character?.id === edition?.id" class="tg-accent-text text-base font-medium leading-tight">
      {{ t('character.active') }}
    </div>
    <p class="font-medium text-lg leading-tight">
      {{ t(`characters.${char.id}.nickname`) }}
    </p>
    <p v-if="edition" class="text-sm tg-hint">
      {{ edition.level }} {{ t('character.level') }}
    </p>

    <div v-if="!edition && char.price" class="flex flex-row gap-1 items-center">
      <Image src="coin-small.png" class="w-5 h-5 grayscale-100" />
      <p>{{ char.price }}</p>
    </div>

    <Image
      :src="`units/${char.codename}/128.png`"
      class="absolute bottom-0 right-0 w-32 h-auto"
      :class="{ 'grayscale-100 opacity-70': !edition }"
    />
  </ActiveCard>
</template>

<script setup lang="ts">
import type { Character } from '@chat-game/types'
import { useI18n } from 'vue-i18n'

const { char } = defineProps<{ char: Character }>()

const { t } = useI18n()
const { profileCharacters } = useCharacters()
const { character } = useCharacter()

const edition = computed(() => profileCharacters.value?.find(({ characterId }) => characterId === char.id))
</script>
