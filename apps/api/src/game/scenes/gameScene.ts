import { createId } from "@paralleldrive/cuid2"
import {
  type GameSceneType,
  type GetSceneResponse,
  type IGameChunk,
  type IGameChunkTheme,
  type IGameEvent,
  type IGamePoll,
  type IGameQuest,
  type IGameRoute,
  getDateMinusMinutes,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { SERVER_TICK_MS } from "../../config"
import { Forest, type GameChunk, LakeChunk, Village } from "../chunks"
import { Event, type Group, Route } from "../common"
import type { Game } from "../game"
import {
  Flag,
  type GameObject,
  type Rabbit,
  Stone,
  Tree,
  Wagon,
  type Wolf,
} from "../objects"
import { Player, Raider } from "../objects/units"
import { Trader } from "../objects/units/trader"
import { ChopTreeScript } from "../scripts/chopTreeScript"
import { MoveToRandomTargetScript } from "../scripts/moveToRandomTargetScript"
import { ActionService } from "../services/actionService"
import { EventService } from "../services/eventService"

interface IGameSceneOptions {
  game: Game
  group: Group | undefined
}

export class GameScene {
  public id: string
  public game: Game
  public objects: GameObject[] = []
  public group: Group | undefined
  public events: Event[] = []
  public chunks: GameChunk[] = []
  public chunkNow: GameChunk | undefined
  public route: Route | undefined

  // Services
  public actionService: ActionService
  public eventService: EventService

  constructor({ game, group }: IGameSceneOptions) {
    this.id = createId()
    this.game = game
    this.group = group

    this.actionService = new ActionService({ scene: this })
    this.eventService = new EventService({ scene: this })
  }

  public async play() {
    return setInterval(() => {
      this.eventService.update()
      this.updateObjects()
      this.updateRoute()
      this.updateChunks()
      this.updateChunkNow()
    }, SERVER_TICK_MS)
  }

  destroy() {
    this.objects = []
  }

  initEvent({
    title,
    type,
    secondsToEnd,
    scene,
    poll,
    quest,
  }: {
    title: string
    type: IGameEvent["type"]
    secondsToEnd: number
    scene?: GameSceneType
    poll?: IGamePoll
    quest?: IGameQuest
  }) {
    this.events.push(
      new Event({
        game: this.game,
        title,
        type,
        secondsToEnd,
        scene,
        poll,
        quest,
      }),
    )
  }

  getEvents(): IGameEvent[] {
    return this.events.map((event) => ({
      id: event.id,
      title: event.title,
      type: event.type,
      status: event.status,
      endsAt: event.endsAt,
      poll: event.poll,
      quest: event.quest,
    }))
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
      isVisibleOnClient: this.chunkNow.isVisibleOnClient,
    }
  }

  getRoute(): IGameRoute | null {
    if (!this.route) {
      return null
    }

    return {
      startPoint: this.route.startPoint,
      endPoint: this.route.endPoint,
      chunks: this.route.chunks,
    }
  }

  getInfo(): GetSceneResponse {
    return {
      id: this.id,
      commands: this.actionService.getAvailableCommands(),
      events: this.getEvents(),
      group: this.group,
      wagon: this.getWagon(),
      chunk: this.getChunkNow(),
      route: this.getRoute(),
    }
  }

  updateObjects() {
    this.removeInactivePlayers()
    const wagon = this.getWagon()

    for (const obj of this.objects) {
      this.removeDestroyedObject(obj)

      obj.isVisibleOnClient = wagon.checkIfPointInVisibilityArea({
        x: obj.x,
        y: obj.y,
      })
      obj.needToSendDataToClient = wagon.checkIfPointInServerDataArea({
        x: obj.x,
        y: obj.y,
      })

      if (obj instanceof Wagon) {
        this.updateWagon(obj)
        continue
      }
      if (obj instanceof Trader) {
        this.updateTrader(obj)
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

  updateRoute() {
    if (!this.route?.flags || this.route.flags.length <= 0) {
      return this.finishAdventure()
    }

    for (const flag of this.route.flags) {
      void flag.live()
    }
  }

  updateChunks() {
    const wagon = this.getWagon()

    for (const chunk of this.chunks) {
      for (const object of chunk.objects) {
        if (object.state === "DESTROYED") {
          chunk.removeObject(object)
        }
      }

      chunk.isVisibleOnClient = wagon.checkIfPointInVisibilityArea({
        x: chunk.center.x,
        y: chunk.center.y,
      })
      chunk.needToSendDataToClient = wagon.checkIfPointInServerDataArea({
        x: chunk.center.x,
        y: chunk.center.y,
      })

      chunk.live()
    }
  }

  updateChunkNow() {
    this.chunkNow = undefined

    const wagon = this.getWagon()

    for (const chunk of this.chunks) {
      const isWagonOnThisChunk = chunk.checkIfPointIsInArea({
        x: wagon.x,
        y: wagon.y,
      })
      if (isWagonOnThisChunk) {
        this.chunkNow = chunk
      }
    }

    if (this.chunkNow instanceof Village) {
      const store = this.chunkNow.getStore()
      const trader = this.getTrader()
      if (store?.id && !trader?.id) {
        this.generateNewTrader()
      }
    }
  }

  getTrader() {
    return this.objects.find((obj) => obj instanceof Trader) as
      | Trader
      | undefined
  }

  updateTrader(object: Trader) {
    object.live()

    if (!object.script) {
      const random = getRandomInRange(1, 150)
      if (random <= 1) {
        const target = this.getWagon().findRandomNearFlag()
        object.script = new MoveToRandomTargetScript({
          object,
          target,
        })
      }
    }
  }

  getWagon() {
    return this.objects.find((obj) => obj instanceof Wagon) as Wagon
  }

  updateWagon(object: Wagon) {
    const collisionObjects =
      this.chunkNow?.objects.filter(
        (obj) => obj.isOnWagonPath && obj.state !== "DESTROYED",
      ) ?? []
    for (const collisionObject of collisionObjects) {
      const isInArea = object.checkIfPointInCollisionArea({
        x: collisionObject.x,
        y: collisionObject.y,
      })
      if (isInArea) {
        object.state = "WAITING"
        object.speed = 0
        object.handleChange()
        return
      }
    }

    if (object.fuel <= 1) {
      object.state = "WAITING"
      object.speed = 0
      object.handleChange()
      return
    }

    if (object.state === "WAITING") {
      object.state = "IDLE"
    }
    if (object.state === "IDLE") {
      const target = this.route?.getNextFlag()
      if (target) {
        object.target = target
        object.state = "MOVING"
      }
    }
    if (object.state === "MOVING") {
      object.speed = 0.5
      const isMoving = object.move()
      object.handleChange()

      if (!isMoving) {
        if (
          object.target instanceof Flag &&
          object.target.type === "WAGON_MOVEMENT"
        ) {
          this.route?.removeFlag(object.target)
          object.target = undefined
          object.state = "IDLE"
          object.speed = 0
        }
      }
    }

    object.live()
  }

  updatePlayer(object: Player) {
    object.live()

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 150)
      if (random <= 1) {
        const randObj = this.getWagon().findRandomNearFlag()
        if (!randObj) {
          return
        }
        object.setTarget(randObj)
      }
      object.handleChange()
      return
    }
    if (object.state === "MOVING") {
      const isMoving = object.move()
      object.handleChange()

      if (!isMoving && object.target) {
        if (object.target instanceof Tree) {
          void object.startChopping()
          return
        }
        if (object.target instanceof Stone) {
          void object.startMining()
          return
        }
        if (
          object.target instanceof Flag &&
          object.target.type === "OUT_OF_SCREEN"
        ) {
          this.removeObject(object)
          return
        }

        object.state = "IDLE"
        return
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

    if (!object.script) {
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

    if (object.state === "MOVING") {
      const isMoving = object.move()
      if (!isMoving) {
        if (
          object.target instanceof Flag &&
          object.target.type === "OUT_OF_SCREEN"
        ) {
          this.removeObject(object)
        }

        object.state = "IDLE"
        return
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
        if (
          player.target instanceof Flag &&
          player.target.type === "OUT_OF_SCREEN"
        ) {
          continue
        }

        player.target = this.getWagon().findRandomOutFlag()
        player.state = "MOVING"
      }
    }
  }

  removeDestroyedObject(obj: GameObject) {
    if (obj.state === "DESTROYED") {
      this.removeObject(obj)
    }
  }

  async initPlayer(id: string) {
    const instance = new Player({ id, x: -100, y: -100 })
    await instance.init()
    await instance.initInventoryFromDB()

    const flag = this.getWagon().findRandomOutFlag()
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

  async stealFuelAction(playerId: string) {
    this.getWagon().emptyFuel()

    const player = await this.findOrCreatePlayer(playerId)
    if (!player) {
      return
    }

    await player.addVillainPoints(1)

    return {
      ok: true,
      message: `${player.userName}, а ты Злодей!`,
    }
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
      const wagon = this.getWagon()
      return this.determineNearestObject(wagon, onlyOnPath) as Tree
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
      const wagon = this.getWagon()
      return this.determineNearestObject(wagon, other) as Tree
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
      const wagon = this.getWagon()
      return this.determineNearestObject(wagon, onlyOnPath) as Stone
    }

    // Part 2: Check nearest free
    const other = this.chunkNow?.objects.filter(
      (obj) =>
        obj instanceof Stone && obj.state !== "DESTROYED" && !obj.isReserved,
    )
    if (other && other.length > 0) {
      const wagon = this.getWagon()
      return this.determineNearestObject(wagon, other) as Stone
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
    const wagon = this.getWagon()

    for (let i = 0; i < count; i++) {
      const flag = wagon.findRandomOutFlag()

      this.objects.push(new Raider({ x: flag.x, y: flag.y }))
    }
  }

  public stopRaid() {
    const flag = this.getWagon().findRandomOutFlag()

    for (const obj of this.objects) {
      if (obj instanceof Raider) {
        obj.moveOutOfScene(flag)
      }
    }
  }

  generateRandomVillage({
    center,
    width,
    height,
    theme,
  }: {
    center: { x: number; y: number }
    width: number
    height: number
    theme: IGameChunkTheme
  }) {
    const village = new Village({ width, height, center, theme })
    this.chunks.push(village)
    return village
  }

  generateRandomForest({
    center,
    width,
    height,
    theme,
  }: {
    center: { x: number; y: number }
    width: number
    height: number
    theme: IGameChunkTheme
  }) {
    const forest = new Forest({ width, height, center, theme })
    this.chunks.push(forest)
    return forest
  }

  generateRandomLake({
    center,
    width,
    height,
    theme,
  }: {
    center: { x: number; y: number }
    width: number
    height: number
    theme: IGameChunkTheme
  }) {
    const lake = new LakeChunk({ width, height, center, theme })
    this.chunks.push(lake)
    return lake
  }

  generateAdventure(village: Village, chunks: number) {
    const wagonStartPoint = village.getWagonStopPoint()
    const villageOutPoint = village.getRandomOutPointOnRight()

    this.route = new Route()
    this.route.addGlobalFlag(wagonStartPoint)
    this.route.startPoint = wagonStartPoint
    this.route.addChunk(village)

    this.generateChunks({ x: villageOutPoint.x, y: villageOutPoint.y }, chunks)
    this.markObjectsAsOnWagonPath(this.route)
  }

  finishAdventure() {
    this.route = undefined
    this.getWagon().emptyCargo()
  }

  generateChunks(startPoint: { x: number; y: number }, amount: number) {
    let outPoint = startPoint

    for (let i = 1; i <= amount; i++) {
      const chunk = this.generateRandomChunk(outPoint)
      if (!chunk) {
        continue
      }

      outPoint = chunk.getRandomOutPointOnRight()
      this.route?.addGlobalFlag(outPoint)
      this.route?.addChunk(chunk)
    }

    // Generate last chunk
    const finalVillage = this.generateRandomVillage({
      center: { x: outPoint.x + 2500 / 2, y: outPoint.y },
      width: 2500,
      height: 2000,
      theme: this.getRandomTheme(),
    })
    const stopPoint = finalVillage.getWagonStopPoint()
    this.route?.addGlobalFlag(stopPoint)
    this.route?.addChunk(finalVillage)
    this.route?.setEndPoint(stopPoint)
  }

  generateRandomChunk(startPoint: { x: number; y: number }) {
    const random = getRandomInRange(1, 2)

    const width = getRandomInRange(1500, 2500)
    const height = getRandomInRange(2200, 3000)
    const center = {
      x: startPoint.x + width / 2,
      y: startPoint.y,
    }

    switch (random) {
      case 1:
        return this.generateRandomForest({
          center: center,
          width: width,
          height: height,
          theme: this.getRandomTheme(),
        })
      case 2:
        return this.generateRandomLake({
          center: center,
          width: width,
          height: height,
          theme: this.getRandomTheme(),
        })
      default:
        return undefined
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

  markObjectsAsOnWagonPath(route: Route) {
    for (const chunk of this.chunks) {
      for (const object of chunk.objects) {
        if (object instanceof Tree || object instanceof Stone) {
          const isOnPath = route.checkIfPointIsOnWagonPath({
            x: object.x,
            y: object.y,
          })
          if (isOnPath) {
            object.isOnWagonPath = true
          }
        }
      }
    }
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

  generateNewTrader() {
    const target = this.getWagon().findRandomOutFlag()
    this.objects.push(
      new Trader({
        x: target.x,
        y: target.y,
      }),
    )
  }
}
