<template>
  <div v-if="checkIfItemIsConsumable(itemId)">
    <div class="mb-2 grid grid-cols-4 gap-2">
      <ItemCard :item="{ type: 'PATRON_POINT', amount: 100, entityId: null }" />
      <ItemCard :item="{ type: 'COIN', amount: 1, entityId: null }" />
    </div>

    <Button class="flex flex-row gap-2 items-center justify-center" @click="activate()">
      <p>Съесть 1 шт. и получить награду</p>
    </Button>
  </div>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'

const { id, itemId } = defineProps<{ id: string, itemId: string }>()

const { refreshProfile, useApiFetch } = useTelegramProfile()
const { pop: popConfetti } = useConfetti()

function checkIfItemIsConsumable(itemId: string) {
  if (itemId === 'k088f2b5i8murh77md1gvaoa') {
    return true
  }
}

async function activate() {
  const { data } = await useApiFetch(`/item/${id}/activate`).get().json<{ ok: boolean }>()

  if (data.value?.ok) {
    await refreshProfile()

    popConfetti()

    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }
  }
}
</script>
