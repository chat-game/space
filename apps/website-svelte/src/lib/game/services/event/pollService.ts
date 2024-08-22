import type { Game, GameObjectPlayer, IGamePoll } from '$lib/game/types'
import type { GameService } from '$lib/game/services/interface'

export class PollService implements GameService {
  game: Game

  constructor(game: Game) {
    this.game = game
  }

  update() {
    for (const event of this.game.eventService.events) {
      if (!event.poll || event.poll.status !== 'ACTIVE') {
        continue
      }

      if (event.poll.votes.length >= event.poll.votesToSuccess) {
        event.poll.status = 'SUCCESS'
      }
    }
  }

  public findActivePollAndVote(pollId: string, player: GameObjectPlayer) {
    for (const event of this.game.eventService.events) {
      if (event.poll && event.poll?.id === pollId) {
        const voted = this.vote(event.poll, player)
        if (!voted) {
          return 'VOTED_ALREADY'
        }
        return 'VOTE_SUCCESS'
      }
    }

    return 'POLL_NOT_FOUND'
  }

  private vote(poll: IGamePoll, player: GameObjectPlayer): boolean {
    if (poll.votes.find((v) => v.id === player.id)) {
      return false
    }

    poll.votes.push({ id: player.id, userName: player.name })
    return true
  }
}
