<template>
  <PageContainer>
    <div>
      <SectionHeader :text="t('character.titleActive')" />

      <div v-if="character?.nextLevel" class="grid grid-cols-4 gap-2">
        <ActiveCard class="col-span-3 tg-section-bg mb-4 !p-3 flex flex-col gap-2 items-center rounded-2xl" @click="isCharacterProgressionOpened = true">
          <div class="flex flex-row flex-wrap gap-2">
            <CharacterAvatar :codename="character?.character.codename" />

            <i18n-t keypath="character.xpLeft" tag="p" class="leading-tight">
              <template #xp>
                <span class="font-semibold tg-accent-text">{{ character?.xpToNextLevel }} XP</span>
              </template>
            </i18n-t>
          </div>
        </ActiveCard>

        <div>
          <InventoryItemCard v-if="character?.nextLevel && character.nextLevel?.inventoryItemId" :item-id="character.nextLevel.inventoryItemId" :amount="character.nextLevel.awardAmount" @click="isRewardOpened = true" />
          <p class="mt-0.5 tg-hint text-center font-semibold">
            {{ t('reward') }}
          </p>
        </div>
      </div>
      <div v-else>
        <div class="tg-section-bg mb-4 p-3 flex flex-col gap-2 items-center rounded-2xl">
          <CharacterAvatar :codename="character?.character.codename" />
          <p class="max-w-48 text-center leading-tight">
            {{ character?.character.nickname }} {{ t('character.maxLevelLabel') }}
          </p>
        </div>
      </div>
    </div>

    <div>
      <SectionHeader :text="t('room.titleActive')" />

      <div class="flex flex-col gap-2">
        <div v-for="room in rooms" :key="room.id" class="tg-section-bg mb-4 px-3 py-3 flex flex-col gap-2 items-center rounded-2xl">
          <div class="w-full space-y-3">
            <div class="text-xl font-medium">
              {{ room.name }}
            </div>
            <div class="tg-hint text-sm">
              {{ room.description }}
            </div>

            <Button @click="connectToRoom(room.roomId)">
              {{ t('connect') }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </PageContainer>

  <Modal v-if="rewardItem" :title="rewardItem.name" :is-opened="isRewardOpened" @close="isRewardOpened = false">
    <p class="tg-hint text-sm leading-tight">
      {{ rewardItem.description }}
    </p>
  </Modal>

  <CharacterProgressionModal v-if="character?.levels" :levels="character.levels" :current-level="character.level" :is-opened="isCharacterProgressionOpened" @close="isCharacterProgressionOpened = false" />
</template>

<script setup lang="ts">
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { useI18n } from 'vue-i18n'
import { gameClient, isLoading, roomConnected } from '../utils/gameClient'

const { t } = useI18n()
const router = useRouter()

const { character } = useCharacter()

const isRewardOpened = ref(false)
const rewardItem = computed(() => character.value?.nextLevel?.inventoryItem)

const isCharacterProgressionOpened = ref(false)

function connectToRoom(roomId: string) {
  if (hapticFeedback.impactOccurred.isAvailable()) {
    hapticFeedback.impactOccurred('light')
  }

  gameClient.websocketService.connect(roomId)
  roomConnected.value = roomId

  isLoading.value = true

  // redirect
  router.push({ name: 'game' })
}

const rooms = [
  {
    id: 1,
    name: 'The Wagon',
    description: 'Группа смельчаков ведет Машину, избавляясь от всех препятствий на пути. Основной режим игры на данный момент.',
    roomId: '12345',
  },
]
</script>
