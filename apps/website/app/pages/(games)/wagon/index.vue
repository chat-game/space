<template>
  <ClientOnly>
    <div class="game-block">
      <div id="game-canvas" ref="stage" />

      <div class="interface">
        <div class="cards">
          <img src="/qr.png" alt="qr" width="150" class="qr">

          <div class="wagon-card event">
            <img src="/units/santa/head.png" alt="" width="56">
            <p class="title">
              Рождественский переполох
            </p>
          </div>

          <div class="top-players">
            <div v-for="member in leaderboard?.members.splice(0, 8)" :key="member.id" class="card">
              <p>{{ member.profile.telegramProfile.firstName }}</p>
              <div class="points">
                <p>{{ member.points }}</p>
                <img src="/icons/christmas-cupcake.png" alt="" width="32" height="32">
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
import NumberFlow from '@number-flow/vue'

definePageMeta({
  layout: 'game',
})

const { public: publicEnv } = useRuntimeConfig()
const route = useRoute()
const id = route.query.id?.toString() ?? ''
const stage = ref<HTMLElement>()
const game = ref<BaseGameAddon>()

onMounted(async () => {
  game.value = new BaseGameAddon({ websocketUrl: publicEnv.websocketUrl, client: 'WAGON_CLIENT' })
  await game.value.init('wagon')
  game.value.websocketService.connect(id)
  stage.value?.appendChild(game.value.app.canvas)

  return () => game.value?.destroy()
})

const christmasId = 'iq9f2634d3q3ans243dhxmj7'
const { data: leaderboard, execute: refreshLeaderboard } = useFetch<LeaderboardData>(`https://chatgame.space/api/leaderboard/${christmasId}/list`)

onMounted(() => {
  setInterval(() => {
    refreshLeaderboard()
  }, 60 * 1000)
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
    background-color: #450a0a;
    color: #450a0a;
    /* selection remove */
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .qr {
    width: 200px;
    height: auto;
    position: relative;
    margin-top: -200px;
    padding: 6px 2px 8px;
    background-color: #450a0a;
    border-radius: 0 14px 0 0;
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

  .hidden {
    display: none;
  }

  .event {
    padding: 8px 12px;
    display: flex;
    gap: 12px;

    .title {
      font-size: 24px;
      font-weight: 600;
      max-width: 200px;
      line-height: 1.1;
    }
  }

  .top-players {
    display: flex;
    gap: 8px;

    .card {
      padding: 8px 12px;
      min-width: 120px;
      display: flex;
      flex-direction: column;
      justify-items: start;
      align-items: start;
      gap: 2px;
      border-radius: 6px;
      background-color: #fed7aa;

      p {
        font-size: 20px;
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
        width: 24px;
        height: 24px;
      }

      p {
        font-weight: 600;
        font-size: 20px;
      }
    }
  }
</style>
