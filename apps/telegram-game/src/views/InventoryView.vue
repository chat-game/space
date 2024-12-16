<template>
  <PageContainer>
    <div class="tg-section-bg mb-4 px-3 py-3 flex flex-row gap-2 items-center rounded-2xl">
      <img :src="data?.photoUrl" alt="avatar" class="w-14 h-14 rounded-full">
      <div>
        <div class="text-xl font-medium">
          {{ data?.username }}
        </div>
        <div class="tg-hint text-sm">
          {{ data?.id }} / {{ profile?.id }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2">
      <div v-for="item in items" :key="item.id" class="tg-section-bg aspect-square p-4 rounded-2xl cursor-pointer" @click="isOpened = true">
        <div class="relative">
          <img src="/wood.png" alt="" class="w-full h-auto">
          <div class="absolute -bottom-2 right-0 left-0">
            <p class="mx-auto w-fit px-3 py-1 tg-secondary-bg rounded-full text-xl leading-none">
              {{ item.amount }}
            </p>
          </div>
        </div>
        <p class="mt-3 text-xs text-center">
          {{ item.name }}
        </p>
      </div>
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

const items = [
  {
    id: 1,
    name: 'Древесина',
    amount: 0,
  },
]

const isOpened = ref(false)
</script>
