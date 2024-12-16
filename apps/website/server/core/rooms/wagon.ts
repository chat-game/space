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
        maxSize: getRandomInRange(75, 145),
        zIndex: getRandomInRange(-10, 1),
        variant: 'GREEN',
        treeType: this.getRandomTreeType(),
      })
    }
  }

  addPlayer(id: string, telegramId: string, x: number) {
    this.objects.push({
      type: 'PLAYER',
      id,
      telegramId,
      x,
      state: 'IDLE',
      health: 100,
      speedPerSecond: 70,
      size: 100,
      zIndex: 0,
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
    this.objects = this.objects.filter((o) => o.id !== id)
  }

  getRandomTreeType(): '1' | '2' | '3' | '4' | '5' {
    const items = ['1', '2', '3', '4', '5'] as const
    return items[Math.floor(Math.random() * items.length)] as '1' | '2' | '3' | '4' | '5'
  }
}
