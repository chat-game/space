import type { IGameObjectPlayer, IGamePoll } from "$lib/game/types"
import type { Player } from "../objects/units"
import type { GameScene } from "../scenes/gameScene"

interface IPollServiceOptions {
  scene: GameScene
}

export class PollService {
  public scene: GameScene

  constructor({ scene }: IPollServiceOptions) {
    this.scene = scene
  }

  public update() {
    for (const event of this.scene.eventService.events) {
      if (!event.poll || event.poll.status !== "ACTIVE") {
        continue
      }

      if (event.poll.votes.length >= event.poll.votesToSuccess) {
        event.poll.status = "SUCCESS"
      }
    }
  }

  public findActivePollAndVote(pollId: string, player: Player) {
    for (const event of this.scene.eventService.events) {
      if (event.poll && event.poll?.id === pollId) {
        const voted = this.vote(event.poll, player)
        if (!voted) {
          return "VOTED_ALREADY"
        }
        return "VOTE_SUCCESS"
      }
    }

    return "POLL_NOT_FOUND"
  }

  private vote(poll: IGamePoll, player: IGameObjectPlayer): boolean {
    if (poll.votes.find((v) => v.id === player.id)) {
      return false
    }

    poll.votes.push({ id: player.id, userName: player.userName })
    return true
  }
}
