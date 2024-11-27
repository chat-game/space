import type { GameObject, Script, Task } from '../types'
import { createId } from '@paralleldrive/cuid2'

interface BaseScriptOptions {
  object: GameObject
}

export class BaseScript implements Script {
  public id: string
  public tasks!: Script['tasks']
  public isInterruptible = false

  public object!: GameObject

  constructor({ object }: BaseScriptOptions) {
    this.id = createId()
    this.object = object
  }

  live() {
    const activeTask = this.getActiveTask()
    if (!activeTask) {
      const nextTask = this.getNextIdleTask()
      if (!nextTask) {
        return this.markScriptAsFinished()
      }

      return this.markTaskAsActive(nextTask)
    }

    return activeTask.live()
  }

  getActiveTask() {
    return this.tasks.find((t) => t.status === 'ACTIVE')
  }

  getNextIdleTask() {
    return this.tasks.find((t) => t.status === 'IDLE')
  }

  markTaskAsActive(task: Task) {
    task.status = 'ACTIVE'
  }

  markTaskAsDone() {
    const activeTask = this.getActiveTask()
    if (!activeTask) {
      return
    }

    activeTask.status = 'DONE'
  }

  markScriptAsFinished() {
    this.object.script = undefined
  }

  setTarget(target: GameObject): Task {
    return {
      id: createId(),
      status: 'IDLE',
      live: () => {
        this.object.target = target
        this.object.state = 'MOVING'
        this.markTaskAsDone()
      },
    }
  }

  runToTarget(): Task {
    return {
      id: createId(),
      status: 'IDLE',
      live: () => {
        const isMoving = this.object.move()
        if (!isMoving) {
          this.markTaskAsDone()
        }
      },
    }
  }
}
