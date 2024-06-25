import { createId } from '@paralleldrive/cuid2'
import { VoteAction } from '../actions/voteAction'
import { getRandomInRange } from '$lib/utils/random'
import type {
  Game,
  GameObjectPlayer,
  IGamePoll,
} from '$lib/game/types'

interface IPollOptions {
  game: Game
  votesToSuccess: IGamePoll['votesToSuccess']
}

export class Poll implements IGamePoll {
  public id: string
  public status: IGamePoll['status']
  public action: IGamePoll['action']
  public votesToSuccess: IGamePoll['votesToSuccess']
  public votes: IGamePoll['votes'] = []

  game: Game

  constructor({ votesToSuccess, game }: IPollOptions) {
    this.game = game

    this.id = createId()
    this.status = 'ACTIVE'
    this.votesToSuccess = votesToSuccess

    this.action = new VoteAction({ poll: this })
  }

  public vote(player: GameObjectPlayer): boolean {
    if (this.votes.find((v) => v.id === player.id)) {
      return false
    }

    this.votes.push({ id: player.id, userName: player.name })
    return true
  }

  public generatePollId(): string {
    const id = getRandomInRange(1, 9).toString()
    for (const event of this.game.eventService.events) {
      if (event.poll?.action.command === `go ${id}`) {
        return this.generatePollId()
      }
    }
    return id
  }
}
