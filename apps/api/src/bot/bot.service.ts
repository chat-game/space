import { TWITCH_CHANNEL_REWARDS } from '../config'
import type { Game } from '../game/game'

export class BotService {
  public game: Game

  constructor(game: Game) {
    this.game = game
  }

  async handleMessage({
    userName,
    userId,
    text,
  }: {
    userName: string
    userId: string
    text: string
  }) {
    const strings = text.split(' ')

    const possibleCommand = strings[0].substring(1)
    const otherStrings = strings.toSpliced(0, 1)
    const firstChar = strings[0].charAt(0)

    if (firstChar === '!') {
      const activeAction
        = this.game.scene.actionService.findActionByCommand(possibleCommand)
      if (activeAction) {
        const action = activeAction.action
        const params = otherStrings

        const result = await this.game.handleActionFromChat({
          action,
          userId,
          userName,
          params,
        })
        if (result.message) {
          return result.message
        }

        return
      }

      const dynamicAction
        = this.game.scene.actionService.findDynamicActionByCommand(
          possibleCommand,
        )
      if (dynamicAction) {
        const params = otherStrings

        const result = await this.game.handleDynamicActionFromChat({
          action: dynamicAction,
          userId,
          userName,
          params,
        })
        if (result.message) {
          return result.message
        }
      }
    }

    void this.game.handleActionFromChat({
      action: 'SHOW_MESSAGE',
      userId,
      userName,
      params: [text],
    })
  }

  public async handleRaid({
    userName,
    userId,
    viewerCount,
  }: {
    userName: string
    userId: string
    viewerCount: number
  }) {
    return this.game.handleActionFromChat({
      action: 'START_RAID',
      userId,
      userName,
      params: [viewerCount.toString()],
    })
  }

  public async handleChannelRewardRedemption({
    userId,
    userName,
    rewardId,
    message,
  }: {
    userId: string
    userName: string
    rewardId: string
    message: string
  }) {
    console.log(
      'The viewer bought a reward using channel points',
      userId,
      userName,
      rewardId,
      message,
    )
    const player = await this.game.repository.findOrCreatePlayer(
      userId,
      userName,
    )
    if (rewardId === TWITCH_CHANNEL_REWARDS.add150ViewerPointsId) {
      await this.game.repository.addPlayerViewerPoints(player.id, 150)
      return
    }
    if (rewardId === TWITCH_CHANNEL_REWARDS.villainStealFuelId) {
      return this.game.handleActionFromChat({
        action: 'STEAL_FUEL',
        userId,
        userName,
      })
    }
    if (rewardId === TWITCH_CHANNEL_REWARDS.addNewIdea) {
      return this.game.handleActionFromChat({
        action: 'CREATE_IDEA',
        userId,
        userName,
        params: [message],
      })
    }
  }
}
