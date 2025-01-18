import type { CharacterEditionWithCharacter, GameObject, GameObjectTree, GameObjectWagon } from '@chat-game/types'
import type { Chunk } from './types'
import { createId } from '@paralleldrive/cuid2'
import { sendMessage } from '~~/server/api/websocket'
import { getRandomInRange } from '~/utils/random'
import { BaseRoom } from './base'
import { ForestChunk } from './chunk/forestChunk'
import { VillageChunk } from './chunk/villageChunk'

const logger = useLogger('wagon:room')

interface GenerateWagonRoomOptions {
  roomId: string
  chunksCount: number
}

interface WagonRoomOptions {
  id: string
  token: string
}

export class WagonRoom extends BaseRoom {
  wagon!: GameObject & GameObjectWagon
  wagonObstacle: GameObject | null = null
  wagonViewDistance = 4500
  wagonViewNearDistance = 200

  status: 'ACTIVE' | 'FINISHED' = 'ACTIVE'

  constructor({ id, token }: WagonRoomOptions) {
    super({ id, token, type: 'WAGON' })

    this.init()
  }

  update() {
    this.checkIfObstacleIsClose()
    this.setNearestTarget()
    this.closeRoomOnFinish()
    // this.createNewChunks()
    // this.removeChunksBeforeWagon()
  }

  async init() {
    await this.initChunks()
    await this.initWagon()

    setInterval(() => {
      this.update()
    }, 250)

    setInterval(() => {
      logger.log(`Chunks on Wagon Room: ${this.chunks.length}`, `Objects on Wagon Room: ${this.objects.length}`)
    }, 60 * 60 * 1000)
  }

  async initWagon() {
    const wagonInStorage = await this.getWagonFromStorage()
    if (!wagonInStorage) {
      return
    }

    this.wagon = wagonInStorage
    this.objects.push(this.wagon)
  }

  static async updateWagonInStorage(roomId: string, wagon: GameObject & GameObjectWagon) {
    const wagonKey = `room:${roomId}:wagon`
    useStorage('redis').setItem(wagonKey, wagon)
  }

  async getWagonFromStorage() {
    const wagonKey = `room:${this.id}:wagon`
    const wagon = await useStorage<GameObject & GameObjectWagon>('redis').getItem(wagonKey)
    if (!wagon) {
      return null
    }

    return wagon
  }

  async reboot() {
    await WagonRoom.generate({ chunksCount: 6, roomId: this.id })

    sendMessage({ type: 'ROOM_DESTROYED', data: { id: this.id } }, this.token)

    this.status = 'FINISHED'
  }

  closeRoomOnFinish() {
    if (this.status !== 'ACTIVE') {
      return
    }

    // if wagon is on last chunk - close room
    const lastChunk = this.chunks[this.chunks.length - 1]
    if (!lastChunk) {
      return
    }

    if (this.wagon.x >= lastChunk.startX - 350) {
      void this.reboot()
    }
  }

  initFirstChunk() {
    if (!this.wagon) {
      return
    }

    const width = getRandomInRange(3000, 4000)
    const startX = Math.floor(this.wagon.x - width / 2)
    const endX = Math.floor(this.wagon.x + width / 2)

    const newForest = new ForestChunk({ startX, endX })
    this.chunks.push(newForest)
    this.objects.push(...newForest.objects)

    BaseRoom.updateChunksInStorage(this.id, this.chunks)
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

    BaseRoom.updateChunksInStorage(this.id, this.chunks)
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

  addTree(data: {
    id: string
    x: number
    zIndex: number
    treeType: GameObjectTree['treeType']
    variant: GameObjectTree['variant']
    maxSize: number
  }) {
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
      variant: data.variant,
      treeType: data.treeType,
    })
  }

  removeObject(id: string) {
    // if wagon obstacle - remove it
    if (this.wagonObstacle?.id === id) {
      this.wagonObstacle = null
    }

    this.objects = this.objects.filter((o) => o.id !== id)

    // Find and delete object from chunks
    for (const chunk of this.chunks) {
      chunk.objects = chunk.objects.filter((o) => o.id !== id)
    }
    BaseRoom.updateChunksInStorage(this.id, this.chunks)
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

    if (this.wagon.state === 'IDLE') {
      return
    }

    // if is close - wagon need to wait
    if (Math.abs(this.wagon.x - availableTree.x) < this.wagonViewNearDistance + 50) {
      this.wagon.state = 'IDLE'

      WagonRoom.updateWagonInStorage(this.id, this.wagon)
    }
  }

  setNearestTarget() {
    if (this.wagon.state === 'MOVING' || this.wagonObstacle) {
      return
    }

    const availableTree = this.getNearestObstacle(this.wagon.x)
    if (!availableTree) {
      void this.reboot()
      return
    }

    const targetX = availableTree.x - this.wagonViewNearDistance

    sendMessage({ type: 'NEW_WAGON_TARGET', data: { x: targetX } }, this.token)

    this.wagonObstacle = availableTree
    this.wagon.x = targetX
    this.wagon.state = 'MOVING'

    WagonRoom.updateWagonInStorage(this.id, this.wagon)
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

      BaseRoom.updateChunksInStorage(this.id, this.chunks)
    }
  }

  treesInArea(x: number, offset: number) {
    return this.objects.filter((obj) => obj.type === 'TREE' && obj.x > x && obj.x < x + offset).length
  }

  static async generate(options: GenerateWagonRoomOptions) {
    if (options.chunksCount <= 0) {
      return
    }

    const startX = 1000
    const chunks: Chunk[] = []

    const firstChunk = new VillageChunk({
      startX,
      endX: startX + 1000,
      id: createId(),
    })
    chunks.push(firstChunk)

    for (let i = 0; i < options.chunksCount; i++) {
      const previousChunk = chunks[chunks.length - 1]
      if (!previousChunk) {
        continue
      }

      const startX = previousChunk.endX + 1

      const forestChunk = new ForestChunk({
        startX,
        endX: startX + getRandomInRange(2000, 2500),
        id: createId(),
      })
      chunks.push(forestChunk)
    }

    const previousChunk = chunks[chunks.length - 1]
    if (!previousChunk) {
      return
    }

    const finalChunk = new VillageChunk({
      startX: previousChunk.endX + 1,
      endX: previousChunk.endX + 1000,
      id: createId(),
    })
    chunks.push(finalChunk)

    // Wagon
    const wagon = {
      type: 'WAGON',
      id: createId(),
      x: firstChunk.startX + 200,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 20,
      size: 100,
      zIndex: -5,
    } as GameObject & GameObjectWagon

    WagonRoom.updateWagonInStorage(options.roomId, wagon)
    BaseRoom.updateChunksInStorage(options.roomId, chunks)
  }
}
