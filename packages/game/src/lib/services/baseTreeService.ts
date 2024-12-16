import type { GameAddon, GameObjectTree, TreeService } from '../types'
import { createId } from '@paralleldrive/cuid2'
import { TreeObject } from '../objects/treeObject'
import { getRandomInRange } from '../utils/random'

export class BaseTreeService implements TreeService {
  treesPerfectAmount = 200

  constructor(readonly addon: GameAddon) {}

  create(data: { id: string, x: number, zIndex: number, treeType: '1' | '2' | '3' | '4' | '5', size: number, maxSize: number }) {
    const tree = new TreeObject({ id: data.id, addon: this.addon, x: data.x, y: this.addon.bottomY, size: data.size, maxSize: data.maxSize, zIndex: data.zIndex, treeType: data.treeType })
    this.addon.app.stage.addChild(tree)
    this.addon.addChild(tree)
  }

  update() {
    if (!this.addon.wagon) {
      return
    }

    const treesInArea = this.treesInArea(this.addon.wagon.x, 2500)
    if (treesInArea < this.treesPerfectAmount) {
      this.plant(this.addon.wagon.x + 2500)
    }
  }

  getNearestObstacle(x: number): TreeObject | undefined {
    // Only on right side + isObstacle
    const trees = this.addon.children
      .filter((obj) => obj.type === 'TREE' && obj.x > x) as TreeObject[]

    return trees.filter((obj) => obj.isAnObstacleToWagon)
      .sort((a, b) => a.x - b.x)[0]
  }

  plant(x: number) {
    const random = getRandomInRange(0, 120)
    if (random !== 1) {
      return
    }

    if (this.addon.wagon?.state === 'IDLE') {
      return
    }

    const tree = {
      id: createId(),
      x,
      zIndex: getRandomInRange(-10, 1),
      treeType: this.getNewType(),
      size: getRandomInRange(4, 8),
      maxSize: getRandomInRange(100, 175),
    }

    this.addon.websocketService.send({ type: 'NEW_TREE', data: { x: tree.x, id: tree.id, zIndex: tree.zIndex, treeType: tree.treeType, maxSize: tree.maxSize } })
  }

  getNewType(): GameObjectTree['treeType'] {
    const items = ['1', '2', '3', '4', '5'] as const
    return items[Math.floor(Math.random() * items.length)] as GameObjectTree['treeType']
  }

  treesInArea(x: number, offset: number) {
    return this.addon.children.filter((obj) => obj.type === 'TREE').filter((tree) => {
      return tree.x > x - offset && tree.x < x + offset
    }).length
  }
}
