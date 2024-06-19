import { Campfire } from '../../objects/buildings/campfire'
import { ConstructionArea } from '../../objects/buildings/constructionArea'
import { Store } from '../../objects/buildings/store'
import { WagonStop } from '../../objects/buildings/wagonStop'
import { Warehouse } from '../../objects/buildings/warehouse'
import { BuildScript } from '../../scripts/buildScript'
import { ChopTreeScript } from '../../scripts/chopTreeScript'
import { MoveToTargetScript } from '../../scripts/moveToTargetScript'
import { PlaceItemInWarehouseScript } from '../../scripts/placeItemInWarehouseScript'
import { PlantNewTreeScript } from '../../scripts/plantNewTreeScript'
import { BaseChunk } from './baseChunk'
import { getRandomInRange } from '$lib/random'
import type {
  Game,
  GameObjectFlag,
} from '$lib/game/types'
import { Farmer } from '$lib/game/objects/units/farmer'
import { Courier } from '$lib/game/objects/units/courier'
import { TreeObject } from '$lib/game/objects/treeObject'
import { FlagObject } from '$lib/game/objects/flagObject'
import { StoneObject } from '$lib/game/objects/stoneObject'
import type {
  IGameChunkTheme,
  IGameVillageChunk,
} from '$lib/game/services/chunk/interface'

interface VillageChunkOptions {
  game: Game
  width: number
  height: number
  center: IGameVillageChunk['center']
  theme: IGameChunkTheme
}

export class VillageChunk extends BaseChunk implements IGameVillageChunk {
  constructor({ width, height, center, theme, game }: VillageChunkOptions) {
    super({ title: '', type: 'VILLAGE', theme, width, height, center, game })

    this.title = this.#getRandomTitle()

    this.#initFlags('RESOURCE', 80)
    // this.initFlags("MOVEMENT", 30)
    this.#initTrees(30)
    this.#initStones(5)
    this.#initCourier(1)
    this.#initFarmer(1)
    this.#initBuildings()
  }

  live() {
    super.live()

    const objectsOfThisVillage = this.game.children.filter((obj) => obj.chunkId === this.id)
    for (const object of objectsOfThisVillage) {
      if (object instanceof Farmer && !object.script) {
        this.addTaskToFarmer(object)
        continue
      }

      if (object instanceof Courier && !object.script) {
        this.addTaskToCourier(object)
      }
    }
  }

  checkIfNeedToPlantTree() {
    const treesNow = this.game.children.filter(
      (t) => t instanceof TreeObject && t.chunkId === this.id && t.state !== 'DESTROYED',
    )
    if (treesNow.length < 40) {
      return this.#getRandomEmptyResourceFlagInVillage()
    }
  }

  plantNewTree(flag: FlagObject) {
    const tree = new TreeObject({
      game: this.game,
      x: flag.x,
      y: flag.y,
      resource: 1,
      size: 12,
      health: 20,
      theme: this.area.theme,
      chunkId: this.id,
    })

    flag.target = tree
    flag.isReserved = false
    tree.init()
  }

  getTreesAmount() {
    return this.game.children.filter(
      (obj) => obj instanceof TreeObject && obj.chunkId === this.id && obj.state !== 'DESTROYED',
    ).length
  }

  checkIfThereAreNotEnoughTrees() {
    const max = this.#getResourceFlagInVillageAmount()
    const now = this.getTreesAmount()

    return now < max / 3
  }

  addTaskToCourier(object: Courier) {
    const random = getRandomInRange(1, 500)
    if (random !== 1) {
      return
    }

    // Need to build Store
    const warehouse = this.game.chunkService.chunk?.warehouse
    const store = this.game.chunkService.chunk?.store
    const wood = warehouse?.inventory.items.find((item) => item.type === 'WOOD')
    if (wood?.amount && wood.amount >= 25 && !store) {
      // Let's build!
      const target = this.game.chunkService.chunk?.constructionArea
      if (!target) {
        return
      }

      const buildFunc = (): boolean => {
        warehouse?.inventory.reduceOrDestroyItem('WOOD', 25)
        this.#buildStore()

        return true
      }
      object.script = new BuildScript({
        object,
        target,
        buildFunc,
      })

      return
    }

    // If unit have smth in inventory
    const item = object.inventory.checkIfAlreadyHaveItem('WOOD')
    if (item) {
      const target = this.game.chunkService.chunk?.warehouse
      if (!target) {
        return
      }

      const placeItemFunc = () => {
        if (object.target instanceof Warehouse) {
          void object.target.inventory.addOrCreateItem(item.type, item.amount)
          void object.inventory.destroyItem(item.id)
        }
      }
      object.script = new PlaceItemInWarehouseScript({
        object,
        target,
        placeItemFunc,
      })

      return
    }

    if (this.availableTree) {
      const chopTreeFunc = (): boolean => {
        object.chopTree()
        if (!object.target || object.target.state === 'DESTROYED') {
          object.state = 'IDLE'
          if (object.target instanceof TreeObject) {
            void object.inventory.addOrCreateItem(
              'WOOD',
              object.target?.resource,
            )
          }
          return true
        }
        return false
      }

      object.script = new ChopTreeScript({
        object,
        target: this.availableTree,
        chopTreeFunc,
      })

      return
    }

    const target = this.#getRandomMovementFlagInVillage()
    if (!target) {
      return
    }
    object.script = new MoveToTargetScript({
      object,
      target,
    })
  }

  addTaskToFarmer(object: Farmer) {
    const target = this.checkIfNeedToPlantTree()
    if (target) {
      const plantNewTreeFunc = () => {
        this.plantNewTree(target)
      }

      object.script = new PlantNewTreeScript({
        object,
        target,
        plantNewTreeFunc,
      })
      return
    }

    // No Trees needed?
    const random = getRandomInRange(1, 300)
    if (random <= 1) {
      const target = this.#getRandomMovementFlagInVillage()
      if (!target) {
        return
      }
      object.script = new MoveToTargetScript({
        object,
        target,
      })
    }
  }

  #initFlag(variant: GameObjectFlag['variant']) {
    const randomPoint = this.randomPoint
    new FlagObject({
      game: this.game,
      chunkId: this.id,
      variant,
      x: randomPoint.x,
      y: randomPoint.y,
    }).init()
  }

  #initFlags(variant: GameObjectFlag['variant'], count: number) {
    for (let i = 0; i < count; i++) {
      this.#initFlag(variant)
    }
  }

  #initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.#getRandomEmptyResourceFlagInVillage()
      if (flag) {
        const size = getRandomInRange(65, 85)
        const tree = new TreeObject({
          game: this.game,
          x: flag.x,
          y: flag.y,
          size,
          resource: 1,
          health: 20,
          theme: this.area.theme,
          chunkId: this.id,
        })
        flag.target = tree
        tree.init()
      }
    }
  }

  #initStones(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.#getRandomEmptyResourceFlagInVillage()
      if (flag) {
        const stone = new StoneObject({
          game: this.game,
          x: flag.x,
          y: flag.y,
          resource: 1,
          chunkId: this.id,
        })
        flag.target = stone
        stone.init()
      }
    }
  }

  #initCourier(count = 1) {
    for (let i = 0; i < count; i++) {
      const randomPoint = this.randomPoint
      new Courier({
        game: this.game,
        x: randomPoint.x,
        y: randomPoint.y,
        chunkId: this.id,
      }).init()
    }
  }

  #initFarmer(count = 1) {
    for (let i = 0; i < count; i++) {
      const randomPoint = this.randomPoint
      new Farmer({
        game: this.game,
        x: randomPoint.x,
        y: randomPoint.y,
        chunkId: this.id,
      }).init()
    }
  }

  #initBuildings() {
    new Campfire({
      game: this.game,
      x: this.center.x,
      y: this.center.y,
    }).init()

    new Warehouse({
      game: this.game,
      x: this.center.x + 270,
      y: this.center.y - 150,
    }).init()

    new WagonStop({
      game: this.game,
      x: this.center.x - 780,
      y: this.center.y + 280,
    }).init()

    new ConstructionArea({
      game: this.game,
      x: this.center.x + 600,
      y: this.center.y + 250,
    }).init()
  }

  #buildStore() {
    const constructionArea = this.game.chunkService.chunk?.constructionArea
    if (!constructionArea) {
      return
    }

    constructionArea.state = 'DESTROYED'

    this.game.removeObject(constructionArea)
    new Store({
      game: this.game,
      x: constructionArea.x,
      y: constructionArea.y,
    }).init()
  }

  #getRandomEmptyResourceFlagInVillage() {
    const flags = this.game.children.filter(
      (f) =>
        f instanceof FlagObject
        && f.chunkId === this.id
        && f.variant === 'RESOURCE'
        && !f.target
        && !f.isReserved,
    )
    return flags.length > 0
      ? (flags[Math.floor(Math.random() * flags.length)] as FlagObject)
      : undefined
  }

  #getResourceFlagInVillageAmount() {
    return this.game.children.filter(
      (f) => f instanceof FlagObject && f.chunkId === this.id && f.variant === 'RESOURCE',
    ).length
  }

  #getRandomMovementFlagInVillage() {
    const flags = this.game.children.filter(
      (f) => f instanceof FlagObject && f.chunkId === this.id && f.variant === 'MOVEMENT',
    )
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined
  }

  #getRandomTitle() {
    const titles = [
      'Windy Peak',
      'Green Grove',
      'Oak Coast',
      'Forest Harbor',
      'Elven Forest',
      'Stone Outpost',
      'Watermelon Paradise',
      'Magic Valley',
      'Royal Haven',
      'Phantom Cliff',
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }
}
