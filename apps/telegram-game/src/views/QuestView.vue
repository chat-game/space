<template>
  <PageContainer>
    <div>
      <SectionHeader text="Активный персонаж" />

      <div v-if="character?.nextLevel" class="grid grid-cols-4 gap-2">
        <div class="col-span-3 tg-section-bg mb-4 px-3 py-3 flex flex-col gap-2 items-center rounded-2xl">
          <div class="flex flex-row flex-wrap gap-2">
            <ActiveCard class="!p-0" @click="isCharacterProgressionOpened = true">
              <CharacterAvatar :codename="character?.character.codename" />
            </ActiveCard>
            <p class="leading-tight">
              Осталось <span class="font-semibold tg-accent-text">{{ character?.xpToNextLevel }} XP</span> до следующего уровня
            </p>
          </div>
        </div>

        <div>
          <InventoryItemCard v-if="character?.nextLevel && character.nextLevel?.inventoryItemId" :item-id="character.nextLevel.inventoryItemId" :amount="character.nextLevel.awardAmount" @click="isRewardOpened = true" />
          <p class="mt-0.5 tg-hint text-center font-semibold">
            Награда
          </p>
        </div>
      </div>
      <div v-else>
        <div class="tg-section-bg mb-4 px-3 py-3 flex flex-col gap-2 items-center rounded-2xl">
          <CharacterAvatar :codename="character?.character.codename" />
          <p class="max-w-48 text-center leading-tight">
            {{ character?.character.nickname }} достиг максимального уровня
          </p>
        </div>
      </div>
    </div>

    <div>
      <SectionHeader text="Активные комнаты" />

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
              Подключиться
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
import { gameClient, isLoading, roomConnected } from '../utils/gameClient'

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
    description: 'Только на активном стриме hmbanan666! Группа смельчаков ведет Машину, избавляясь от всех препятствий на пути.',
    roomId: '12345',
  },
  {
    id: 2,
    name: 'Тестовая задача',
    description: 'Ой-ей!',
    roomId: '123456',
  },
]
</script>
