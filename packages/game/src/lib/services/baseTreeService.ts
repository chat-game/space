import type { GameAddon, TreeService } from '../types'
import { TreeObject } from '../objects/treeObject'

export class BaseTreeService implements TreeService {
  treesPerfectAmount = 180

  constructor(readonly addon: GameAddon) {}

  create(data: { id: string, x: number, zIndex: number, treeType: '1' | '2' | '3' | '4' | '5', size: number, maxSize: number }) {
    const tree = new TreeObject({ id: data.id, addon: this.addon, x: data.x, y: this.addon.bottomY + 2, size: data.size, maxSize: data.maxSize, zIndex: data.zIndex, treeType: data.treeType })
    this.addon.app.stage.addChild(tree)
    this.addon.addChild(tree)
  }

  update() {}

  getNearestObstacle(x: number): TreeObject | undefined {
    // Only on right side + isObstacle
    const trees = this.addon.children
      .filter((obj) => obj.type === 'TREE' && obj.x > x) as TreeObject[]

    return trees.filter((obj) => obj.isAnObstacleToWagon)
      .sort((a, b) => a.x - b.x)[0]
  }
}
