import { Flag, Stone, Tree } from '../objects'
import { Campfire } from '../objects/buildings/campfire'
import { ConstructionArea } from '../objects/buildings/constructionArea'
import { Store } from '../objects/buildings/store'
import { WagonStop } from '../objects/buildings/wagonStop'
import { Warehouse } from '../objects/buildings/warehouse'
import { Courier, Farmer } from '../objects/units'
import type { GameScene } from '../scenes/gameScene'
import { BuildScript } from '../scripts/buildScript'
import { ChopTreeScript } from '../scripts/chopTreeScript'
import { MoveToTargetScript } from '../scripts/moveToTargetScript'
import { PlaceItemInWarehouseScript } from '../scripts/placeItemInWarehouseScript'
import { PlantNewTreeScript } from '../scripts/plantNewTreeScript'
import { GameChunk } from './gameChunk'
import { getRandomInRange } from '$lib/random'
import type {
  IGameChunkTheme,
  IGameObjectFlag,
  IGameVillageChunk,
} from '$lib/game/types'

interface IVillageOptions {
  scene: GameScene
  width: number
  height: number
  center: IGameVillageChunk['center']
  theme: IGameChunkTheme
}

export class Village extends GameChunk implements IGameVillageChunk {
  constructor({ width, height, center, theme, scene }: IVillageOptions) {
    super({ title: '', type: 'VILLAGE', theme, width, height, center, scene })

    this.title = this.getRandomTitle()

    this.initFlags('RESOURCE', 80)
    // this.initFlags("MOVEMENT", 30)
    this.initTrees(20)
    this.initStones(5)

    this.initCourier(1)
    this.initFarmer(1)
    this.initBuildings()
  }

  live() {
    super.live()

    for (const object of this.objects) {
      if (object instanceof Farmer && !object.script) {
        this.addTaskToFarmer(object)
        continue
      }

      if (object instanceof Courier && !object.script) {
        this.addTaskToCourier(object)
      }
    }
  }

  addTaskToCourier(object: Courier) {
    const random = getRandomInRange(1, 500)
    if (random !== 1) {
      return
    }

    // Need to build Store
    const warehouse = this.getWarehouse()
    const store = this.getStore()
    const wood = warehouse?.getItemByType('WOOD')
    if (wood?.amount && wood.amount >= 25 && !store) {
      // Let's build!
      const target = this.getConstructionArea()
      if (!target) {
        return
      }

      const buildFunc = (): boolean => {
        warehouse?.inventory.reduceOrDestroyItem('WOOD', 25)
        this.buildStore()

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
      const target = this.getWarehouse()
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

    // If there is an available tree
    const availableTree = this.getAvailableTree()
    if (availableTree) {
      const chopTreeFunc = (): boolean => {
        object.chopTree()
        if (!object.target || object.target.state === 'DESTROYED') {
          object.state = 'IDLE'
          if (object.target instanceof Tree) {
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
        target: availableTree,
        chopTreeFunc,
      })

      return
    }

    const target = this.getRandomMovementFlagInVillage()
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
      const target = this.getRandomMovementFlagInVillage()
      if (!target) {
        return
      }
      object.script = new MoveToTargetScript({
        object,
        target,
      })
    }
  }

  initFlag(type: IGameObjectFlag['type']) {
    const randomPoint = this.getRandomPoint()
    this.objects.push(
      new Flag({
        scene: this.scene,
        type,
        x: randomPoint.x,
        y: randomPoint.y,
      }),
    )
  }

  initFlags(type: IGameObjectFlag['type'], count: number) {
    for (let i = 0; i < count; i++) {
      this.initFlag(type)
    }
  }

  initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.getRandomEmptyResourceFlagInVillage()
      if (flag) {
        const size = getRandomInRange(65, 85)
        const tree = new Tree({
          scene: this.scene,
          x: flag.x,
          y: flag.y,
          size,
          resource: 1,
          health: 20,
          variant: this.area.theme,
        })
        flag.target = tree

        this.objects.push(tree)
      }
    }
  }

  initStones(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.getRandomEmptyResourceFlagInVillage()
      if (flag) {
        const stone = new Stone({
          scene: this.scene,
          x: flag.x,
          y: flag.y,
          resource: 1,
        })
        flag.target = stone
        this.objects.push(stone)
      }
    }
  }

  initCourier(count = 1) {
    for (let i = 0; i < count; i++) {
      const randomPoint = this.getRandomPoint()
      const courier = new Courier({
        scene: this.scene,
        x: randomPoint.x,
        y: randomPoint.y,
      })

      this.objects.push(courier)
    }
  }

  initFarmer(count = 1) {
    for (let i = 0; i < count; i++) {
      const randomPoint = this.getRandomPoint()
      const farmer = new Farmer({
        scene: this.scene,
        x: randomPoint.x,
        y: randomPoint.y,
      })

      this.objects.push(farmer)
    }
  }

  initBuildings() {
    const campfire = new Campfire({
      scene: this.scene,
      x: this.center.x,
      y: this.center.y,
    })

    const warehouse = new Warehouse({
      scene: this.scene,
      x: this.center.x + 270,
      y: this.center.y - 150,
    })

    const wagonStop = new WagonStop({
      scene: this.scene,
      x: this.center.x - 780,
      y: this.center.y + 280,
    })

    const constructionArea = new ConstructionArea({
      scene: this.scene,
      x: this.center.x + 600,
      y: this.center.y + 250,
    })

    this.objects.push(campfire, warehouse, wagonStop, constructionArea)
  }

  buildStore() {
    const constructionArea = this.getConstructionArea()
    if (!constructionArea) {
      return
    }

    constructionArea.state = 'DESTROYED'

    this.removeObject(constructionArea)
    this.objects.push(
      new Store({
        scene: this.scene,
        x: constructionArea.x,
        y: constructionArea.y,
      }),
    )
  }

  getWarehouse() {
    return this.objects.find((b) => b instanceof Warehouse) as
      | Warehouse
      | undefined
  }

  getStore() {
    return this.objects.find((b) => b instanceof Store) as Store | undefined
  }

  getConstructionArea() {
    return this.objects.find((b) => b instanceof ConstructionArea) as
      | ConstructionArea
      | undefined
  }

  public getWagonStopPoint() {
    for (const object of this.objects) {
      if (object instanceof WagonStop) {
        return { x: object.x, y: object.y }
      }
    }
    return { x: 500, y: 500 }
  }

  getRandomEmptyResourceFlagInVillage() {
    const flags = this.objects.filter(
      (f) =>
        f instanceof Flag
        && f.type === 'RESOURCE'
        && !f.target
        && !f.isReserved,
    )
    return flags.length > 0
      ? (flags[Math.floor(Math.random() * flags.length)] as Flag)
      : undefined
  }

  getResourceFlagInVillageAmount() {
    return this.objects.filter(
      (f) => f instanceof Flag && f.type === 'RESOURCE',
    ).length
  }

  getRandomMovementFlagInVillage() {
    const flags = this.objects.filter(
      (f) => f instanceof Flag && f.type === 'MOVEMENT',
    )
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined
  }

  getRandomTitle() {
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

  checkIfNeedToPlantTree() {
    const treesNow = this.objects.filter(
      (t) => t instanceof Tree && t.state !== 'DESTROYED',
    )
    if (treesNow.length < 40) {
      return this.getRandomEmptyResourceFlagInVillage()
    }
  }

  plantNewTree(flag: Flag) {
    const tree = new Tree({
      scene: this.scene,
      x: flag.x,
      y: flag.y,
      resource: 1,
      size: 12,
      health: 20,
      variant: this.area.theme,
    })

    flag.target = tree
    flag.isReserved = false
    this.objects.push(tree)
  }

  getTreesAmount() {
    return this.objects.filter(
      (obj) => obj instanceof Tree && obj.state !== 'DESTROYED',
    ).length
  }

  checkIfThereAreNotEnoughTrees() {
    const max = this.getResourceFlagInVillageAmount()
    const now = this.getTreesAmount()

    return now < max / 3
  }
}
