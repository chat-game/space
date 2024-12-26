import type { CharacterEditionWithCharacter, GameObject, GameObjectTree, GameObjectWagon } from '@chat-game/types'
import { createId } from '@paralleldrive/cuid2'
import { sendMessage } from '~~/server/api/websocket'
import { getRandomInRange } from '~/utils/random'
import { BaseRoom } from './base'

interface WagonRoomOptions {
  id: string
  token: string
}

export class WagonRoom extends BaseRoom {
  objects: GameObject[] = []
  wagon!: GameObject & GameObjectWagon
  wagonObstacle: GameObject | null = null

  constructor({ id, token }: WagonRoomOptions) {
    super({ id, token, type: 'WAGON' })

    this.initWagon()
    this.initTrees()

    setInterval(() => {
      this.update()
    }, 250)
  }

  update() {
    this.checkIfObstacleIsClose()
    this.setNearestTarget()
    this.plantTreesNearWagon()
    this.removeTreesBeforeWagon()
  }

  initWagon() {
    this.wagon = {
      type: 'WAGON',
      id: createId(),
      x: 300,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 20,
      size: 100,
      zIndex: -5,
    }
    this.objects.push(this.wagon)
  }

  initTrees() {
    for (let i = 0; i < 50; i++) {
      const x = this.wagon.x + getRandomInRange(-200, 2500)
      this.objects.push({
        type: 'TREE',
        id: createId(),
        x,
        state: 'IDLE',
        health: 100,
        speedPerSecond: 0,
        size: 75,
        maxSize: getRandomInRange(100, 175),
        zIndex: getRandomInRange(-10, 1),
        variant: 'GREEN',
        treeType: this.getRandomTreeType(),
      })
    }
  }

  addPlayer(data: { id: string, telegramId: string, x: number, character: CharacterEditionWithCharacter }) {
    this.objects.push({
      type: 'PLAYER',
      id: data.id,
      telegramId: data.telegramId,
      x: data.x,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 70,
      size: 100,
      zIndex: 0,
      character: data.character,
    })
  }

  addTree(data: { id: string, x: number, zIndex: number, treeType: '1' | '2' | '3' | '4' | '5', maxSize: number }) {
    this.objects.push({
      type: 'TREE',
      id: data.id,
      x: data.x,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 0,
      size: 75,
      maxSize: data.maxSize,
      zIndex: data.zIndex,
      variant: 'GREEN',
      treeType: data.treeType,
    })
  }

  removeObject(id: string) {
    // if wagon obstacle - remove it
    if (this.wagonObstacle?.id === id) {
      this.wagonObstacle = null
    }

    this.objects = this.objects.filter((o) => o.id !== id)
  }

  getRandomTreeType(): '1' | '2' | '3' | '4' | '5' {
    const items = ['1', '2', '3', '4', '5'] as const
    return items[Math.floor(Math.random() * items.length)] as '1' | '2' | '3' | '4' | '5'
  }

  checkIfObstacleIsClose() {
    const availableTree = this.getNearestObstacle(this.wagon.x)
    if (!availableTree) {
      return
    }

    // if is close - wagon need to wait
    if (Math.abs(this.wagon.x - availableTree.x) < 250) {
      this.wagon.state = 'IDLE'
    }
  }

  setNearestTarget() {
    if (this.wagon.state === 'MOVING' || this.wagonObstacle) {
      return
    }

    const availableTree = this.getNearestObstacle(this.wagon.x)
    if (!availableTree) {
      return
    }

    const targetX = availableTree.x - 200

    sendMessage({ type: 'NEW_WAGON_TARGET', data: { x: targetX } }, this.token)

    this.wagon.x = targetX
    this.wagonObstacle = availableTree
    this.wagon.state = 'MOVING'
  }

  getNearestObstacle(x: number): GameObject | undefined {
    // Only on right side
    const trees = this.objects.filter((obj) => obj.type === 'TREE' && obj.x > x) as (GameObject & GameObjectTree)[]
    // isObstacle
    return trees.filter((obj) => obj.zIndex >= -5).sort((a, b) => a.x - b.x)[0]
  }

  plantTreesNearWagon() {
    const treesInArea = this.treesInArea(this.wagon.x, 4500)
    if (treesInArea < 50) {
      const newTreeX = this.wagon.x + getRandomInRange(1500, 4400)
      this.plant(newTreeX)
    }
  }

  removeTreesBeforeWagon() {
    const treesToRemove = this.objects.filter((obj) => obj.type === 'TREE' && obj.x < this.wagon.x - 1000)
    treesToRemove.forEach((tree) => this.removeObject(tree.id))
  }

  plant(x: number) {
    const tree = {
      id: createId(),
      x,
      zIndex: getRandomInRange(-10, 1),
      treeType: this.getRandomTreeType(),
      size: getRandomInRange(4, 8),
      maxSize: getRandomInRange(100, 175),
    }

    this.addTree(tree)
    sendMessage({ type: 'NEW_TREE', data: { ...tree } }, this.token)
  }

  treesInArea(x: number, offset: number) {
    return this.objects.filter((obj) => obj.type === 'TREE').filter((tree) => {
      return tree.x > x && tree.x < x + offset
    }).length
  }
}
