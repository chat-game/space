import { createId } from '@paralleldrive/cuid2'
import {
  type IGameObject,
  type IGameObjectUnit,
  getRandomInRange,
} from '../../../../../../packages/api-sdk/src'
import { Inventory } from '../../common'
import { GameObject } from '../gameObject'
import { Stone } from '../stone'
import { Tree } from '../tree'

interface IUnitOptions {
  entity: IGameObject['entity']
  id?: string
  x: number
  y: number
  visual?: IGameObjectUnit['visual']
}

export class Unit extends GameObject implements IGameObjectUnit {
  public userName!: IGameObjectUnit['userName']
  public inventory!: Inventory
  public visual!: IGameObjectUnit['visual']
  public coins: IGameObjectUnit['coins']
  public dialogue!: IGameObjectUnit['dialogue']

  constructor({ entity, id, x, y, visual }: IUnitOptions) {
    const objectId = id ?? createId()

    super({ id: objectId, x, y, entity })

    this.initInventory()
    this.initVisual(visual)
    this.initDialogue()
    this.coins = 0
  }

  live() {
    this.handleMessages()

    if (this.script) {
      return this.script.live()
    }
  }

  public initInventory() {
    this.inventory = new Inventory({
      objectId: this.id,
      id: createId(),
      saveInDb: false,
    })
  }

  public initVisual(visual: IGameObjectUnit['visual'] | undefined) {
    this.visual = visual ?? {
      head: '1',
      hairstyle: 'CLASSIC',
      top: 'VIOLET_SHIRT',
    }
  }

  initDialogue() {
    this.dialogue = {
      messages: [],
    }
  }

  public addMessage(message: string) {
    const MAX_CHARS = 100
    const messagePrepared
      = message.trim().slice(0, MAX_CHARS)
      + (message.length > MAX_CHARS ? '...' : '')

    this.dialogue.messages.push({
      id: createId(),
      text: messagePrepared,
    })
  }

  public handleMessages() {
    const random = getRandomInRange(1, 200)
    if (random === 1) {
      this.dialogue.messages.splice(0, 1)
    }
  }

  public chopTree() {
    if (this.target instanceof Tree && this.target.state !== 'DESTROYED') {
      this.direction = 'RIGHT'
      this.state = 'CHOPPING'
      this.checkAndBreakTool('AXE')

      this.target.chop()
    }
  }

  public mineStone() {
    if (this.target instanceof Stone && this.target.state !== 'DESTROYED') {
      this.direction = 'RIGHT'
      this.state = 'MINING'
      this.checkAndBreakTool('PICKAXE')

      this.target.mine()
    }
  }

  checkAndBreakTool(type: 'AXE' | 'PICKAXE') {
    const tool = this.inventory.items.find((item) => item.type === type)
    if (tool) {
      // this.target.health -= 0.16
      const random = getRandomInRange(1, 40)
      if (random <= 1) {
        void this.inventory.checkAndBreakItem(tool, 1)
      }
    }
  }
}
