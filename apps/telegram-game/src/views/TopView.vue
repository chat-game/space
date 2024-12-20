<template>
  <PageContainer>
    <div class="tg-section-bg mb-4 px-3 py-3 flex flex-row gap-2 items-center rounded-2xl">
      <img :src="data?.photoUrl" alt="avatar" class="w-14 h-14 rounded-full">
      <div>
        <div class="text-xl font-medium">
          {{ data?.username }}
        </div>
        <div class="tg-hint text-sm">
          {{ data?.id }}
        </div>
      </div>
    </div>

    <SectionHeader text="Мои трофеи" />

    <div v-if="trophies.length" class="grid grid-cols-3 gap-2">
      <ActiveCard v-for="edition in trophies" :key="edition.id" class="flex flex-col gap-2 items-center" @click="selectTrophy(edition.id)">
        <img :src="getTrophyImage(edition.trophy)" alt="" class="w-full h-auto">
        <p class="max-h-14 my-auto text-center text-sm font-medium leading-tight line-clamp-3">
          {{ edition.trophy.name }}
        </p>
      </ActiveCard>
    </div>
    <div v-else class="tg-section-bg mb-4 p-3 flex flex-col gap-2 items-center rounded-2xl">
      <p class="font-medium tg-hint">
        Нет полученных трофеев
      </p>
    </div>
  </PageContainer>

  <Modal :title="selectedTrophy?.trophy.name ?? ''" :is-opened="isTrophyOpened" @close="isTrophyOpened = false">
    <p class="tg-hint text-sm leading-tight">
      {{ selectedTrophy?.trophy.description ?? '' }}
    </p>
    <p v-if="selectedTrophy?.createdAt">
      Получен {{ new Date(selectedTrophy.createdAt).toLocaleString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }}
    </p>
  </Modal>
</template>

<script setup lang="ts">
import { initData } from '@telegram-apps/sdk-vue'

const data = initData.user()
const { profile } = useTelegramProfile()

const trophies = computed(() => profile.value?.profile.trophyEditions || [])

const isTrophyOpened = ref(false)
const selectedTrophyId = ref<string>()
const selectedTrophy = computed(() => trophies.value?.find(({ id }) => id === selectedTrophyId.value))

function selectTrophy(id: string) {
  isTrophyOpened.value = true
  selectedTrophyId.value = id
}

function getTrophyImage(data: { rarity: number, id: string, hasImage: boolean }): string {
  if (!data.hasImage) {
    switch (data.rarity) {
      case 0:
        return '/trophies/common/128.png'
      case 1:
        return '/trophies/uncommon/128.png'
      case 2:
        return '/trophies/rare/128.png'
      case 3:
        return '/trophies/epic/128.png'
      case 4:
        return '/trophies/legendary/128.png'
      default:
        return '/trophies/common/128.png'
    }
  }

  return `/trophies/${data.id}/128.png`
}
</script>
