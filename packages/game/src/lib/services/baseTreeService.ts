import type { GameAddon, TreeService } from '../types'
import { TreeObject } from '../objects/treeObject'
import { getRandomInRange } from '../utils/random'

export class BaseTreeService implements TreeService {
  #treesPerfectAmount = 30
  #trees: TreeObject[] = []

  constructor(readonly addon: GameAddon) {}

  update() {
    if (this.#trees.length < this.#treesPerfectAmount) {
      this.#plant()
    }

    // remove dead trees
    this.#trees = this.#trees.filter((tree) => tree.health > 0)
  }

  init() {
    for (let i = 0; i < 20; i++) {
      const tree = new TreeObject({ addon: this.addon, x: getRandomInRange(0, 1000), y: this.addon.bottomY, size: getRandomInRange(50, 100) })
      this.addon.app.stage.addChild(tree)
      this.addon.addChild(tree)
      this.#trees.push(tree)
    }
  }

  #plant() {
    const tree = new TreeObject({ addon: this.addon, x: getRandomInRange(0, 1000), y: this.addon.bottomY, size: getRandomInRange(4, 8) })
    this.addon.app.stage.addChild(tree)
    this.addon.addChild(tree)
    this.#trees.push(tree)
  }
}
