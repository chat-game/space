import type { Player } from '../objects/units'
import type { IGameAction, IGameActionResponse } from '$lib/game/types'

interface IActionOptions {
  command: IGameAction['command']
  commandDescription: IGameAction['commandDescription']
}

export class Action implements IGameAction {
  public command: string
  public commandDescription: string

  public live!: (
    player: Player,
    params: string[],
  ) => Promise<IGameActionResponse>

  constructor({ command, commandDescription }: IActionOptions) {
    this.command = command
    this.commandDescription = commandDescription
  }
}
