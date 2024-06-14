import { createId } from '@paralleldrive/cuid2'
import {
  type IGameObjectPlayer,
  type IGamePoll,
  getRandomInRange,
} from '../../../../../packages/api-sdk/src'
import { VoteAction } from '../actions/voteAction'
import type { GameScene } from '../scenes'

interface IPollOptions {
  scene: GameScene
  votesToSuccess: IGamePoll['votesToSuccess']
}

export class Poll implements IGamePoll {
  public id: string
  public status: IGamePoll['status']
  public action: IGamePoll['action']
  public votesToSuccess: IGamePoll['votesToSuccess']
  public votes: IGamePoll['votes'] = []

  public scene: GameScene

  constructor({ votesToSuccess, scene }: IPollOptions) {
    this.scene = scene

    this.id = createId()
    this.status = 'ACTIVE'
    this.votesToSuccess = votesToSuccess

    this.action = new VoteAction({ poll: this })
  }

  public vote(player: IGameObjectPlayer): boolean {
    if (this.votes.find((v) => v.id === player.id)) {
      return false
    }

    this.votes.push({ id: player.id, userName: player.userName })
    return true
  }

  public generatePollId(): string {
    const id = getRandomInRange(1, 9).toString()
    for (const event of this.scene.eventService.events) {
      if (event.poll?.action.command === `go ${id}`) {
        return this.generatePollId()
      }
    }
    return id
  }
}
