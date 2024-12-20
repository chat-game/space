<template>
  <PageContainer>
    <div class="tg-section-bg mb-4 px-3 py-3 flex flex-row gap-2 items-center rounded-2xl">
      <img :src="data?.photoUrl" alt="avatar" class="w-14 h-14 rounded-full">
      <div>
        <div class="text-xl font-medium">
          {{ data?.username }}
        </div>
        <div class="tg-hint text-sm">
          {{ data?.id }}
        </div>
      </div>
    </div>

    <div v-if="isEmptyProfile" class="tg-section-bg mb-4 p-3 flex flex-col gap-2 items-center rounded-2xl">
      <div class="w-full space-y-3">
        <div class="text-xl font-medium">
          Есть профиль на ChatGame?
        </div>
        <div class="tg-hint text-sm">
          Привяжи свою основную учетную запись на сайте. Потребуется Twitch.
        </div>

        <div class="flex flex-col items-center">
          <a :href="`https://chatgame.space/connect?id=${data?.id}`" target="_blank" class="w-full">
            <Button>
              Подключить
            </Button>
          </a>
        </div>
      </div>
    </div>

    <div v-if="inventoryItems" class="grid grid-cols-3 gap-2">
      <ActiveCard v-for="item in inventoryItems" :key="item.id" @click="selectItem(item.id)">
        <img :src="`/items/${item.id}/128.png`" alt="" class="w-full h-auto">
        <div class="absolute bottom-0 right-0">
          <p class="mx-auto w-fit px-3 py-2 tg-secondary-bg rounded-tl-2xl rounded-br-2xl text-xl leading-none">
            {{ item.amount }}
          </p>
        </div>
      </ActiveCard>
    </div>
    <div v-else class="tg-section-bg mb-4 p-3 flex flex-col gap-2 items-center rounded-2xl">
      <p class="font-medium tg-hint">
        Нет предметов в инвентаре
      </p>
    </div>
  </PageContainer>

  <Modal :title="selectedItem?.item.name ?? ''" :is-opened="isItemOpened" @close="isItemOpened = false">
    <p class="tg-hint">
      {{ selectedItem?.item.description ?? '' }}
    </p>
  </Modal>
</template>

<script setup lang="ts">
import { initData } from '@telegram-apps/sdk-vue'

const data = initData.user()
const { profile } = useTelegramProfile()

const isEmptyProfile = computed(() => profile.value?.profile?.twitchId ? profile.value?.profile?.twitchId?.length >= 24 : false)
const inventoryItems = computed(() => profile.value?.profile?.itemEditions ?? [])

const isItemOpened = ref(false)
const selectedItemId = ref<string>()
const selectedItem = computed(() => inventoryItems.value?.find(({ id }) => id === selectedItemId.value))

function selectItem(id: string) {
  isItemOpened.value = true
  selectedItemId.value = id
}
</script>
