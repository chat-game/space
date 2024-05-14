import { createId } from "@paralleldrive/cuid2"
import {
  type GameSceneType,
  type GetSceneResponse,
  type IGameChunk,
  type IGameChunkTheme,
  type IGameEvent,
  type IGamePoll,
  type IGameRoute,
  type IGameSceneAction,
  type ItemType,
  getDateMinusMinutes,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import {
  ADMIN_PLAYER_ID,
  DISCORD_SERVER_INVITE_URL,
  DONATE_URL,
  GITHUB_REPO_URL,
  SERVER_TICK_MS,
} from "../../config"
import { Forest, type GameChunk, LakeChunk, Village } from "../chunks"
import { Event, Group, Route } from "../common"
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

interface IGameSceneOptions {
  game: Game
  group: Group | undefined
  possibleActions: IGameSceneAction[]
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
  public possibleActions: IGameSceneAction[] = []

  constructor({ game, group, possibleActions }: IGameSceneOptions) {
    this.id = createId()
    this.game = game
    this.group = group
    this.possibleActions = possibleActions
  }

  public async play() {
    return setInterval(() => {
      this.updateEvents()
      this.updateObjects()
      this.updateRoute()
      this.updateChunks()
      this.updateChunkNow()
      this.updatePolls()
    }, SERVER_TICK_MS)
  }

  destroy() {
    this.objects = []
  }

  public async handleAction(
    action: IGameSceneAction,
    playerId: string,
    params?: string[],
  ) {
    const player = await this.findOrCreatePlayer(playerId)
    if (!player) {
      return {
        ok: false,
        message: "Тебя нет в активной игре :(",
      }
    }

    if (action === "SHOW_MESSAGE") {
      return this.showMessageAction(player, params)
    }
    if (action === "REFUEL") {
      return this.refuelAction(player, params)
    }
    if (action === "CHOP") {
      return this.chopAction(player)
    }
    if (action === "MINE") {
      return this.mineAction(player)
    }
    if (action === "START_CHANGING_SCENE") {
      // Admin only
      if (player.id !== ADMIN_PLAYER_ID) {
        return {
          ok: false,
          message: null,
        }
      }
      return this.startChangingSceneAction(player, params)
    }
    if (action === "START_GROUP_BUILD") {
      // Admin only
      if (player.id !== ADMIN_PLAYER_ID) {
        return {
          ok: false,
          message: null,
        }
      }
      return this.startGroupBuildAction(player, params)
    }
    if (action === "DISBAND_GROUP") {
      // Admin only
      if (player.id !== ADMIN_PLAYER_ID) {
        return {
          ok: false,
          message: null,
        }
      }
      return this.disbandGroupAction()
    }
    if (action === "START_CREATING_NEW_ADVENTURE") {
      // Admin only
      if (player.id !== ADMIN_PLAYER_ID) {
        return {
          ok: false,
          message: null,
        }
      }
      return this.startCreatingNewAdventureAction()
    }
    if (action === "JOIN_GROUP") {
      return this.joinGroupAction(player, params)
    }
    if (action === "HELP") {
      return this.helpAction(player)
    }
    if (action === "GITHUB") {
      return this.githubAction(player)
    }
    if (action === "DONATE") {
      return this.donateAction(player)
    }
    if (action === "GIFT") {
      return this.giftAction(player, params)
    }
    if (action === "SELL") {
      return this.sellAction(player, params)
    }
    if (action === "BUY") {
      return this.buyAction(player, params)
    }

    return {
      ok: false,
      message: null,
    }
  }

  checkIfActionIsPossible(action: IGameSceneAction) {
    return this.possibleActions.find((a) => a === action)
  }

  initEvent({
    title,
    type,
    secondsToEnd,
    scene,
    poll,
  }: {
    title: string
    type: IGameEvent["type"]
    secondsToEnd: number
    scene?: GameSceneType
    poll?: IGamePoll
  }) {
    this.events.push(
      new Event({ game: this.game, title, type, secondsToEnd, scene, poll }),
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
      commands: this.getAvailableCommands(),
      events: this.getEvents(),
      group: this.group,
      wagon: this.getWagon(),
      chunk: this.getChunkNow(),
      route: this.getRoute(),
    }
  }

  updateEvents() {
    for (const event of this.events) {
      const status = event.checkStatus()

      if (status === "STOPPED") {
        event.handleEnding()

        const index = this.events.indexOf(event)
        this.events.splice(index, 1)
      }
    }
  }

  updateObjects() {
    this.removeInactivePlayers()
    const wagon = this.getWagon()

    for (const obj of this.objects) {
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
      // Route is over
      this.route = undefined
      return
    }

    for (const flag of this.route.flags) {
      void flag.live()
    }
  }

  updateChunks() {
    const wagon = this.getWagon()

    for (const chunk of this.chunks) {
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
  }

  updatePolls() {
    if (this.chunkNow instanceof Village) {
      this.generatePollForNewAdventure()
    }
    for (const event of this.events) {
      if (event.type === "VOTING_FOR_NEW_ADVENTURE_STARTED") {
        if (!event.poll) {
          continue
        }
        if (event.poll?.votes.length >= event.poll?.votesToSuccess) {
          event.status = "STOPPED"

          for (const event of this.game.scene.events) {
            if (event.type === "VOTING_FOR_NEW_ADVENTURE_STARTED") {
              event.status = "STOPPED"
            }
          }
        }
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

  getAvailableCommands() {
    const commands: string[] = []
    for (const action of this.possibleActions) {
      if (action === "HELP") {
        commands.push("!помощь")
      }
      if (action === "REFUEL") {
        commands.push("!заправить [кол-во]")
      }
      if (action === "CHOP") {
        commands.push("!рубить")
      }
      if (action === "MINE") {
        commands.push("!добыть")
      }
      if (action === "BUY") {
        commands.push("!купить [название]")
      }
      if (action === "SELL") {
        commands.push("!продать [название]")
      }
      if (action === "GIFT") {
        commands.push("!подарить [название]")
      }
      if (action === "DONATE") {
        commands.push("!донат")
      }
    }

    return commands
  }

  async findOrCreatePlayer(id: string) {
    const player = this.findPlayer(id)
    if (!player && this.checkIfActionIsPossible("CREATE_NEW_PLAYER")) {
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

  async showMessageAction(player: Player, params?: string[]) {
    if (!this.checkIfActionIsPossible("SHOW_MESSAGE")) {
      return {
        ok: false,
        message: null,
      }
    }

    if (!params || !params[0]) {
      return {
        ok: false,
        message: null,
      }
    }

    const message = params[0]
    player.addMessage(message)

    return {
      ok: true,
      message: null,
    }
  }

  async refuelAction(player: Player, params?: string[]) {
    if (!this.checkIfActionIsPossible("REFUEL")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }

    if (!params) {
      return {
        ok: false,
        message: "Не указана цель.",
      }
    }

    const count = this.getCountFromChatCommand(params[0])
    if (!count) {
      return {
        ok: false,
        message: "Неверно указано количество.",
      }
    }

    const items = player.inventory?.items ?? []
    const itemExist = items.find((item) => item.type === "WOOD")
    if (!itemExist) {
      return {
        ok: false,
        message: `${player.userName}, у тебя нет древесины.`,
      }
    }

    const isSuccess = await player.inventory?.reduceOrDestroyItem(
      itemExist.type,
      count,
    )
    if (!isSuccess) {
      return {
        ok: false,
        message: `${player.userName}, недостаточно древесины.`,
      }
    }

    await player.addRefuellerPoints(count)

    this.refuelWagon(count)

    return {
      ok: true,
      message: `${player.userName}, ты помог заправить Машину.`,
    }
  }

  async stealFuelAction(playerId: string) {
    this.emptyWagonFuel()

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

  async chopAction(player: Player) {
    if (!this.checkIfActionIsPossible("CHOP")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }
    if (player.state === "CHOPPING") {
      return {
        ok: false,
        message: `${player.userName}, ты пока занят(а).`,
      }
    }

    const tree = this.getTreeToChop()
    if (!tree) {
      return {
        ok: false,
        message: `${player.userName}, нет свободного дерева.`,
      }
    }

    player.setTarget(tree)

    return {
      ok: true,
      message: null,
    }
  }

  async mineAction(player: Player) {
    if (!this.checkIfActionIsPossible("MINE")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }
    if (player.state === "MINING") {
      return {
        ok: false,
        message: `${player.userName}, ты пока занят(а).`,
      }
    }

    const stone = this.getStoneToMine()
    if (!stone) {
      return {
        ok: false,
        message: `${player.userName}, нет свободного камня.`,
      }
    }

    player.setTarget(stone)

    return {
      ok: true,
      message: null,
    }
  }

  disbandGroupAction() {
    if (!this.checkIfActionIsPossible("DISBAND_GROUP")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }

    this.group?.disband()
    this.group = undefined

    return {
      ok: true,
      message: "Группа расформирована!",
    }
  }

  startCreatingNewAdventureAction() {
    if (!this.checkIfActionIsPossible("START_CREATING_NEW_ADVENTURE")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }

    this.initEvent({
      type: "CREATING_NEW_ADVENTURE_STARTED",
      title: "Генерируем приключение",
      secondsToEnd: 15,
    })

    return {
      ok: true,
      message: "Началось создание новых локаций...",
    }
  }

  startChangingSceneAction(_: Player, params?: string[]) {
    if (!this.checkIfActionIsPossible("START_CHANGING_SCENE")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }

    if (!params) {
      return {
        ok: false,
        message: "Не указана цель.",
      }
    }

    const scene = this.getSceneTypeFromChatCommand(params[1])
    if (!scene) {
      return {
        ok: false,
        message: "Неверно указана цель. В деревню, на защиту.",
      }
    }

    this.initEvent({
      type: "SCENE_CHANGING_STARTED",
      title: "Меняем локацию",
      scene,
      secondsToEnd: 10,
    })

    return {
      ok: true,
      message: "Переходим в другую локацию...",
    }
  }

  startGroupBuildAction(player: Player, params?: string[]) {
    if (!this.checkIfActionIsPossible("START_GROUP_BUILD")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }

    if (!params) {
      return {
        ok: false,
        message: "Не указана цель.",
      }
    }

    const scene = this.getSceneTypeFromChatCommand(params[1])
    if (!scene) {
      return {
        ok: false,
        message: "Неверно указана цель. В деревню, на защиту.",
      }
    }

    this.group = new Group({ creator: player, target: scene })

    this.initEvent({
      type: "GROUP_FORM_STARTED",
      title: "Идет набор в группу!",
      scene,
      secondsToEnd: 120,
    })

    return {
      ok: true,
      message: "Начинаем собирать группу!",
    }
  }

  getSceneTypeFromChatCommand(text: string): GameSceneType | null {
    if (text === "деревня" || text === "деревню") {
      return "VILLAGE"
    }
    if (text === "защиту" || text === "защита") {
      return "DEFENCE"
    }

    return null
  }

  getCountFromChatCommand(text: string): number | null {
    if (typeof Number(text) === "number" && Number(text) > 0) {
      return Math.round(Number(text))
    }

    return null
  }

  joinGroupAction(player: Player, params?: string[]) {
    if (!this.checkIfActionIsPossible("JOIN_GROUP")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      }
    }

    if (!params) {
      return {
        ok: false,
        message: "Не передан id голосования.",
      }
    }

    const voteStatus = this.findActivePollAndVote(params[0], player)
    if (voteStatus === "VOTED_ALREADY") {
      return {
        ok: false,
        message: "Ты уже проголосовал.",
      }
    }
    if (voteStatus === "VOTE_NOT_FOUND") {
      return {
        ok: false,
        message: null,
      }
    }

    return {
      ok: true,
      message: `${player.userName}, ты проголосовал(а)!`,
    }
  }

  refuelWagon(woodAmount: number) {
    if (woodAmount < 0) {
      return
    }

    const wagon = this.getWagon()
    wagon.fuel += woodAmount * 5 * 40
  }

  emptyWagonFuel() {
    const wagon = this.getWagon()
    wagon.fuel = 0
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

  public startRaidAction(raidersCount = 0) {
    this.initEvent({
      title: "Начался рейд!",
      type: "RAID_STARTED",
      secondsToEnd: 60 * 5,
    })
    this.initRaiders(raidersCount)

    return {
      ok: true,
      message: null,
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

  public helpAction(player: Player) {
    if (!this.checkIfActionIsPossible("HELP")) {
      return {
        ok: false,
        message: null,
      }
    }
    return {
      ok: true,
      message: `${player.userName}, это интерактивная игра-чат, в которой может участвовать любой зритель! Пиши команды (примеры на экране) для управления своим юнитом. Вступай в наше комьюнити: ${DISCORD_SERVER_INVITE_URL}`,
    }
  }

  public githubAction(player: Player) {
    if (!this.checkIfActionIsPossible("GITHUB")) {
      return {
        ok: false,
        message: null,
      }
    }
    return {
      ok: true,
      message: `${player.userName}, код игры находится в репозитории: ${GITHUB_REPO_URL}`,
    }
  }

  public donateAction(player: Player) {
    if (!this.checkIfActionIsPossible("DONATE")) {
      return {
        ok: false,
        message: null,
      }
    }
    return {
      ok: true,
      message: `${player.userName}, поддержи игру: ${DONATE_URL}`,
    }
  }

  public async giftAction(player: Player, params: string[] | undefined) {
    if (!this.checkIfActionIsPossible("GIFT")) {
      return {
        ok: false,
        message: null,
      }
    }

    if (!params) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !подарить древесину`,
      }
    }

    const item = this.getItemTypeFromChatCommand(params[0])
    if (!item) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !подарить древесину`,
      }
    }

    const items = player.inventory?.items ?? []

    if (item === "WOOD") {
      const itemExist = items.find((item) => item.type === "WOOD")
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет древесины.`,
        }
      }

      await this.game.repository.addWoodToVillage(itemExist.amount)
      await player.addReputation(itemExist.amount)
      await player.inventory?.destroyItemInDB(itemExist.id)

      return {
        ok: true,
        message: `${player.userName}, ты подарил(а) деревне всю древесину! Твоя репутация возросла.`,
      }
    }
    if (item === "STONE") {
      const itemExist = items.find((item) => item.type === "STONE")
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет камня.`,
        }
      }

      await this.game.repository.addStoneToVillage(itemExist.amount)
      await player.addReputation(itemExist.amount)
      await player.inventory?.destroyItemInDB(itemExist.id)

      return {
        ok: true,
        message: `${player.userName}, ты подарил(а) деревне все камни! Твоя репутация возросла.`,
      }
    }

    return {
      ok: false,
      message: `${player.userName}, укажи конкретнее, например: !подарить древесину`,
    }
  }

  async sellAction(player: Player, params: string[] | undefined) {
    if (!this.checkIfActionIsPossible("SELL")) {
      return {
        ok: false,
        message: null,
      }
    }

    if (!params) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !продать древесину`,
      }
    }

    const item = this.getItemTypeFromChatCommand(params[0])
    if (!item) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !продать древесину`,
      }
    }

    const items = player.inventory?.items ?? []

    if (item === "WOOD") {
      const itemExist = items.find((item) => item.type === "WOOD")
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет древесины.`,
        }
      }

      await player.updateCoins(itemExist.amount)
      await player.inventory?.destroyItemInDB(itemExist.id)

      return {
        ok: true,
        message: `${player.userName}, ты продал(а) всю древесину торговцу!`,
      }
    }
    if (item === "STONE") {
      const itemExist = items.find((item) => item.type === "STONE")
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет камня.`,
        }
      }

      await player.updateCoins(itemExist.amount)
      await player.inventory?.destroyItemInDB(itemExist.id)

      return {
        ok: true,
        message: `${player.userName}, ты продал(а) все камни торговцу!`,
      }
    }

    return {
      ok: false,
      message: `${player.userName}, укажи конкретнее, например: !продать древесину`,
    }
  }

  async buyAction(player: Player, params: string[] | undefined) {
    if (!this.checkIfActionIsPossible("BUY")) {
      return {
        ok: false,
        message: null,
      }
    }

    if (!params) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !купить топор`,
      }
    }

    const item = this.getItemTypeFromChatCommand(params[0])
    if (!item) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !купить топор`,
      }
    }

    const items = player.inventory?.items ?? []

    if (item === "AXE") {
      const itemExist = items.find((item) => item.type === "AXE")
      if (itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя уже есть топор.`,
        }
      }

      const result = await player.buyItemFromDealer("AXE", 10, 1)
      if (!result) {
        return {
          ok: false,
          message: `${player.userName}, неа.`,
        }
      }

      return {
        ok: true,
        message: `${player.userName}, ты купил(а) топор у торговца!`,
      }
    }
    if (item === "PICKAXE") {
      const itemExist = items.find((item) => item.type === "PICKAXE")
      if (itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя уже есть кирка.`,
        }
      }

      const result = await player.buyItemFromDealer("PICKAXE", 10, 1)
      if (!result) {
        return {
          ok: false,
          message: `${player.userName}, неа.`,
        }
      }

      return {
        ok: true,
        message: `${player.userName}, ты купил(а) кирку у торговца!`,
      }
    }

    return {
      ok: false,
      message: `${player.userName}, укажи конкретнее, например: !купить топор`,
    }
  }

  getItemTypeFromChatCommand(text: string): ItemType | null {
    if (text === "древесину" || text === "древесина") {
      return "WOOD"
    }
    if (text === "камень" || text === "камни") {
      return "STONE"
    }
    if (text === "топор") {
      return "AXE"
    }
    if (text === "кирка" || text === "кирку") {
      return "PICKAXE"
    }

    return null
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

  generatePollForNewAdventure() {
    const random = getRandomInRange(1, 1500)
    if (random !== 1) {
      return
    }

    const votingEvents = this.events.filter(
      (e) => e.type === "VOTING_FOR_NEW_ADVENTURE_STARTED",
    )
    if (votingEvents.length >= 4) {
      return
    }

    const creatingEvent = this.events.find(
      (e) => e.type === "CREATING_NEW_ADVENTURE_STARTED",
    )

    if (creatingEvent || this.route) {
      return
    }

    const votesToSuccess =
      this.findActivePlayers().length >= 2 ? this.findActivePlayers().length : 2

    this.initEvent({
      type: "VOTING_FOR_NEW_ADVENTURE_STARTED",
      title: "Новый квест",
      secondsToEnd: 180,
      poll: {
        votes: [],
        status: "STARTED",
        votesToSuccess,
        id: this.generatePollId(),
      },
    })
  }

  generatePollId(): string {
    const id = getRandomInRange(10, 99).toString()
    for (const event of this.events) {
      if (event.type === "VOTING_FOR_NEW_ADVENTURE_STARTED") {
        if (event.poll?.id === id) {
          return this.generatePollId()
        }
      }
    }
    return id
  }

  findActivePollAndVote(pollId: string, player: Player) {
    for (const event of this.events) {
      if (event.type === "VOTING_FOR_NEW_ADVENTURE_STARTED") {
        if (event.poll?.id === pollId) {
          const voted = event.vote(player)
          if (!voted) {
            return "VOTED_ALREADY"
          }
          return "VOTE_SUCCESS"
        }
      }
    }

    return "VOTE_NOT_FOUND"
  }
}
