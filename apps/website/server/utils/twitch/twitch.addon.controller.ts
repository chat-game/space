import { ChatClient } from '@twurple/chat'
import type { Listener } from '@d-fischer/typed-event-emitter'
import type { ActiveCharacter, ProfileWithTokens } from '@chat-game/types'
import { getDateMinusMinutes } from '../date'
import { QuestService } from '../quest'
import { sendMessage } from '../../api/websocket'
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
  #activeCharacters: ActiveCharacter[] = []
  #activeCharactersUpdater!: ReturnType<typeof setInterval> | null

  constructor() {
    this.#quest = new QuestService()
    this.#repository = new DBRepository()
  }

  get status() {
    return this.#activeCharactersUpdater ? 'RUNNING' : 'STOPPED'
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

  async startCharacters() {
    if (this.#activeCharactersUpdater) {
      return
    }

    this.#logger.info('Starting characters updater...')

    this.#activeCharactersUpdater = setInterval(async () => {
      for (const c of this.#activeCharacters) {
        const checkTime = getDateMinusMinutes(4)
        if (c.lastActionAt.getTime() <= checkTime.getTime()) {
          // Inactive - remove via splice
          this.#activeCharacters.splice(this.#activeCharacters.indexOf(c), 1)
          continue
        }

        const xp = await this.#repository.addXpToCharacterEdition(c.id)
        if (c.level < this.#getLevelByXp(xp.xp)) {
          // Level up!
          const newLevel = await this.#repository.addLevelToCharacterEdition(c.id)
          c.level = newLevel.level

          await this.#repository.addCollectorPoints(c.profileId, 5)
          await this.#repository.addCoinsToProfile(c.profileId, c.id, 1)

          sendMessage(
            {
              type: 'LEVEL_UP',
              data: { playerId: c.playerId, text: `Новый уровень: ${newLevel.level}!` },
            },
            c.token,
          )
        }
      }
    }, 30000)
  }

  stopCharacters() {
    if (this.#activeCharactersUpdater) {
      clearInterval(this.#activeCharactersUpdater)
      this.#activeCharactersUpdater = null
    }
  }

  async #initClient() {
    if (this.#client) {
      clearInterval(this.#loggerId)

      for (const l of this.#activeListeners) {
        this.#client.removeListener(l)
      }

      this.#activeListeners = []
      this.#activeCharacters = []

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

  #getLevelByXp(xp: number, needed = 20): number {
    if (xp >= needed) {
      needed = needed * 1.05
      return this.#getLevelByXp(xp - needed, needed) + 1
    }

    return 1
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

    if (!this.#activeCharacters.find((c) => c.id === character.id)) {
      // Not allow bots
      if (character.id !== 'krzq22sjnbj4crrxzdwvrcym') {
        this.#activeCharacters.push({
          ...character,
          lastActionAt: new Date(),
          token,
          playerId: player.id,
        })
      }
    }

    sendMessage({ type: 'MESSAGE', data: { player, profile, character, text } }, token)
  }
}

export const twitchAddonController = new TwitchAddonController()
