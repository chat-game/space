import { BaseGameAddon } from '@chat-game/game'

const gameClient = new BaseGameAddon({ websocketUrl: getEnv('VITE_WEBSOCKET_URL'), client: 'TELEGRAM_CLIENT' })

const roomConnected = ref<string>()

export { gameClient, roomConnected }
