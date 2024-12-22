<template>
  <PageContainer>
    <div class="mb-4 grid grid-cols-2 gap-2">
      <ActiveCard class="!p-3 flex flex-row gap-3 items-center" @click="isCoinOpened = true">
        <img src="/coin.png" alt="" class="w-12 h-12">
        <div>
          <div class="text-2xl font-medium">
            {{ profile?.profile?.coins }}
          </div>
          <div class="tg-hint text-sm">
            Монеты
          </div>
        </div>
      </ActiveCard>

      <ActiveCard class="!p-3 flex flex-row gap-3 items-center" @click="isCouponOpened = true">
        <img src="/coupon-small.png" alt="" class="w-12 h-12">
        <div>
          <div class="text-2xl font-medium">
            {{ profile?.profile?.coupons }}
          </div>
          <div class="tg-hint text-sm">
            Купоны
          </div>
        </div>
      </ActiveCard>
    </div>

    <SectionHeader text="Специальные предложения" />

    <div class="mb-4 grid grid-cols-2 gap-2">
      <ActiveCard v-for="product in products" :key="product.id" class="aspect-square" @click="selectProduct(product.id)">
        <p class="font-medium text-lg leading-tight">
          {{ product.title }}
        </p>
        <p v-if="product.bonusCoins" class="text-sm tg-hint">
          + бонусы
        </p>

        <div :style="{ 'background-image': `url('/shop/${product.id}/512.png')` }" class="absolute top-0 left-0 right-0 bottom-0 bg-bottom bg-no-repeat bg-cover" />
      </ActiveCard>
    </div>

    <SectionHeader text="Коллекция персонажей 2024" />

    <div class="grid grid-cols-2 gap-2">
      <ActiveCard v-for="char in characters" :key="char.id" class="aspect-square" @click="selectCharacter(char.id)">
        <div v-if="!char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" class="z-10 absolute top-0 left-0 right-0 bottom-0 tg-secondary-bg opacity-40" />

        <div v-if="profile?.profile?.activeEditionId === char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)?.id" class="tg-accent-text text-base font-medium leading-tight">
          Активный
        </div>
        <p class="font-medium text-lg leading-tight">
          {{ char?.nickname }}
        </p>
        <p v-if="char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" class="text-sm tg-hint">
          {{ char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)?.level }} уровень
        </p>

        <div v-if="char?.price && !char?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" class="flex flex-row gap-1 items-center">
          <img src="/coin-small.png" alt="" class="w-5 h-5 grayscale-100">
          <p>{{ char?.price }}</p>
        </div>

        <img :src="`/units/${char?.codename}/128.png`" alt="" class="absolute bottom-0 right-0 w-32 h-auto" :class="{ 'grayscale-100 opacity-70': !char?.editions?.find(({ profileId }) => profileId === profile?.profile.id) }">
      </ActiveCard>
    </div>
  </PageContainer>

  <Modal :title="`&laquo;${selectedCharacter?.nickname}&raquo; ${selectedCharacter?.name}`" :is-opened="isCharacterOpened" @close="isCharacterOpened = false">
    <template #bg>
      <ConfettiBackground />
    </template>

    <img :src="`/units/${selectedCharacter?.codename}/idle.gif`" alt="" class="absolute -top-30 left-0 w-34 h-34">

    <p class="text-sm tg-hint leading-tight">
      {{ selectedCharacter?.description }}
    </p>

    <CharacterActivationBlock v-if="selectedCharacter?.editions?.find(({ profileId }) => profileId === profile?.profile.id)" :character-id="selectedCharacterId ?? ''" />
    <CharacterUnlockBlock v-else :character-id="selectedCharacterId ?? ''" />
  </Modal>

  <Modal :title="selectedProduct?.title ?? ''" :is-opened="isProductOpened" @close="isProductOpened = false">
    <template #bg>
      <CoinBackground :coins-amount="selectedProduct?.coins" />
      <ConfettiBackground />
    </template>

    <p class="text-sm tg-hint leading-tight">
      {{ selectedProduct?.description }}
    </p>

    <ProductActivationBlock :product-id="selectedProductId ?? ''" />
  </Modal>

  <Modal title="Монета" :is-opened="isCoinOpened" @close="isCoinOpened = false">
    <img src="/coin.png" alt="" class="absolute -top-20 left-8 w-24 h-24">

    <p class="text-sm tg-hint leading-tight">
      Является основной валютой для разблокировки персонажей.
    </p>
  </Modal>

  <Modal title="Купон со стрима" :is-opened="isCouponOpened" @close="isCouponOpened = false">
    <img src="/coupon.png" alt="" class="absolute -top-18 left-8 w-24 h-24">

    <p class="text-sm tg-hint leading-tight">
      На стриме twitch.tv/hmbanan666 периодически появляются сообщения с инструкцией, как его получить. Меняй на любую награду ниже.
    </p>

    <CouponActivationBlock v-if="profile?.profile && profile.profile.coupons > 0" />
    <div v-else class="px-8 tg-hint text-center font-medium leading-tight">
      У вас нет купонов
    </div>
  </Modal>
</template>

<script setup lang="ts">
import ActiveCard from '@/components/ActiveCard.vue'
import CharacterActivationBlock from '@/components/CharacterActivationBlock.vue'
import CharacterUnlockBlock from '@/components/CharacterUnlockBlock.vue'
import CouponActivationBlock from '@/components/CouponActivationBlock.vue'

const { profile } = useTelegramProfile()
const { characters } = useCharacters()
const { products } = useShop()

const isCharacterOpened = ref(false)
const selectedCharacterId = ref<string>()
const selectedCharacter = computed(() => characters.value?.find(({ id }) => id === selectedCharacterId.value))

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
