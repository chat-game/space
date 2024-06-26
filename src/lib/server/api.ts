import { ChatGameAPI } from '@hmbanan666/chat-game-api'
import { serverConfig } from '$lib/config'

export const api = new ChatGameAPI(serverConfig.websiteBearer)
