import type { GameObject } from '@chat-game/types'
import type { Peer } from 'crossws'
import type { Room } from '~~/types/room'
import type { Chunk } from './types'
import { createId } from '@paralleldrive/cuid2'
import { ForestChunk } from './chunk/forestChunk'
import { VillageChunk } from './chunk/villageChunk'

interface BaseRoomOptions {
  id: string
  token: string
  type: Room['type']
}

export class BaseRoom implements Room {
  id: string
  token: string
  type: Room['type']
  server: { ws: WebSocket, peer: Peer | null }
  peers: string[] = []
  objects: GameObject[] = []
  chunks: Chunk[] = []

  constructor({ id, token, type }: BaseRoomOptions) {
    this.id = id
    this.token = token
    this.type = type

    const { public: publicEnv } = useRuntimeConfig()

    this.server = {
      ws: new WebSocket(publicEnv.websocketUrl),
      peer: null,
    }

    this.connectServer()
  }

  initServerSocket() {
    const { public: publicEnv } = useRuntimeConfig()

    this.server = {
      ws: new WebSocket(publicEnv.websocketUrl),
      peer: null,
    }
  }

  connectServer() {
    if (this.server.ws) {
      this.server.ws.removeEventListener('open', this.onopen.bind(this))
      this.server.ws.removeEventListener('close', this.onclose.bind(this))
    }

    this.server.ws.addEventListener('open', this.onopen.bind(this))
    this.server.ws.addEventListener('close', this.onclose.bind(this))
  }

  onopen() {
    const prepearedMessage = JSON.stringify({
      id: createId(),
      type: 'CONNECT',
      data: {
        client: 'SERVER',
        id: this.id,
        token: this.token,
      },
    })
    this.server.ws.send(prepearedMessage)
  }

  onclose() {
    this.initServerSocket()
    this.connectServer()
  }

  static async updateChunksInStorage(roomId: string, chunks: Chunk[]) {
    const chunksKey = `room:${roomId}:chunks`
    useStorage('redis').setItem(chunksKey, chunks)
  }

  async getChunksFromStorage() {
    const chunksKey = `room:${this.id}:chunks`
    const chunks = await useStorage<Chunk[]>('redis').getItem(chunksKey)
    if (!chunks) {
      return []
    }

    return chunks
  }

  async initChunks() {
    const chunksInStorage = await this.getChunksFromStorage()
    if (chunksInStorage.length) {
      for (const chunk of chunksInStorage) {
        if (chunk.type === 'FOREST') {
          const newChunk = new ForestChunk(chunk)
          this.chunks.push(newChunk)
          this.objects.push(...newChunk.objects)
          continue
        }

        if (chunk.type === 'VILLAGE') {
          const newChunk = new VillageChunk(chunk)
          this.chunks.push(newChunk)
          this.objects.push(...newChunk.objects)
          continue
        }
      }
    }
  }
}
