import { BaseScript } from './baseScript'
import type { GameObject } from '../types'

interface IMoveToRandomTargetScriptOptions {
  object: GameObject
  target: GameObject
}

export class MoveToTargetScript extends BaseScript {
  constructor({ target, object }: IMoveToRandomTargetScriptOptions) {
    super({ object })

    this.tasks = [this.setTarget(target), this.runToTarget()]
    this.isInterruptible = true
  }
}
