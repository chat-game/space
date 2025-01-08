import { BaseGameAddon } from '@chat-game/game'

const { refreshCharacter } = useCharacter()

const websocketUrl = 'wss://chatgame.space/api/websocket'
const gameClient = new BaseGameAddon({ websocketUrl, client: 'TELEGRAM_CLIENT', updateUI: refreshCharacter })

const roomConnected = ref<string>()

export { gameClient, roomConnected }
