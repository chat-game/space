<template>
  <ClientOnly>
    <div class="game-block">
      <div id="game-canvas" ref="stage" />

      <div class="interface">
        <div class="cards">
          <img src="/qr.png" alt="qr" width="150" class="qr">
          <div class="wagon-card">
            <NumberFlow class="distance" :value="game?.wagon ? Math.floor(game.wagon.x / 50) : 0" /> м
          </div>

          <div class="wagon-card">
            {{ game?.children.length }}
          </div>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
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
  await game.value.init()
  game.value.websocketService.connect(id)
  stage.value?.appendChild(game.value.app.canvas)

  return () => game.value?.destroy()
})
</script>

<style scoped>
  .game-block {
    width: 100vw;
    height: 350px;
    overflow: hidden;
    position: relative;
  }

  #game-canvas {
    width: 100%;
    height: 250px;
    bottom: 80px;
    position: absolute;
    overflow: hidden;
  }

  .interface {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
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
    padding: 16px 2px 8px;
    background-color: #eef2ff;
    border-radius: 6px;
  }

  .cards {
    padding: 4px 12px 0;
    height: 68px;
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
</style>
