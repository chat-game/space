<template>
  <PageContainer>
    <div class="tg-section-bg mb-4 px-3 py-3 flex flex-row gap-2 items-center rounded-md">
      <img :src="data?.photoUrl" alt="avatar" class="w-14 h-14 rounded-full">
      <div>
        <div class="text-xl">
          {{ data?.username }}
        </div>
        <div class="tg-hint text-sm">
          {{ data?.id }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-4 gap-2">
      {{ profile }}
      <div v-for="item in items" :key="item.id" class="tg-section-bg aspect-square p-2 rounded-md">
        <div>Вещь</div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { initData } from '@telegram-apps/sdk-vue'

const data = initData.user()
const { profile } = useTelegramProfile()

const items = [
  {
    id: 1,
    name: 'Топор',
    price: 100,
  },
  {
    id: 2,
    name: 'Топор',
    price: 100,
  },
  {
    id: 3,
    name: 'Топор',
    price: 100,
  },
  {
    id: 4,
    name: 'Топор',
    price: 100,
  },
  {
    id: 5,
    name: 'Топор',
    price: 100,
  },
  {
    id: 6,
    name: 'Топор',
    price: 100,
  },
  {
    id: 7,
    name: 'Топор',
    price: 100,
  },
  {
    id: 8,
    name: 'Топор',
    price: 100,
  },
  {
    id: 9,
    name: 'Топор',
    price: 100,
  },
  {
    id: 10,
    name: 'Топор',
    price: 100,
  },
  {
    id: 11,
    name: 'Топор',
    price: 100,
  },
  {
    id: 12,
    name: 'Топор',
    price: 100,
  },
  {
    id: 13,
    name: 'Топор',
    price: 100,
  },
  {
    id: 14,
    name: 'Топор',
    price: 100,
  },
  {
    id: 15,
    name: 'Топор',
    price: 100,
  },
  {
    id: 16,
    name: 'Топор',
    price: 100,
  },
  {
    id: 17,
    name: 'Топор',
    price: 100,
  },
  {
    id: 18,
    name: 'Топор',
    price: 100,
  },
  {
    id: 19,
    name: 'Топор',
    price: 100,
  },
  {
    id: 20,
    name: 'Топор',
    price: 100,
  },
  {
    id: 21,
    name: 'Топор',
    price: 100,
  },
  {
    id: 22,
    name: 'Топор',
    price: 100,
  },
  {
    id: 23,
    name: 'Топор',
    price: 100,
  },
  {
    id: 24,
    name: 'Топор',
    price: 100,
  },
  {
    id: 25,
    name: 'Топор',
    price: 100,
  },
  {
    id: 26,
    name: 'Топор',
    price: 100,
  },
  {
    id: 27,
    name: 'Топор',
    price: 100,
  },
  {
    id: 28,
    name: 'Топор',
    price: 100,
  },
]
</script>
