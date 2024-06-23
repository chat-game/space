import { ChatGameAPI } from '@hmbanan666/chat-game-api'
import { env } from '$env/dynamic/private'

export const api = new ChatGameAPI(env.PRIVATE_WEBSITE_BEARER ?? '')
