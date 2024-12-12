import type { GameObject } from '@chat-game/types'
import { createId } from '@paralleldrive/cuid2'
import { getRandomInRange } from '~/utils/random'
import { BaseRoom } from './base'

interface WagonRoomOptions {
  id: string
  token: string
}

export class WagonRoom extends BaseRoom {
  objects: GameObject[] = []

  constructor({ id, token }: WagonRoomOptions) {
    super({ id, token, type: 'WAGON' })

    this.initWagon()
    this.initTrees()
  }

  initWagon() {
    this.objects.push({
      type: 'WAGON',
      id: createId(),
      x: 300,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 20,
      size: 100,
      zIndex: -5,
    })
  }

  initTrees() {
    const wagon = this.objects.find((obj) => obj.type === 'WAGON')
    if (!wagon) {
      return
    }

    for (let i = 0; i < 50; i++) {
      const x = wagon?.x + getRandomInRange(-200, 2500)
      this.objects.push({
        type: 'TREE',
        id: createId(),
        x,
        state: 'IDLE',
        health: 100,
        speedPerSecond: 0,
        size: 75,
        zIndex: getRandomInRange(-10, 1),
      })
    }
  }

  addPlayer(id: string, x: number) {
    this.objects.push({
      type: 'PLAYER',
      id,
      x,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 70,
      size: 100,
      zIndex: 0,
    })
  }

  addTree(id: string, x: number, zIndex: number) {
    this.objects.push({
      type: 'TREE',
      id,
      x,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 0,
      size: 75,
      zIndex,
    })
  }

  removeObject(id: string) {
    this.objects = this.objects.filter((o) => o.id !== id)
  }
}
