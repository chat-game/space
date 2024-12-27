import type { CharacterEditionWithCharacter, GameObject, GameObjectTree, GameObjectWagon } from '@chat-game/types'
import type { BaseChunk } from './wagon/chunk/baseChunk'
import { createId } from '@paralleldrive/cuid2'
import { sendMessage } from '~~/server/api/websocket'
import { getRandomInRange } from '~/utils/random'
import { BaseRoom } from './base'
import { ForestChunk } from './wagon/chunk/forestChunk'

const logger = useLogger('wagon:room')

interface WagonRoomOptions {
  id: string
  token: string
}

export class WagonRoom extends BaseRoom {
  objects: GameObject[] = []
  chunks: BaseChunk[] = []

  wagon!: GameObject & GameObjectWagon
  wagonObstacle: GameObject | null = null
  wagonViewDistance = 4500
  wagonViewNearDistance = 200

  constructor({ id, token }: WagonRoomOptions) {
    super({ id, token, type: 'WAGON' })

    this.initWagon()
    this.initFirstChunk()

    setInterval(() => {
      this.update()
    }, 250)

    setInterval(() => {
      logger.log(`Chunks on Wagon Room: ${this.chunks.length}`, `Objects on Wagon Room: ${this.objects.length}`)
    }, 60 * 60 * 1000)
  }

  update() {
    this.checkIfObstacleIsClose()
    this.setNearestTarget()
    this.createNewChunks()
    this.removeChunksBeforeWagon()
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

  initFirstChunk() {
    const newForest = new ForestChunk({ startX: 0, endX: getRandomInRange(2000, 3000) })
    this.chunks.push(newForest)

    this.objects.push(...newForest.objects)
  }

  initNextChunk() {
    const previousChunk = this.chunks[this.chunks.length - 1]
    if (!previousChunk) {
      return
    }

    const newForest = new ForestChunk({ startX: previousChunk.endX, endX: previousChunk.endX + getRandomInRange(2000, 3000) })
    this.chunks.push(newForest)

    this.objects.push(...newForest.objects)

    for (const obj of newForest.objects) {
      if (obj.type === 'TREE') {
        sendMessage({ type: 'NEW_TREE', data: { ...obj } }, this.token)
      }
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

  createNewChunks() {
    // when wagon reach middle of this chunk - create new chunk
    const lastChunk = this.chunks[this.chunks.length - 1]
    if (!lastChunk) {
      return
    }

    const middleX = (lastChunk.startX + lastChunk.endX) / 2
    if (this.wagon.x > middleX) {
      this.initNextChunk()
    }
  }

  checkIfObstacleIsClose() {
    const availableTree = this.getNearestObstacle(this.wagon.x)
    if (!availableTree) {
      return
    }

    // if is close - wagon need to wait
    if (Math.abs(this.wagon.x - availableTree.x) < this.wagonViewNearDistance + 50) {
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

    const targetX = availableTree.x - this.wagonViewNearDistance

    sendMessage({ type: 'NEW_WAGON_TARGET', data: { x: targetX } }, this.token)

    this.wagon.x = targetX
    this.wagonObstacle = availableTree
    this.wagon.state = 'MOVING'
  }

  getNearestObstacle(x: number): GameObject | undefined {
    // Only on right side
    const trees = this.objects.filter((obj) => obj.type === 'TREE' && obj.x > x) as (GameObject & GameObjectTree)[]
    if (!trees.length) {
      return
    }

    // isObstacle
    return trees.filter((obj) => obj.zIndex >= -5).sort((a, b) => a.x - b.x)[0]
  }

  removeChunksBeforeWagon() {
    const chunksToRemove = this.chunks.filter((c) => c.endX < this.wagon.x - this.wagonViewDistance)
    if (!chunksToRemove.length) {
      return
    }

    for (const chunk of chunksToRemove) {
      for (const obj of chunk.objects) {
        this.removeObject(obj.id)
      }

      this.chunks = this.chunks.filter((c) => c !== chunk)
    }
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

  getRandomTreeType(): '1' | '2' | '3' | '4' | '5' {
    const items = ['1', '2', '3', '4', '5'] as const
    return items[Math.floor(Math.random() * items.length)] as '1' | '2' | '3' | '4' | '5'
  }

  treesInArea(x: number, offset: number) {
    return this.objects.filter((obj) => obj.type === 'TREE' && obj.x > x && obj.x < x + offset).length
  }
}
