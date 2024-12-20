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

    <div v-if="trophies" class="grid grid-cols-3 gap-2">
      <ActiveCard v-for="edition in trophies" :key="edition.id" @click="selectTrophy(edition.id)">
        <img src="/wheel-1.png" alt="" class="w-full h-auto">
        <div class="absolute bottom-0 right-0">
          <p class="mx-auto w-fit px-3 py-2 tg-secondary-bg rounded-tl-2xl rounded-br-2xl leading-none">
            тест
          </p>
        </div>
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
</script>
