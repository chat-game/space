<template>
  <PageContainer>
    <div class="hidden tg-section-bg px-3 py-3 flex-row gap-2 items-center rounded-2xl">
      <img :src="data?.photoUrl" alt="avatar" class="w-14 h-14 rounded-full">
      <div>
        <div class="text-xl font-medium">
          {{ data?.firstName }} {{ data?.lastName }}
        </div>
        <div class="tg-hint text-sm">
          {{ data?.id }}
        </div>
      </div>
    </div>

    <ActiveCard class="tg-section-bg px-3 py-3 flex flex-row gap-2 items-center rounded-2xl" @click="openWoodlandPointsModal">
      <div class="flex flex-row gap-2 items-center">
        <Image src="woodland-small.png" class="w-14 h-14" />
        <div class="flex flex-col">
          <NumberFlow :value="profile?.profile.points ?? 67788" class="font-serif -mt-2 !p-0 text-3xl font-semibold" />
          <p class="leading-3">
            Woodland Points
          </p>
        </div>
      </div>
    </ActiveCard>

    <div v-if="inventoryItems.length" class="grid grid-cols-3 gap-2">
      <ActiveCard v-for="edition in inventoryItems" :key="edition.id" class="aspect-square" @click="selectItem(edition.id)">
        <Image :src="`items/${edition.itemId}/128.png`" class="w-full h-auto" />
        <div class="absolute bottom-0 right-0">
          <p class="mx-auto w-fit px-3 py-2 tg-secondary-bg rounded-tl-2xl rounded-br-2xl leading-none">
            {{ edition.amount }}
          </p>
        </div>
      </ActiveCard>
    </div>
    <div v-else class="tg-section-bg p-3 flex flex-col gap-2 items-center rounded-2xl">
      <p class="font-medium tg-hint">
        Нет предметов в инвентаре
      </p>
    </div>

    <div v-if="isEmptyProfile" class="tg-section-bg p-3 flex flex-col gap-2 items-center rounded-2xl">
      <div class="w-full space-y-3">
        <div class="text-xl font-medium">
          Есть профиль на ChatGame?
        </div>
        <div class="tg-hint text-sm">
          Привяжи свою основную учетную запись на сайте. Потребуется Twitch.
        </div>

        <div class="flex flex-col items-center">
          <Button class="w-full" @click="openChatGameLink()">
            Подключить
          </Button>
        </div>
      </div>
    </div>
  </PageContainer>

  <Modal title="Woodland Points" :is-opened="isPointsOpened" @close="isPointsOpened = false">
    <template #bg>
      <WoodlandPointsBackground />
    </template>

    <Image src="woodland-small.png" class="absolute -top-18 left-8 w-22 h-22" />

    <p class="tg-hint text-sm leading-tight">
      Является основным показателем прогресса в игре. Это как уровень профиля, но в виде очков. Их нельзя тратить - только накапливать.
    </p>
  </Modal>

  <Modal :title="selectedItem?.item.name ?? ''" :is-opened="isItemOpened" @close="isItemOpened = false">
    <p class="tg-hint text-sm leading-tight">
      {{ selectedItem?.item.description ?? '' }}
    </p>

    <p class="px-8 tg-hint text-center font-medium leading-tight">
      В наличии: {{ selectedItem?.amount ?? 0 }} шт.
    </p>
  </Modal>
</template>

<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { initData, openLink } from '@telegram-apps/sdk-vue'

const data = initData.user()
const { profile, refreshProfile } = useTelegramProfile()

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
