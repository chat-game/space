import type { ProfileWithTokens } from '@chat-game/types'
import type { Listener } from '@d-fischer/typed-event-emitter'
import type { AuthProvider } from '@twurple/auth'
import { RefreshingAuthProvider } from '@twurple/auth'
import { ChatClient } from '@twurple/chat'
import { DBRepository } from '../repository'

class TwitchAiController {
  readonly #logger = useLogger('ai-controller')
  readonly #userId = '1115655883' // ai_view
  readonly #clientId: string
  readonly #clientSecret: string

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

    const { oauthTwitchClientSecret, oauthTwitchClientId } = useRuntimeConfig()
    this.#clientId = oauthTwitchClientId
    this.#clientSecret = oauthTwitchClientSecret

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
      this.#logger.log('Chat Client disconnected. Trying to reconnect...')
      return this.#restart()
    })
    this.#activeListeners.push(listener)
  }

  async #restart() {
    await this.#initClient()

    this.#loggerId = setInterval(() => {
      this.#logger.log(
        this.#client.currentChannels.toString(),
        this.#client.isConnected ? 'Connected' : 'Not connected',
      )
    }, 60 * 30 * 1000)

    setTimeout(() => {
      this.#logger.log(
        `Restarted with ${this.#client.currentChannels.length} channels active and ${
          this.#activeListeners.length
        } listeners`,
      )
    }, 10000)
  }

  async #initAuthProvider() {
    const accessToken = await this.#repository.getTwitchAccessToken(this.#userId)
    if (!accessToken) {
      this.#logger.log('No access token found')
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
