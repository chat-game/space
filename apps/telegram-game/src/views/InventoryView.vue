<template>
  <PageContainer>
    <ActiveCard class="tg-section-bg px-3 py-3 flex flex-row gap-2 items-center rounded-2xl" @click="openWoodlandPointsModal">
      <div class="flex flex-row gap-2 items-center">
        <Image src="woodland-small.png" class="w-14 h-14" />
        <div class="flex flex-col">
          <NumberFlow :value="profile?.profile.points ?? 0" class="font-serif -mt-2 !p-0 text-3xl font-semibold" />
          <p class="leading-3">
            {{ t('item.woodlandPoint.amount', profile?.profile.points ?? 0) }}
          </p>
        </div>
      </div>
    </ActiveCard>

    <div v-if="inventoryItems.length" class="grid grid-cols-4 gap-2">
      <InventoryItemCard
        v-for="edition in inventoryItems"
        :key="edition.id"
        :item-id="edition.itemId"
        :amount="edition.amount"
        @click="selectItem(edition.id)"
      />
    </div>
    <div v-else class="tg-section-bg p-3 flex flex-col gap-2 items-center rounded-2xl">
      <p class="font-medium tg-hint">
        {{ t('inventory.empty') }}
      </p>
    </div>

    <div v-if="isEmptyProfile" class="tg-section-bg p-3 flex flex-col gap-2 items-center rounded-2xl">
      <div class="w-full space-y-3">
        <div class="text-xl font-medium">
          {{ t('inventory.chatgame.title') }}
        </div>
        <div class="tg-hint text-sm">
          {{ t('inventory.chatgame.description') }}
        </div>

        <div class="flex flex-col items-center">
          <Button class="w-full" @click="openChatGameLink()">
            {{ t('inventory.chatgame.button') }}
          </Button>
        </div>
      </div>
    </div>
  </PageContainer>

  <Modal
    :title="t('item.woodlandPoint.title')"
    :is-opened="isPointsOpened"
    @close="isPointsOpened = false"
  >
    <template #bg>
      <WoodlandPointsBackground />
    </template>

    <Image src="woodland-small.png" class="absolute -top-18 left-8 w-22 h-22" />

    <p class="tg-hint text-sm leading-tight">
      {{ t('item.woodlandPoint.description') }}
    </p>
  </Modal>

  <Modal
    :title="selectedItem?.item.name ? t(`items.${selectedItem.itemId}.name`) : ''"
    :is-opened="isItemOpened"
    @close="isItemOpened = false"
  >
    <template #bg>
      <ConfettiBackground />
    </template>

    <p class="tg-hint font-medium leading-tight">
      {{ t('inventory.currentAmount', { n: selectedItem?.amount ?? 0 }) }}
    </p>

    <p v-if="selectedItem?.item.description" class="tg-hint text-sm leading-tight">
      {{ t(`items.${selectedItem.item.id}.description`) }}
    </p>

    <InventoryItemActivationBlock
      v-if="selectedItem && selectedItem.amount > 0"
      :id="selectedItem.id"
      :item-id="selectedItem.item.id"
    />
  </Modal>
</template>

<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { initData, openLink } from '@telegram-apps/sdk-vue'
import { useI18n } from 'vue-i18n'

const data = initData.user()
const { profile, refreshProfile } = useTelegramProfile()
const { t } = useI18n()

onMounted(() => {
  refreshProfile()
})

const isEmptyProfile = computed(() => profile.value?.profile?.twitchId ? profile.value?.profile?.twitchId?.length >= 24 : false)
const inventoryItems = computed(() => profile.value?.profile?.itemEditions ?? [])

const isPointsOpened = ref(false)

function openWoodlandPointsModal() {
  isPointsOpened.value = true
}

const isItemOpened = ref(false)
const selectedItemId = ref<string>()
const selectedItem = computed(() => inventoryItems.value?.find(({ id }) => id === selectedItemId.value))

function selectItem(id: string) {
  isItemOpened.value = true
  selectedItemId.value = id
}

function openChatGameLink() {
  if (openLink.isAvailable()) {
    openLink(`https://chatgame.space/connect?id=${data?.id}`, {
      tryInstantView: true,
    })
  }
}
</script>
