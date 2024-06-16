import type { Poll } from '../common'
import { BaseAction } from './baseAction'
import { ANSWER } from '$lib/game/scenes/services/actionService'

interface IVoteActionOptions {
  poll: Poll
}

export class VoteAction extends BaseAction {
  #poll: Poll
  readonly #id: string

  constructor({ poll }: IVoteActionOptions) {
    super({ command: 'go', commandDescription: '!go' })

    this.#id = poll.generatePollId()

    this.command = `go ${this.#id}`
    this.commandDescription = `!go ${this.#id}`

    this.#poll = poll
  }

  async live(player) {
    const isSuccess = this.poll.vote(player)
    if (!isSuccess) {
      return ANSWER.ALREADY_VOTED_ERROR
    }

    return ANSWER.VOTED_OK
  }
}
