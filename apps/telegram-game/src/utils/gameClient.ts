import { BaseGameAddon } from '@chat-game/game'

const websocketUrl = 'wss://chatgame.space/api/websocket'
const gameClient = new BaseGameAddon({ websocketUrl, client: 'TELEGRAM_CLIENT' })

const roomConnected = ref<string>()
const isLoading = ref(false)

function setAsLoaded() {
  setTimeout(() => {
    isLoading.value = false
  }, 1500)
}

export { gameClient, isLoading, roomConnected, setAsLoaded }
