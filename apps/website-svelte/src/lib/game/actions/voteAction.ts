import { ANSWER } from '$lib/game/services/action/answer'
import type { Poll } from '$lib/game/common/poll'
import type { GameObjectPlayer } from '$lib/game/types'
import type { GameAction } from '$lib/game/actions/interface'

interface IVoteActionOptions {
  poll: Poll
}

export class VoteAction implements GameAction {
  command: GameAction['command']
  commandDescription: GameAction['commandDescription']
  #poll: Poll
  readonly #id: string

  constructor({ poll }: IVoteActionOptions) {
    this.#id = poll.generatePollId()

    this.command = `go ${this.#id}`
    this.commandDescription = `!go ${this.#id}`

    this.#poll = poll
  }

  async live(player: GameObjectPlayer) {
    const isSuccess = this.#poll.vote(player)
    if (!isSuccess) {
      return ANSWER.ALREADY_VOTED_ERROR
    }

    return ANSWER.VOTED_OK
  }
}
