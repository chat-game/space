<template>
  <Button class="mt-3 min-h-12 flex flex-row gap-2 items-center justify-center" @click="activateCouponToCoins()">
    <p>Обменять на</p>
    <div class="flex flex-row gap-1.5 items-center text-lg">
      <p>2</p>
      <img src="/coin-small.png" alt="" class="w-5 h-5">
    </div>
  </Button>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

const { profile, refreshProfile } = useTelegramProfile()

async function activateCouponToCoins() {
  const { data } = await useFetch(`https://chatgame.space/api/telegram/profile/${profile.value?.id}/coupon/activate?type=coins`).get().json<{ ok: boolean }>()
  await refreshProfile()

  if (data.value?.ok) {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }
  }
}
</script>
