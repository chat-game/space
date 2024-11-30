<template>
  <PageContainer>
    <div class="card mb-4 h-16 flex flex-row gap-2 items-center">
      <img :src="data?.photoUrl" alt="avatar" class="w-14 h-14 rounded-full">
      <div>
        <div class="text-xl">
          {{ data?.username }}
        </div>
        <div class="text-sm">
          {{ data?.id }}
        </div>
      </div>
    </div>

    <div class="grid grid-cols-4">
      <div class="aspect-square p-2 inventory-item">
        <div>Топор</div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { initData } from '@telegram-apps/sdk-vue'

const data = initData.user()
</script>

<style scoped>
.text {
  color: var(--tg-theme-text-color);
}
.card {
  background-color: var(--tg-theme-bg-color);
  color: var(--tg-theme-text-color);
}
.inventory-item {
  background-color: var(--tg-theme-section-separator-color);
}
</style>
