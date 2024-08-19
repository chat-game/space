import { Script } from './script'
import type { GameObject } from '$lib/game/types'

interface IMoveToRandomTargetScriptOptions {
  object: GameObject
  target: GameObject
}

export class MoveToTargetScript extends Script {
  constructor({ target, object }: IMoveToRandomTargetScriptOptions) {
    super({ object })

    this.tasks = [this.setTarget(target), this.runToTarget()]
    this.isInterruptible = true
  }
}
