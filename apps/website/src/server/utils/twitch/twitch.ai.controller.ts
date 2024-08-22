import process from 'node:process'
import { ChatClient } from '@twurple/chat'
import type { Listener } from '@d-fischer/typed-event-emitter'
import type { AuthProvider } from '@twurple/auth'
import { RefreshingAuthProvider } from '@twurple/auth'
import type { ProfileWithTokens } from '@chat-game/types'
import { DBRepository } from '../repository'

class TwitchAiController {
  readonly #userId = '1115655883' // ai_view
  readonly #clientId = process.env.PUBLIC_TWITCH_CLIENT_ID as string
  readonly #clientSecret = process.env.PRIVATE_TWITCH_SECRET_ID as string

  readonly #repository: DBRepository
  #authProvider!: AuthProvider
  #client!: ChatClient
  #activeListeners: Listener[] = []
  #loggerId!: ReturnType<typeof setInterval>
  #checkerId!: ReturnType<typeof setInterval>
  #tokensCount: number = 0
  #streamerProfiles: ProfileWithTokens[] = []

  constructor() {
    this.#repository = new DBRepository()
    void this.#init()
  }

  get status() {
    return this.#client?.isConnected ? 'RUNNING' : 'STOPPED'
  }

  async serve() {
    if (this.#checkerId) {
      return
    }

    // Checking new Tokens
    this.#checkerId = setInterval(async () => {
      const now = await this.#repository.getTokensCount('AI_VIEW')
      if (this.#tokensCount !== now) {
        void this.#restart()
        this.#tokensCount = now
      }
    }, 60000)
  }

  async #init() {
    await this.#initAuthProvider()
  }

  async #initClient() {
    if (this.#client) {
      clearInterval(this.#loggerId)

      for (const l of this.#activeListeners) {
        this.#client.removeListener(l)
      }

      this.#activeListeners = []

      this.#client.quit()
    }

    this.#streamerProfiles = await this.#repository.findAllStreamers('AI_VIEW')

    this.#client = new ChatClient({
      channels: this.#streamerProfiles.map((p) => p.userName),
      authProvider: this.#authProvider,
    })

    this.#client.connect()

    const listener = this.#client.onDisconnect(() => {
      log('[AI]', 'Chat Client disconnected. Trying to reconnect...')
      return this.#restart()
    })
    this.#activeListeners.push(listener)
  }

  async #restart() {
    await this.#initClient()

    this.#loggerId = setInterval(() => {
      log(
        '[AI]',
        this.#client.currentChannels.toString(),
        this.#client.isConnected ? 'Connected' : 'Not connected'
      )
    }, 60 * 30 * 1000)

    setTimeout(() => {
      log(
        '[AI]',
        `Restarted with ${this.#client.currentChannels.length} channels active and ${
          this.#activeListeners.length
        } listeners`
      )
    }, 10000)
  }

  async #initAuthProvider() {
    const accessToken = await this.#repository.getTwitchAccessToken(this.#userId)
    if (!accessToken) {
      log('[AI]', 'No access token found')
      return
    }

    const authProvider = new RefreshingAuthProvider({
      clientId: this.#clientId,
      clientSecret: this.#clientSecret,
    })

    authProvider.onRefresh(async (userId, newTokenData) => {
      await this.#repository.updateTwitchAccessToken(userId, newTokenData)
    })

    await authProvider.addUserForToken(accessToken, ['chat'])

    this.#authProvider = authProvider
  }
}

export const twitchAiController = new TwitchAiController()
