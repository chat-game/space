<template>
  <div v-if="checkIfItemIsConsumable(itemId)">
    <div class="mb-2 px-8 text-center leading-tight">
      <div class="flex flex-row items-center justify-center gap-1">
        <div class="border tg-border tg-secondary-bg tg-text px-3 py-1 rounded-2xl">
          +100 WP <Image src="woodland-small.png" class="inline-block w-5 h-5" />
        </div>
        <div class="border tg-border tg-secondary-bg tg-text px-3 py-1 rounded-2xl">
          +1 Монета <Image src="coin.png" class="inline-block w-5 h-5" />
        </div>
      </div>
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
