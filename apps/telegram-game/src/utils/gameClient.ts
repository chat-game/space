import { BaseGameAddon } from '@chat-game/game'

const websocketUrl = 'wss://chatgame.space/api/websocket'
const gameClient = new BaseGameAddon({ websocketUrl, client: 'TELEGRAM_CLIENT' })

const roomConnected = ref<string>()

export { gameClient, roomConnected }
