import type { ProfileWithTokens } from '@chat-game/types'
import type { Listener } from '@d-fischer/typed-event-emitter'
import { ChatClient } from '@twurple/chat'
import { sendMessage } from '../../api/websocket'
import { QuestService } from '../quest'
import { DBRepository } from '../repository'

class TwitchAddonController {
  readonly #logger = useLogger('addon-controller')
  readonly #quest: QuestService
  readonly #repository: DBRepository
  #client!: ChatClient
  #activeListeners: Listener[] = []
  #loggerId!: ReturnType<typeof setInterval>
  #checkerId!: ReturnType<typeof setInterval>
  #tokensCount: number = 0
  #streamerProfiles: ProfileWithTokens[] = []

  constructor() {
    this.#quest = new QuestService()
    this.#repository = new DBRepository()
  }

  async serve() {
    if (this.#checkerId) {
      return
    }

    // Checking new Tokens
    this.#checkerId = setInterval(async () => {
      const now = await this.#repository.getTokensCount('ADDON')
      if (this.#tokensCount !== now) {
        void this.#restart()
        this.#tokensCount = now
      }
    }, 60000)
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

    this.#streamerProfiles = await this.#repository.findAllStreamers('ADDON')

    this.#client = new ChatClient({
      channels: this.#streamerProfiles.map((p) => p.userName),
    })

    this.#client.connect()

    const listener = this.#client.onDisconnect(() => {
      this.#logger.warn('Chat Client disconnected. Trying to reconnect...')
      return this.#restart()
    })
    this.#activeListeners.push(listener)
  }

  async #restart() {
    await this.#initClient()

    const listener = this.#client.onMessage(async (channel, user, text, msg) => {
      const channelId = msg.channelId
      const userId = msg.userInfo.userId
      const userName = msg.userInfo.userName

      const profile = this.#streamerProfiles.find((p) => p.twitchId === channelId)
      const token = profile?.twitchTokens.find((t) => t.status === 'ACTIVE' && t.type === 'ADDON')
      if (!token) {
        return
      }

      this.#logger.verbose(channel, user, text, channelId ?? '', userId, token.id)

      await this.#handleMessage({
        userId,
        userName,
        text,
        token: token.id,
      })
    })

    this.#activeListeners.push(listener)

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

  async #handleMessage({
    userName,
    userId,
    text,
    token,
  }: {
    userName: string
    userId: string
    text: string
    token: string
  }) {
    const strings = text.split(' ')
    const firstWord = strings[0] ?? ''
    const firstChar = firstWord.charAt(0)
    const possibleCommand = firstWord.substring(1)
    const otherStrings = strings.toSpliced(0, 1)

    const profile = await this.#repository.findOrCreateProfile({ userId, userName })
    const character = await this.#repository.findCharacterByEditionId(profile.activeEditionId)
    const player = await this.#repository.findOrCreatePlayer({ profileId: profile.id, userName })

    await this.#quest.updateProgress(profile.id)

    if (firstChar === '!' && possibleCommand) {
      return sendMessage(
        {
          type: 'COMMAND',
          data: {
            command: possibleCommand,
            params: otherStrings,
            player,
            profile,
            character,
            text,
          },
        },
        token,
      )
    }

    sendMessage({ type: 'MESSAGE', data: { player, profile, character, text } }, token)
  }
}

export const twitchAddonController = new TwitchAddonController()
