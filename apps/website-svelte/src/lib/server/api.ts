import { ChatGameAPI } from '@hmbanan666/chat-game-api'
import { env as privateEnv } from '$env/dynamic/private'

export const api = new ChatGameAPI(privateEnv.PRIVATE_WEBSITE_BEARER ?? '')
