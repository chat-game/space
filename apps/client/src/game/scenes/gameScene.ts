import { createId } from "@paralleldrive/cuid2"
import {
  type GetSceneResponse,
  type IGameChunk,
  type IGameChunkTheme,
  type IGameInventoryItem,
  getDateMinusMinutes,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { type GameChunk, Village } from "../chunks"
import { Group, Route } from "../common"
import type { Game } from "../game"
import {
  Flag,
  type GameObject,
  type Rabbit,
  Stone,
  Tree,
  type Wolf,
} from "../objects"
import { Player, Raider, Trader } from "../objects/units"
import { ChopTreeScript } from "../scripts/chopTreeScript"
import {
  MoveOffScreenAndSelfDestroyScript
} from "../scripts/moveOffScreenAndSelfDestroyScript"
import { MoveToTargetScript } from "../scripts/moveToTargetScript"
import { ActionService } from "../services/actionService"
import { EventService } from "../services/eventService"
import { TradeService } from "../services/tradeService"
import { WagonService } from "../services/wagonService"

interface IGameSceneOptions {
  game: Game
}

export class GameScene {
  public id: string
  public game: Game
  public objects: GameObject[] = []
  public group: Group
  public chunks: GameChunk[] = []
  public chunkNow: GameChunk | undefined

  public actionService: ActionService
  public eventService: EventService
  public tradeService: TradeService
  public wagonService: WagonService

  constructor({ game }: IGameSceneOptions) {
    this.id = createId()
    this.game = game
    this.group = new Group()

    this.actionService = new ActionService({ scene: this })
    this.eventService = new EventService({ scene: this })
    this.tradeService = new TradeService({ scene: this })
    this.wagonService = new WagonService({ scene: this })
  }

  public live() {
    this.eventService.update()
    this.tradeService.update()
    this.wagonService.update()
    this.updateObjects()
    this.updateChunks()
    this.updateChunkNow()
  }

  public destroy() {
    this.objects = []
  }

  getChunkNow(): IGameChunk | null {
    if (!this.chunkNow) {
      return null
    }

    return {
      id: this.chunkNow.id,
      title: this.chunkNow.title,
      type: this.chunkNow.type,
      center: this.chunkNow.center,
      area: this.chunkNow.area,
    }
  }

  getWarehouseItems(): IGameInventoryItem[] | undefined {
    if (this.chunkNow instanceof Village) {
      const warehouse = this.chunkNow.getWarehouse()
      if (warehouse) {
        return warehouse.inventory.items
      }
    }

    return undefined
  }

  getInfo(): GetSceneResponse {
    return {
      id: this.id,
      commands: this.actionService.getAvailableCommands(),
      events: this.eventService.getEvents(),
      group: this.group.getGroup(),
      wagon: this.wagonService.wagon,
      chunk: this.getChunkNow(),
      route: this.wagonService.routeService.getRoute(),
      warehouseItems: this.getWarehouseItems(),
    }
  }

  updateObjects() {
    this.removeInactivePlayers()

    for (const obj of this.objects) {
      this.removeDestroyedObject(obj)

      if (obj instanceof Trader) {
        this.tradeService.updateTrader(obj)
        continue
      }
      if (obj instanceof Player) {
        this.updatePlayer(obj)
        continue
      }
      if (obj instanceof Raider) {
        this.updateRaider(obj)
        continue
      }

      void obj.live()
    }
  }

  updateChunks() {
    for (const chunk of this.chunks) {
      for (const object of chunk.objects) {
        if (object.state === "DESTROYED") {
          chunk.removeObject(object)
        }
      }

      chunk.live()
    }
  }

  updateChunkNow() {
    this.chunkNow = undefined

    for (const chunk of this.chunks) {
      const isWagonOnThisChunk = chunk.checkIfPointIsInArea({
        x: this.wagonService.wagon.x,
        y: this.wagonService.wagon.y,
      })
      if (isWagonOnThisChunk) {
        this.chunkNow = chunk
      }
    }
  }

  updatePlayer(object: Player) {
    object.live()

    if (object.script) {
      return
    }

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 150)
      if (random <= 1) {
        const target = this.wagonService.findRandomNearFlag()

        object.script = new MoveToTargetScript({
          object,
          target,
        })
      }
    }
  }

  updateRabbit(object: Rabbit) {
    object.live()

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 100)
      if (random <= 1) {
        const randomObj = this.findRandomMovementFlag()
        if (!randomObj) {
          return
        }
        object.setTarget(randomObj)
      }
    }
  }

  updateWolf(object: Wolf) {
    object.live()

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 100)
      if (random <= 1) {
        const randomObj = this.findRandomMovementFlag()
        if (!randomObj) {
          return
        }
        object.setTarget(randomObj)
      }
    }
  }

  updateRaider(object: Raider) {
    object.live()

    if (object.script) {
      return
    }

    // If there is an available tree
    const availableTree = this.chunkNow?.getAvailableTree()
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

      return
    }

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 100)
      if (random <= 1) {
        const randomObj = this.findRandomMovementFlag()
        if (!randomObj) {
          return
        }
        object.setTarget(randomObj)
      }
    }
  }

  removeObject(object: GameObject) {
    const index = this.objects.indexOf(object)
    this.objects.splice(index, 1)
  }

  async findOrCreatePlayer(id: string) {
    const player = this.findPlayer(id)
    if (!player && this.actionService.isActionPossible("CREATE_NEW_PLAYER")) {
      return this.createPlayer(id)
    }
    return player
  }

  public findPlayer(id: string) {
    const player = this.objects.find((p) => p.id === id)
    if (player instanceof Player) {
      return player
    }
  }

  public findActivePlayers() {
    return this.objects.filter((obj) => obj instanceof Player) as Player[]
  }

  public removeInactivePlayers() {
    const players = this.findActivePlayers()
    for (const player of players) {
      const checkTime = getDateMinusMinutes(8)
      if (player.lastActionAt.getTime() <= checkTime.getTime()) {
        if (player.script) {
          continue
        }

        const target = this.wagonService.findRandomOutFlag()
        const selfDestroyFunc = () => {
          this.group.remove(player)
          this.removeObject(player)
        }

        player.script = new MoveOffScreenAndSelfDestroyScript({
          target,
          object: player,
          selfDestroyFunc,
        })
      }
    }
  }

  removeDestroyedObject(obj: GameObject) {
    if (obj.state === "DESTROYED") {
      this.removeObject(obj)
    }
  }

  async initPlayer(id: string) {
    const instance = new Player({ scene: this, id, x: -100, y: -100 })
    await instance.initFromDB()
    await instance.initInventoryFromDB()

    const flag = this.wagonService.findRandomOutFlag()
    instance.x = flag.x
    instance.y = flag.y

    return instance
  }

  public async createPlayer(id: string): Promise<Player> {
    const player = this.findPlayer(id)
    if (!player) {
      const instance = await this.initPlayer(id)
      this.objects.push(instance)
      return instance
    }
    return player
  }

  getTreeToChop() {
    // Part 1: Check trees on Wagon Path
    const onlyOnPath = this.chunkNow?.objects.filter(
      (obj) =>
        obj instanceof Tree &&
        obj.state !== "DESTROYED" &&
        !obj.isReserved &&
        obj.isOnWagonPath,
    )
    if (onlyOnPath && onlyOnPath.length > 0) {
      return this.determineNearestObject(
        this.wagonService.wagon,
        onlyOnPath,
      ) as Tree
    }

    // Part 2: Check nearest free tree
    const other = this.chunkNow?.objects.filter(
      (obj) =>
        obj instanceof Tree &&
        obj.state !== "DESTROYED" &&
        !obj.isReserved &&
        obj.isReadyToChop,
    )
    if (other && other.length > 0) {
      return this.determineNearestObject(this.wagonService.wagon, other) as Tree
    }
  }

  getStoneToMine() {
    // Part 1: Check on Wagon Path
    const onlyOnPath = this.chunkNow?.objects.filter(
      (obj) =>
        obj instanceof Stone &&
        obj.state !== "DESTROYED" &&
        !obj.isReserved &&
        obj.isOnWagonPath,
    )
    if (onlyOnPath && onlyOnPath.length > 0) {
      return this.determineNearestObject(
        this.wagonService.wagon,
        onlyOnPath,
      ) as Stone
    }

    // Part 2: Check nearest free
    const other = this.chunkNow?.objects.filter(
      (obj) =>
        obj instanceof Stone && obj.state !== "DESTROYED" && !obj.isReserved,
    )
    if (other && other.length > 0) {
      return this.determineNearestObject(
        this.wagonService.wagon,
        other,
      ) as Stone
    }
  }

  determineNearestObject(
    point: {
      x: number
      y: number
    },
    objects: GameObject[],
  ) {
    let closestObject = objects[0]
    let shortestDistance = undefined

    for (const object of objects) {
      const distance = Route.getDistanceBetween2Points(point, object)
      if (!shortestDistance || distance < shortestDistance) {
        shortestDistance = distance
        closestObject = object
      }
    }

    return closestObject
  }

  initRaiders(count: number) {
    for (let i = 0; i < count; i++) {
      const flag = this.wagonService.findRandomOutFlag()

      this.objects.push(new Raider({ scene: this, x: flag.x, y: flag.y }))
    }
  }

  public stopRaid() {
    for (const object of this.objects) {
      if (object instanceof Raider) {
        const target = this.wagonService.findRandomOutFlag()
        const selfDestroyFunc = () => {
          this.removeObject(object)
        }

        object.script = new MoveOffScreenAndSelfDestroyScript({
          target,
          object,
          selfDestroyFunc,
        })
      }
    }
  }

  getRandomTheme(): IGameChunkTheme {
    const themes: IGameChunkTheme[] = [
      "GREEN",
      "BLUE",
      "STONE",
      "TEAL",
      "VIOLET",
      "TOXIC",
    ]
    return themes[Math.floor(Math.random() * themes.length)]
  }

  findRandomMovementFlag() {
    const flags = this.chunkNow?.objects.filter(
      (f) => f instanceof Flag && f.type === "MOVEMENT",
    )
    if (!flags) {
      return undefined
    }

    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined
  }

  findRandomEmptyResourceFlag() {
    const flags = this.objects.filter(
      (f) => f instanceof Flag && f.type === "RESOURCE" && !f.target,
    )
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined
  }
}
