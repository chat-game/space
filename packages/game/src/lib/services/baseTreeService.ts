import type { GameAddon, TreeService } from '../types'
import { TreeObject } from '../objects/treeObject'
import { getRandomInRange } from '../utils/random'

export class BaseTreeService implements TreeService {
  #treesPerfectAmount = 200
  #trees: TreeObject[] = []

  constructor(readonly addon: GameAddon) {}

  update() {
    const treesInArea = this.#treesInArea(this.addon.wagon.x, 2000)
    if (treesInArea < this.#treesPerfectAmount) {
      this.#plant(this.addon.wagon.x + 2500)
    }

    // remove dead trees
    this.#trees = this.#trees.filter((tree) => tree.health > 0)
  }

  init() {
    for (let i = 0; i < 50; i++) {
      const x = this.addon.wagon.x + getRandomInRange(-200, 2000)
      const tree = new TreeObject({ addon: this.addon, x, y: this.addon.bottomY, size: getRandomInRange(50, 100) })
      this.addon.app.stage.addChild(tree)
      this.addon.addChild(tree)
      this.#trees.push(tree)
    }
  }

  #plant(x: number) {
    const random = getRandomInRange(0, 120)
    if (random !== 1) {
      return
    }

    if (this.addon.wagon.state === 'IDLE') {
      return
    }

    const tree = new TreeObject({ addon: this.addon, x, y: this.addon.bottomY, size: getRandomInRange(4, 8) })
    this.addon.app.stage.addChild(tree)
    this.addon.addChild(tree)
    this.#trees.push(tree)
  }

  #treesInArea(x: number, offset: number) {
    return this.#trees.filter((tree) => {
      return tree.x > x - offset && tree.x < x + offset
    }).length
  }
}
