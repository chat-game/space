import { BaseGameAddon } from '@chat-game/game-addon'

const websocketUrl = 'wss://chatgame.space/api/websocket'
const gameClient = new BaseGameAddon({ websocketUrl, client: 'TELEGRAM_CLIENT' })

const roomConnected = ref<string | null>(null)
const isLoading = ref(false)

function setAsLoaded() {
  try {
    setTimeout(() => {
      isLoading.value = false
    }, 1500)
  } catch (error) {
    console.error('Error in setAsLoaded:', error)
  }
}

export { gameClient, isLoading, roomConnected, setAsLoaded }
