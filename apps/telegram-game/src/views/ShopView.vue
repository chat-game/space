<template>
  <PageContainer>
    <div class="tg-section-bg mb-4 px-3 py-3 flex flex-row gap-2 items-center rounded-2xl">
      <img src="/coin.png" alt="" class="w-14 h-14">
      <div>
        <div class="text-2xl font-medium">
          {{ profile?.profile?.coins }}
        </div>
        <div class="tg-hint text-sm">
          Монеты
        </div>
      </div>
    </div>

    <SectionHeader text="Коллекция персонажей 2024" />

    <div class="grid grid-cols-2 gap-2">
      <ActiveCard v-for="char in characters" :key="char.id" @click="selectCharacter(char.id)">
        <div v-if="!char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" class="z-10 absolute top-0 left-0 right-0 bottom-0 tg-secondary-bg opacity-40" />

        <div v-if="profile?.profile?.activeEditionId === char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)?.id" class="tg-accent-text text-base font-medium leading-tight">
          Активный
        </div>
        <p class="font-medium text-lg">
          {{ char?.nickname }}
        </p>
        <p v-if="char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" class="text-sm tg-hint">
          {{ char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)?.level }} уровень
        </p>

        <div v-if="char?.price && !char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" class="flex flex-row gap-1 items-center">
          <img src="/coin-small.png" alt="" class="w-5 h-5 grayscale-100">
          <p>{{ char?.price }}</p>
        </div>

        <img :src="`/units/${char?.codename}/128.png`" alt="" class="absolute bottom-0 right-0 w-32 h-auto" :class="{ 'grayscale-100 opacity-70': !char?.editions?.find(({ profileId }) => profileId === profile?.profile.id) }">
      </ActiveCard>
    </div>
  </PageContainer>

  <Modal :title="`&laquo;${selectedCharacter?.nickname}&raquo; ${selectedCharacter?.name}`" :is-opened="isCharacterOpened" @close="isCharacterOpened = false">
    <img :src="`/units/${selectedCharacter?.codename}/idle.gif`" alt="" class="absolute -top-30 left-0 w-34 h-34">

    <p class="text-sm tg-hint leading-tight">
      {{ selectedCharacter?.description }}
    </p>

    <CharacterActivationBlock v-if="selectedCharacter?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" :character-id="selectedCharacterId ?? ''" />
    <CharacterUnlockBlock v-else :character-id="selectedCharacterId ?? ''" />
  </Modal>
</template>

<script setup lang="ts">
import CharacterActivationBlock from '@/components/CharacterActivationBlock.vue'
import CharacterUnlockBlock from '@/components/CharacterUnlockBlock.vue'

const { profile } = useTelegramProfile()
const { characters } = useCharacters()

const isCharacterOpened = ref(false)
const selectedCharacterId = ref<string>()
const selectedCharacter = computed(() => characters.value?.find(({ id }) => id === selectedCharacterId.value))

function selectCharacter(id: string) {
  isCharacterOpened.value = true
  selectedCharacterId.value = id
}
</script>
