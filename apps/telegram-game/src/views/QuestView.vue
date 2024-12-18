<template>
  <PageContainer>
    <SectionHeader text="Активные комнаты" />

    <div class="flex flex-col gap-2">
      <div v-for="room in rooms" :key="room.id" class="tg-section-bg mb-4 px-3 py-3 flex flex-col gap-2 items-center rounded-2xl">
        <div class="space-y-3">
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
  </PageContainer>
</template>

<script setup lang="ts">
import SectionHeader from '@/components/SectionHeader.vue'
import { hapticFeedback } from '@telegram-apps/sdk-vue'
import { gameClient, roomConnected } from '../utils/gameClient'

const router = useRouter()

function connectToRoom(roomId: string) {
  if (hapticFeedback.impactOccurred.isAvailable()) {
    hapticFeedback.impactOccurred('light')
  }

  gameClient.websocketService.connect(roomId)
  roomConnected.value = roomId

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
]
</script>
