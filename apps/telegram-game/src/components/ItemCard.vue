<template>
  <div class="px-2 py-3 tg-secondary-bg rounded-2xl flex flex-col justify-center items-center gap-1">
    <Image :src="getItemIconByType(item.type, item.entityId)" class="w-10 h-10" />
    <p class="font-medium text-sm leading-tight">
      {{ item.amount > 1 ? `+${item.amount}` : getItemLabelByType(item.type) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ProductItem } from '@chat-game/types'
import { useI18n } from 'vue-i18n'

defineProps<{
  item: Pick<ProductItem, 'type' | 'amount' | 'entityId'>
}>()

const { t } = useI18n()
const { characters } = useCharacters()

function getItemIconByType(type: ProductItem['type'], entityId: string | null) {
  if (entityId) {
    if (type === 'CHARACTER') {
      const character = characters.value?.find(({ id }) => id === entityId)
      if (character) {
        return `units/${character.codename}/head.png`
      }
    }
  }

  switch (type) {
    case 'COIN':
      return 'coin.png'
    case 'TROPHY':
      return 'trophy.png'
    case 'PATRON_POINT':
      return 'woodland-small.png'
    default:
      return ''
  }
}

function getItemLabelByType(type: ProductItem['type']) {
  switch (type) {
    case 'CHARACTER':
      return t('character.title')
    case 'COIN':
      return t('item.coin.title')
    case 'TROPHY':
      return t('item.trophy.title')
    case 'PATRON_POINT':
      return 'Point'
    default:
      return ''
  }
}
</script>
