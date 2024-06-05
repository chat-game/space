import { ANSWER } from "../../../../../packages/api-sdk/src/lib/actionAnswer"
import type { Poll } from "../common"
import type { Player } from "../objects/units"
import { Action } from "./action"

interface IVoteActionOptions {
  poll: Poll
}

export class VoteAction extends Action {
  private poll: Poll
  private readonly id: string

  constructor({ poll }: IVoteActionOptions) {
    super({ command: "go", commandDescription: "!go" })

    this.id = poll.generatePollId()

    this.command = `go ${this.id}`
    this.commandDescription = `!go ${this.id}`

    this.poll = poll
    this.live = this.initLive
  }

  async initLive(player: Player) {
    const isSuccess = this.poll.vote(player)
    if (!isSuccess) {
      return ANSWER.ALREADY_VOTED_ERROR
    }

    return ANSWER.VOTED_OK
  }
}
