<template>
  <div v-if="product?.items?.length" class="grid grid-cols-4 gap-2">
    <ItemCard v-for="item in product.items" :key="item.id" :item="item" />
  </div>

  <Button v-if="product?.starsPrice && !wasPurchased" class="flex flex-row gap-1 items-center justify-center" @click="activateProduct()">
    <p>{{ t('purchase.for') }} {{ product.starsPrice }}</p>
    <Image src="telegram-star.png" class="w-5 h-5" />
  </Button>
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useI18n } from 'vue-i18n'

const { productId } = defineProps<{
  productId: string
}>()

const { t } = useI18n()
const { open: openInvoice } = useInvoice()
const { products, refreshShop } = useShop()
const { refreshCharacters } = useCharacters()
const { profile, refreshProfile, useApiFetch } = useTelegramProfile()
const { pop: popConfetti } = useConfetti()

const product = computed(() => products.value?.find(({ id }) => id === productId))
const wasPurchased = computed(() => profile.value?.profile?.payments?.find(({ productId: id, status }) => product.value?.singlePurchase && id === productId && status === 'PAID'))

async function activateProduct() {
  const { data } = await useApiFetch(`/payment?id=${productId}`).get().json<{ ok: boolean, result: string }>()

  if (data.value?.ok && data.value?.result) {
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light')
    }

    const status = await openInvoice(data.value.result)

    if (status === 'paid') {
      await refreshProfile()
      await refreshCharacters()
      await refreshShop()

      if (hapticFeedback.impactOccurred.isAvailable()) {
        hapticFeedback.notificationOccurred('success')
      }

      popConfetti()
    }

    if (status === 'failed' || status === 'cancelled') {
      // problem
    }
  }
}
</script>
