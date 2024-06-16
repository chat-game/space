import type { IGameAction } from '$lib/game/types'

interface IActionOptions {
  command: IGameAction['command']
  commandDescription: IGameAction['commandDescription']
}

export class BaseAction implements IGameAction {
  public command: string
  public commandDescription: string

  constructor({ command, commandDescription }: IActionOptions) {
    this.command = command
    this.commandDescription = commandDescription
  }
}
