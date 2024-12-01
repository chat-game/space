<template>
  <PageContainer>
    <div class="tg-section-bg tg-text mb-4 h-16 flex flex-row gap-2 items-center">
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
      <div class="tg-section-bg aspect-square p-2 inventory-item">
        <div>Вещь</div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { initData } from '@telegram-apps/sdk-vue'

const data = initData.user()
</script>
