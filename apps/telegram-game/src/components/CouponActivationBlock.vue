<template>
  <Button class="min-h-12 flex flex-row gap-1 items-center justify-center" @click="activateCouponToCoins()">
    <p>{{ t('trade.for') }}</p>
    <div class="flex flex-row gap-1.5 items-center text-lg">
      <p>2</p>
      <Image src="coin-small.png" class="w-5 h-5" />
    </div>
  </Button>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { refreshProfile, useApiFetch } = useTelegramProfile()
const { pop: popConfetti } = useConfetti()

async function activateCouponToCoins() {
  const { data } = await useApiFetch(`/coupon/activate?type=coins`).get().json<{ ok: boolean }>()

  if (data.value?.ok) {
    await refreshProfile()

    popConfetti()

    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }
  }
}
</script>
