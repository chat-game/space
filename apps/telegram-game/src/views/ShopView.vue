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
      <ActiveCard v-for="char in characters" :key="char?.id" @click="() => { isCharacterOpened = true; selectedCharacterId = char?.id }">
        <div v-if="!char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" class="z-10 absolute top-0 left-0 right-0 bottom-0 tg-secondary-bg opacity-40" />

        <div v-if="profile?.profile?.activeEditionId === char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)?.id" class="tg-accent-text text-base font-medium leading-tight">
          Активный
        </div>
        <p class="font-medium text-lg">
          {{ char?.nickname }}
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
    <img :src="`/units/${selectedCharacter?.codename}/idle.gif`" alt="" class="absolute -top-24 left-0 w-28 h-28">

    <p class="text-sm">
      {{ selectedCharacter?.description }}
    </p>

    <div v-if="selectedCharacter?.editions?.find(({ profileId }) => profileId === profile?.profile.id)">
      <CharacterActivationBlock :character-id="selectedCharacterId" />
    </div>
    <div v-else>
      <Button v-if="selectedCharacter?.price" class="mt-3 flex flex-row gap-2 items-center justify-center" @click="() => {}">
        <p>Разблокировать за</p>
        <div class="flex flex-row gap-2 items-center text-xl">
          <p>{{ selectedCharacter?.price }}</p>
          <img src="/coin-small.png" alt="" class="w-8 h-8">
        </div>
      </Button>
      <div v-else class="px-8 tg-hint text-center font-medium leading-tight">
        Персонажа нельзя разблокировать за Монеты
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import CharacterActivationBlock from '@/components/CharacterActivationBlock.vue'

const { profile } = useTelegramProfile()
const { characters } = useCharacters()

const isCharacterOpened = ref(false)
const selectedCharacterId = ref()
const selectedCharacter = computed(() => characters.value?.find(({ id }) => id === selectedCharacterId.value))
</script>
