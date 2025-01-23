<template>
  <PageContainer>
    <div class="grid grid-cols-2 gap-2">
      <ActiveCard class="!px-3 !py-2 flex flex-row gap-3 items-center" @click="isCoinOpened = true">
        <Image src="coin.png" class="w-12 h-12" />
        <div>
          <div class="text-2xl font-medium">
            {{ profile?.profile?.coins }}
          </div>
          <div class="tg-hint text-sm">
            {{ t('item.coin.amount', profile?.profile?.coins ?? 0) }}
          </div>
        </div>
      </ActiveCard>

      <ActiveCard class="!px-3 !py-2 flex flex-row gap-3 items-center" @click="isCouponOpened = true">
        <Image src="coupon-small.png" class="w-12 h-12" />
        <div>
          <div class="text-2xl font-medium">
            {{ profile?.profile?.coupons }}
          </div>
          <div class="tg-hint text-sm">
            {{ t('item.coupon.amount', profile?.profile?.coupons ?? 0) }}
          </div>
        </div>
      </ActiveCard>
    </div>

    <div>
      <SectionHeader :text="t('shop.titleSpecial')" />

      <div class="grid grid-cols-2 gap-2">
        <ActiveCard v-for="product in products" :key="product.id" class="aspect-square" @click="selectProduct(product.id)">
          <p class="font-medium text-lg leading-tight">
            {{ t(`products.${product.id}.title`) }}
          </p>
          <p v-if="product.bonusCoins" class="hidden text-sm tg-hint">
            +++
          </p>
          <div v-if="product.singlePurchase === true" class="mt-2 w-fit tg-button px-3 py-1 rounded-2xl border-0 font-medium text-sm">
            {{ t('purchase.limited') }}
          </div>

          <div :style="{ 'background-image': `url('/shop-assets/${product.id}/512.png')` }" class="absolute top-0 left-0 right-0 bottom-0 bg-bottom bg-no-repeat bg-cover" />
        </ActiveCard>
      </div>
    </div>

    <div>
      <SectionHeader :text="t('character.collection.coins')" />

      <div class="grid grid-cols-2 gap-2">
        <CharacterCard v-for="char in coinsCharacters" :key="char.id" :char="char" @click="selectCharacter(char.id)" />
      </div>
    </div>

    <div>
      <SectionHeader :text="t('character.collection.rare')" />

      <div class="grid grid-cols-2 gap-2">
        <CharacterCard v-for="char in rareCharacters" :key="char.id" :char="char" @click="selectCharacter(char.id)" />
      </div>
    </div>
  </PageContainer>

  <Modal :title="selectedCharacter?.id ? `&laquo;${t(`characters.${selectedCharacter?.id}.nickname`)}&raquo; ${t(`characters.${selectedCharacter?.id}.name`)}` : ''" :is-opened="isCharacterOpened" @close="isCharacterOpened = false">
    <template #bg>
      <ConfettiBackground />
    </template>

    <Image :src="`units/${selectedCharacter?.codename}/idle.gif`" class="absolute -top-30 left-0 w-34 h-34" />

    <p v-if="selectedCharacter?.id" class="text-sm tg-hint leading-tight">
      {{ t(`characters.${selectedCharacter?.id}.description`) }}
    </p>

    <CharacterActivationBlock v-if="isSelectedCharacterUnlocked" :character-id="selectedCharacterId ?? ''" />
    <CharacterUnlockBlock v-else :character-id="selectedCharacterId ?? ''" />
  </Modal>

  <Modal :title="selectedProduct?.id ? t(`products.${selectedProduct.id}.title`) : ''" :is-opened="isProductOpened" @close="isProductOpened = false">
    <template #bg>
      <CoinBackground :coins-amount="selectedProduct?.coins" />
      <ChristmasBackground v-if="selectedProduct?.finishAt" />
      <ConfettiBackground />
    </template>

    <p v-if="selectedProduct?.finishAt">
      {{ t('availableUntil') }} {{ new Date(selectedProduct.finishAt).toLocaleString(locale, { day: 'numeric', month: 'long', year: 'numeric' }) }}
    </p>
    <p v-if="selectedProduct?.id" class="text-sm tg-hint leading-tight">
      {{ t(`products.${selectedProduct.id}.description`) }}
    </p>

    <ProductActivationBlock :product-id="selectedProductId ?? ''" />
  </Modal>

  <Modal :title="t('item.coin.title')" :is-opened="isCoinOpened" @close="isCoinOpened = false">
    <Image src="coin.png" class="absolute -top-18 left-8 w-22 h-22" />

    <p class="text-sm tg-hint leading-tight">
      {{ t('item.coin.description') }}
    </p>
  </Modal>

  <Modal :title="t('item.coupon.title')" :is-opened="isCouponOpened" @close="isCouponOpened = false">
    <template #bg>
      <ConfettiBackground />
    </template>

    <Image src="coupon.png" class="absolute -top-18 left-8 w-22 h-22" />

    <p class="text-sm tg-hint leading-tight">
      {{ t('item.coupon.description') }}
    </p>

    <CouponActivationBlock v-if="profile?.profile && profile.profile.coupons > 0" />
    <div v-else class="px-8 tg-hint text-center font-medium leading-tight">
      {{ t('item.coupon.empty') }}
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const { profile } = useTelegramProfile()
const { characters, profileCharacters } = useCharacters()
const { products } = useShop()

const coinsCharacters = computed(() => characters.value?.filter((char) => char.price > 0 || char.id === 'staoqh419yy3k22cbtm9wquc' || char.id === 'c3hrpu39wodc2nlv6pmgmm2k'))
const rareCharacters = computed(() => characters.value?.filter((char) => char.price === 0 && char.id !== 'staoqh419yy3k22cbtm9wquc' && char.id !== 'c3hrpu39wodc2nlv6pmgmm2k'))

const isCharacterOpened = ref(false)
const selectedCharacterId = ref<string>()
const selectedCharacter = computed(() => characters.value?.find(({ id }) => id === selectedCharacterId.value))
const isSelectedCharacterUnlocked = computed(() => profileCharacters.value?.some((c) => c.characterId === selectedCharacter.value?.id))

function selectCharacter(id: string) {
  isCharacterOpened.value = true
  selectedCharacterId.value = id
}

const isProductOpened = ref(false)
const selectedProductId = ref<string>()
const selectedProduct = computed(() => products.value?.find(({ id }) => id === selectedProductId.value))

function selectProduct(id: string) {
  isProductOpened.value = true
  selectedProductId.value = id
}

const isCoinOpened = ref(false)
const isCouponOpened = ref(false)
</script>
