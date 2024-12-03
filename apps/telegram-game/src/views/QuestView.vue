<template>
  <PageContainer>
    <h2 class="mb-2 tg-section-header-text text-2xl">
      Активные комнаты
    </h2>

    <div class="flex flex-col gap-2">
      <div v-for="room in rooms" :key="room.id" class="tg-section-bg mb-4 px-3 py-3 flex flex-col gap-2 items-center rounded-md">
        <div>
          <div class="text-xl">
            {{ room.name }}
          </div>
          <div class="tg-hint text-sm">
            {{ room.description }}
          </div>

          <button class="mt-4 p-3 tg-button w-full rounded-2xl" @click="connectToToom(room.roomId)">
            Подключиться
          </button>
        </div>
      </div>
    </div>
  </PageContainer>
</template>

<script setup lang="ts">
import { gameClient, roomConnected } from '../utils/gameClient'

function connectToToom(roomId: string) {
  gameClient.websocketService.connect(roomId)
  roomConnected.value = roomId
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
