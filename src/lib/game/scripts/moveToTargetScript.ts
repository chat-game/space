import type { GameObject } from '../objects'
import { Script } from './script'
import type { IGameObject } from '$lib/game/types'

interface IMoveToRandomTargetScriptOptions {
  object: GameObject
  target: IGameObject
}

export class MoveToTargetScript extends Script {
  constructor({ target, object }: IMoveToRandomTargetScriptOptions) {
    super({ object })

    this.tasks = [this.setTarget(target), this.runToTarget()]
    this.isInterruptible = true
  }
}
