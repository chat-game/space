import { BaseGameAddon } from '@chat-game/game'

const { refreshCharacter } = useCharacter()

function updateUI() {
  refreshCharacter()
}

const websocketUrl = 'wss://chatgame.space/api/websocket'
const gameClient = new BaseGameAddon({ websocketUrl, client: 'TELEGRAM_CLIENT', updateUI })

const roomConnected = ref<string>()

export { gameClient, roomConnected }
