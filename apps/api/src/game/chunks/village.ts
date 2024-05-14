import {
  type IGameChunkTheme,
  type IGameObjectFlag,
  type IGameVillageChunk,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { Flag, Stone, Tree } from "../objects"
import { Building } from "../objects/buildings/building"
import { Campfire } from "../objects/buildings/campfire"
import { WagonStop } from "../objects/buildings/wagonStop"
import { Warehouse } from "../objects/buildings/warehouse"
import { VillageCourier, VillageFarmer } from "../objects/units"
import { ChopTreeScript } from "../scripts/chopTreeScript"
import { MoveToRandomTargetScript } from "../scripts/moveToRandomTargetScript"
import { PlaceItemInWarehouseScript } from "../scripts/placeItemInWarehouseScript"
import { PlantNewTreeScript } from "../scripts/plantNewTreeScript"
import { GameChunk } from "./gameChunk"

interface IVillageOptions {
  width: number
  height: number
  center: IGameVillageChunk["center"]
  theme: IGameChunkTheme
}

export class Village extends GameChunk implements IGameVillageChunk {
  constructor({ width, height, center, theme }: IVillageOptions) {
    super({ title: "", type: "VILLAGE", theme, width, height, center })

    this.title = this.getRandomTitle()

    this.initFlags("RESOURCE", 40)
    this.initFlags("MOVEMENT", 30)
    this.initTrees(20)
    this.initStones(5)

    this.initCourier()
    this.initFarmer()
    this.initBuildings()
  }

  live() {
    super.live()

    for (const object of this.objects) {
      // Check if NPC is without Script
      if (object.entity === "FARMER" && !object.script) {
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
          continue
        }

        // No Trees needed?
        const random = getRandomInRange(1, 300)
        if (random <= 1) {
          const target = this.getRandomMovementFlagInVillage()
          if (!target) {
            return
          }
          object.script = new MoveToRandomTargetScript({
            object,
            target,
          })
          continue
        }
      }

      if (
        object instanceof VillageCourier &&
        object.entity === "COURIER" &&
        !object.script
      ) {
        const random = getRandomInRange(1, 200)
        if (random !== 1) {
          continue
        }

        // If unit have smth in inventory
        const item = object.inventory.checkIfAlreadyHaveItem("WOOD")
        if (item) {
          const target = this.getWarehouse()
          if (!target) {
            continue
          }

          const placeItemFunc = () => {
            if (object.target instanceof Building) {
              void object.target.inventory.addOrCreateItem(
                item.type,
                item.amount,
              )
              void object.inventory.destroyItem(item.id)
            }
          }
          object.script = new PlaceItemInWarehouseScript({
            object,
            target,
            placeItemFunc,
          })

          continue
        }

        // If there is an available tree
        const availableTree = this.getAvailableTree()
        if (availableTree) {
          const chopTreeFunc = (): boolean => {
            object.chopTree()
            if (!object.target || object.target.state === "DESTROYED") {
              object.state = "IDLE"
              if (object.target instanceof Tree) {
                void object.inventory.addOrCreateItem(
                  "WOOD",
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

          continue
        }

        const target = this.getRandomMovementFlagInVillage()
        if (!target) {
          return
        }
        object.script = new MoveToRandomTargetScript({
          object,
          target,
        })
      }

      void object.live()
    }
  }

  initFlag(type: IGameObjectFlag["type"]) {
    const randomPoint = this.getRandomPoint()
    this.objects.push(new Flag({ type, x: randomPoint.x, y: randomPoint.y }))
  }

  initFlags(type: IGameObjectFlag["type"], count: number) {
    for (let i = 0; i < count; i++) {
      this.initFlag(type)
    }
  }

  initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.getRandomEmptyResourceFlagInVillage()
      if (flag) {
        const size = getRandomInRange(75, 90)
        const tree = new Tree({
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
        const stone = new Stone({ x: flag.x, y: flag.y, resource: 1 })
        flag.target = stone
        this.objects.push(stone)
      }
    }
  }

  initCourier() {
    const randomPoint = this.getRandomPoint()
    this.objects.push(
      new VillageCourier({
        x: randomPoint.x,
        y: randomPoint.y,
      }),
    )
  }

  initFarmer() {
    const randomPoint = this.getRandomPoint()
    this.objects.push(
      new VillageFarmer({
        x: randomPoint.x,
        y: randomPoint.y,
      }),
    )
  }

  initBuildings() {
    this.objects.push(
      new Campfire({
        x: this.center.x,
        y: this.center.y,
      }),
    )
    this.objects.push(
      new Warehouse({
        x: this.center.x + 300,
        y: this.center.y - 120,
      }),
    )
    this.objects.push(
      new WagonStop({
        x: this.center.x - 480,
        y: this.center.y + 220,
      }),
    )
  }

  getWarehouse() {
    return this.objects.find((b) => b instanceof Warehouse) as
      | Warehouse
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
      (f) => f instanceof Flag && f.type === "RESOURCE" && !f.target,
    )
    return flags.length > 0
      ? (flags[Math.floor(Math.random() * flags.length)] as Flag)
      : undefined
  }

  getRandomMovementFlagInVillage() {
    const flags = this.objects.filter(
      (f) => f instanceof Flag && f.type === "MOVEMENT",
    )
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined
  }

  getRandomTitle() {
    const titles = [
      "Ветреный Пик",
      "Зеленая Роща",
      "Дубовый Берег",
      "Лесная Гавань",
      "Эльфийский Лес",
      "Каменная Застава",
      "Арбузный Рай",
      "Магическая Долина",
      "Королевское Пристанище",
      "Призрачный Утес",
    ]
    return titles[Math.floor(Math.random() * titles.length)]
  }

  checkIfNeedToPlantTree() {
    const treesNow = this.objects.filter(
      (t) => t instanceof Tree && t.state !== "DESTROYED",
    )
    if (treesNow.length < 40) {
      return this.getRandomEmptyResourceFlagInVillage()
    }
  }

  plantNewTree(flag: Flag) {
    const tree = new Tree({
      x: flag.x,
      y: flag.y,
      resource: 1,
      size: 12,
      variant: this.area.theme,
    })

    flag.target = tree
    this.objects.push(tree)
  }

  getAvailableTree(): Tree | undefined {
    const trees = this.objects.filter(
      (obj) =>
        obj instanceof Tree &&
        obj.state !== "DESTROYED" &&
        !obj.isReserved &&
        obj.isReadyToChop,
    )
    if (!trees || !trees.length) {
      return undefined
    }

    return trees[Math.floor(Math.random() * trees.length)] as Tree
  }
}
