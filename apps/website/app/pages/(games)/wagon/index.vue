<template>
  <ClientOnly>
    <div class="game-block">
      <div id="game-canvas" ref="stage" />

      <div class="absolute bottom-62 left-0 pl-6 pt-2 pb-4 w-50 flex flex-col justify-center items-start bg-[#f3ca7e] rounded-r-xl">
        <NumberFlowGroup>
          <div
            class="flex items-baseline text-4xl font-semibold"
          >
            <NumberFlow :trend="-1" :value="hh" :format="{ minimumIntegerDigits: 2 }" />
            <NumberFlow
              prefix=":"
              :trend="-1"
              :value="mm"
              :digits="{ 1: { max: 5 } }"
              :format="{ minimumIntegerDigits: 2 }"
            />
            <NumberFlow
              prefix=":"
              :trend="-1"
              :value="ss"
              :digits="{ 1: { max: 5 } }"
              :format="{ minimumIntegerDigits: 2 }"
            />
          </div>
        </NumberFlowGroup>
        <div class="uppercase text-xs leading-tight">
          До окончания стрима
        </div>
      </div>

      <div class="interface bg-orange-950 text-orange-950">
        <div class="cards">
          <img src="/qr.png" alt="qr" class="relative w-50 h-auto mb-6 px-1 pt-3 bg-orange-950 rounded-tr-xl">

          <div class="hidden wagon-card event px-3 py-2 gap-3">
            <Image src="/units/santa/head.png" width="44" />
            <p class="max-w-40 text-xl font-semibold leading-1">
              Рождественский переполох
            </p>
          </div>

          <div class="top-players hidden gap-2">
            <div v-for="member in leaderboard?.members" :key="member.id" class="card">
              <p>{{ member.profile.telegramProfile.firstName }}</p>
              <div class="points">
                <p>{{ member.points }}</p>
                <Image src="/items/k3bitdush5wqbwphhdfnxqtl/128.png" width="32" height="32" />
              </div>
            </div>
          </div>

          <div class="wagon-card hidden">
            <NumberFlow class="distance" :value="game?.wagon ? Math.floor(game.wagon.x / 50) : 0" /> м
          </div>
          <div class="wagon-card hidden">
            {{ game?.children.length }}
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { LeaderboardData } from '@chat-game/types'
import { BaseGameAddon } from '@chat-game/game'
import NumberFlow, { NumberFlowGroup } from '@number-flow/vue'

definePageMeta({
  layout: 'game',
})

const { public: publicEnv } = useRuntimeConfig()
const route = useRoute()
const id = route.query.id?.toString() ?? ''
const endTime = route.query.end?.toString() ?? new Date().toISOString()

const stage = ref<HTMLElement>()
const game = ref<BaseGameAddon>()

const currentEventId = 'iq9f2634d3q3ans243dhxmj7'
const { data: leaderboard, execute: refreshLeaderboard } = useFetch<LeaderboardData>(`https://chatgame.space/api/leaderboard/${currentEventId}/list?limit=9`)

onMounted(async () => {
  game.value = new BaseGameAddon({ websocketUrl: publicEnv.websocketUrl, client: 'WAGON_CLIENT', updateUI: () => {} })
  await game.value.init('wagon')
  game.value.websocketService.connect(id)
  stage.value?.appendChild(game.value.app.canvas)

  setInterval(() => {
    refreshLeaderboard()
  }, 60 * 1000)

  return () => game.value?.destroy()
})

// Countdown timer
const date = new Date(endTime)
const initSeconds = Math.floor((date.getTime() - new Date().getTime()) / 1000)
const seconds = ref(initSeconds > 0 ? initSeconds : 0)

const hh = computed(() => Math.floor(seconds.value / 3600))
const mm = computed(() => Math.floor((seconds.value % 3600) / 60))
const ss = computed(() => seconds.value % 60)

onMounted(() => {
  const timer = setInterval(() => {
    seconds.value--
  }, 1000)

  if (seconds.value <= 0) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
  .game-block {
    width: 100vw;
    height: 350px;
    overflow: hidden;
    position: relative;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans;
  }

  #game-canvas {
    width: 100%;
    height: 250px;
    bottom: 40px;
    position: absolute;
    overflow: hidden;
  }

  .interface {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    /* selection remove */
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .cards {
    padding: 0 0 6px;
    height: 64px;
    position: absolute;
    bottom: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: end;
    justify-content: start;
    gap: 8px;
  }

  .wagon-card {
    padding: 0 12px;
    border-radius: 6px;
    background-color: #fed7aa;
    font-size: 32px;
  }

  .distance {
    font-size: 48px;
  }

  .top-players {
    .card {
      padding: 6px 10px;
      min-width: 130px;
      display: flex;
      flex-direction: column;
      justify-items: start;
      align-items: start;
      gap: 0;
      border-radius: 6px;
      background-color: #fed7aa;

      p {
        font-size: 18px;
        font-weight: 600;
        line-height: 1.2;
      }
    }

    .points {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: center;
      gap: 4px;

      img {
        width: 20px;
        height: 20px;
      }

      p {
        font-weight: 600;
        font-size: 15px;
      }
    }
  }
</style>
