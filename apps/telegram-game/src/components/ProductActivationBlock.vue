<template>
  <div v-if="product?.items?.length" class="grid grid-cols-4 gap-2">
    <div v-for="item in product.items" :key="item.id" class="px-2 py-3 tg-secondary-bg rounded-2xl flex flex-col justify-center items-center gap-1">
      <img :src="getItemIconByType(item.type, item.entityId)" alt="" class="w-10 h-10">
      <p class="font-medium text-sm leading-tight">
        {{ item.amount > 0 ? item.amount : getItemLabelByType(item.type) }}
      </p>
    </div>
  </div>

  <Button v-if="product?.starsPrice && !wasPurchased" class="flex flex-row gap-1 items-center justify-center" @click="activateProduct()">
    <p>Приобрести за {{ product.starsPrice }}</p>
    <img src="/telegram-star.png" alt="" class="w-5 h-5">
  </Button>
</template>

<script setup lang="ts">
import type { ProductItem } from '@chat-game/types'
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

const { productId } = defineProps<{
  productId: string
}>()

const { open: openInvoice } = useInvoice()
const { products, refreshShop } = useShop()
const { characters, refreshCharacters } = useCharacters()
const { profile, refreshProfile } = useTelegramProfile()
const { pop: popConfetti } = useConfetti()

const product = computed(() => products.value?.find(({ id }) => id === productId))
const wasPurchased = computed(() => profile.value?.profile?.payments?.find(({ productId: id, status }) => product.value?.singlePurchase && id === productId && status === 'PAID'))

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

function getItemLabelByType(type: ProductItem['type']) {
  switch (type) {
    case 'CHARACTER':
      return 'Персонаж'
    case 'COIN':
      return 'Монета'
    case 'TROPHY':
      return 'Трофей'
    case 'PATRON_POINT':
      return 'Патрон'
    default:
      return ''
  }
}

function getItemIconByType(type: ProductItem['type'], entityId: string | null) {
  if (entityId) {
    if (type === 'CHARACTER') {
      const character = characters.value?.find(({ id }) => id === entityId)
      if (character) {
        return `/units/${character.codename}/head.png`
      }
    }
  }

  switch (type) {
    case 'COIN':
      return '/coin.png'
    case 'TROPHY':
      return '/trophy.png'
    case 'PATRON_POINT':
      return '/patron.png'
    default:
      return ''
  }
}
</script>
