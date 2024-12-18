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

    <div v-if="isEmptyProfile" class="tg-section-bg mb-4 p-3 flex flex-col gap-2 items-center rounded-2xl">
      <div class="w-full">
        <div class="text-xl font-medium">
          Есть профиль на ChatGame?
        </div>
        <div class="tg-hint text-sm">
          Привяжи свою основную учетную запись на сайте. Потребуется Twitch.
        </div>

        <div class="flex flex-col items-center">
          <a :href="`https://chatgame.space/connect?id=${data?.id}`" target="_blank" class="w-full text-center mt-4 p-3 tg-button rounded-2xl">
            Подключить
          </a>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <ActiveCard v-for="item in items" :key="item.id" @click="isOpened = true">
        <img :src="item.img" alt="" class="w-full h-auto">
        <div class="absolute bottom-0 right-0">
          <p class="mx-auto w-fit px-3 py-2 tg-secondary-bg rounded-tl-2xl rounded-br-2xl text-xl leading-none">
            {{ item.amount }}
          </p>
        </div>
      </ActiveCard>
    </div>
  </PageContainer>

  <Modal title="Название" :is-opened="isOpened" @close="isOpened = false">
    <div>
      123
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { initData } from '@telegram-apps/sdk-vue'

const data = initData.user()
const { profile } = useTelegramProfile()

const isEmptyProfile = computed(() => profile.value?.profile?.twitchId.length >= 24)

const items = [
  {
    id: 1,
    name: 'Ветка',
    img: '/items/branch.png',
    amount: 0,
  },
  {
    id: 2,
    name: 'Простая древесина',
    img: '/items/simple_wood.png',
    amount: 0,
  },
  {
    id: 3,
    name: 'Средняя древесина',
    img: '/items/medium_wood.png',
    amount: 0,
  },
  {
    id: 4,
    name: 'Плотная древесина',
    img: '/items/heavy_wood.png',
    amount: 0,
  },
]

const isOpened = ref(false)
</script>
