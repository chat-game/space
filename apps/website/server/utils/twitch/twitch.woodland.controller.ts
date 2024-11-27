import type { ProfileWithTokens } from '@chat-game/types'
import type { Listener } from '@d-fischer/typed-event-emitter'
import { ChatClient } from '@twurple/chat'
import { sendMessage } from '../../api/websocket'
import { DBRepository } from '../repository'

class TwitchWoodlandController {
  readonly #logger = useLogger('woodland-controller')
  readonly #repository: DBRepository
  #client!: ChatClient
  #activeListeners: Listener[] = []
  #loggerId!: ReturnType<typeof setInterval>
  #checkerId!: ReturnType<typeof setInterval>
  #tokensCount: number = 0
  #streamerProfiles: ProfileWithTokens[] = []

  constructor() {
    this.#repository = new DBRepository()
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
      const now = await this.#repository.getTokensCount('WOODLAND')
      if (this.#tokensCount !== now) {
        void this.#restart()
        this.#tokensCount = now
      }
    }, 30000)
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

    this.#streamerProfiles = await this.#repository.findAllStreamers('WOODLAND')

    this.#client = new ChatClient({
      channels: this.#streamerProfiles.map((p) => p.userName),
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

    const listener = this.#client.onMessage(async (channel, user, text, msg) => {
      const channelId = msg.channelId
      const userId = msg.userInfo.userId
      const userName = msg.userInfo.userName

      const profile = this.#streamerProfiles.find((p) => p.twitchId === channelId)
      const token = profile?.twitchTokens.find(
        (t) => t.status === 'ACTIVE' && t.type === 'WOODLAND',
      )
      if (!token) {
        return
      }

      this.#logger.log(channel, user, text, channelId ?? '', userId, token.id)

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

    const woodland = await this.#repository.findActiveWoodland(token)
    if (!woodland) {
      return
    }

    const profile = await this.#repository.findProfileByTwitchId(userId)
    if (!profile) {
      return
    }

    const character = await this.#repository.findCharacterByEditionId(profile.activeEditionId)
    const player = await this.#repository.findOrCreateWoodlandPlayer({
      profileId: profile.id,
      name: userName,
      woodlandId: woodland.id,
    })

    // await this.#trophy.updateProgress(player.profileId, text)

    if (firstChar === '!' && possibleCommand) {
      return sendMessage(
        {
          type: 'WOODLAND_COMMAND',
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

    sendMessage({ type: 'WOODLAND_MESSAGE', data: { player, profile, character, text } }, token)
  }
}

export const twitchWoodlandController = new TwitchWoodlandController()
