<template>
  <Button v-if="product?.starsPrice" @click="activateProduct()">
    Приобрести за {{ product.starsPrice }} Telegram Stars
  </Button>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

const { productId } = defineProps<{
  productId: string
}>()

const { open: openInvoice } = useInvoice()
const { products, refreshShop } = useShop()
const { refreshCharacters } = useCharacters()
const { profile, refreshProfile } = useTelegramProfile()
const { pop: popConfetti } = useConfetti()

const product = computed(() => products.value?.find(({ id }) => id === productId))

async function activateProduct() {
  const { data } = await useFetch(`https://chatgame.space/api/telegram/profile/${profile.value?.id}/payment?id=${productId}`).get().json<{ ok: boolean, result: string }>()

  if (data.value?.ok && data.value?.result) {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.notificationOccurred('success')
    }

    const status = await openInvoice(data.value.result)

    if (status === 'paid') {
      await refreshProfile()
      await refreshCharacters()
      await refreshShop()

      popConfetti()
    }

    if (status === 'failed' || status === 'cancelled') {
      // problem
    }
  }
}
</script>
