import { ChopTreeScript } from '../../scripts/chopTreeScript'
import { MineStoneScript } from '../../scripts/mineStoneScript'
import { PlantNewTreeScript } from '../../scripts/plantNewTreeScript'
import type {
  Game,
  GameObject,
  GameObjectPlayer,
  GameSceneType,
  IGameActionResponse,
  IGameSceneAction, ItemType,
} from '$lib/game/types'
import { config } from '$lib/config'
import type { GameAction } from '$lib/game/actions/interface'
import { TreeObject } from '$lib/game/objects/treeObject'
import { Route } from '$lib/game/services/route/route'
import { StoneObject } from '$lib/game/objects/stoneObject'
import { VillageChunk } from '$lib/game/services/chunk/villageChunk'
import { Group } from '$lib/game/common/group'
import type { GameActionService } from '$lib/game/services/action/interface'
import { ANSWER } from '$lib/game/services/action/answer'

interface ICommandWithAction {
  id: string
  action: IGameSceneAction
  command: string
}

export class ActionService implements GameActionService {
  possibleCommands!: ICommandWithAction[]
  possibleActions!: IGameSceneAction[]
  activeActions!: IGameSceneAction[]
  game: Game

  constructor(game: Game) {
    this.game = game

    void this.initActions()
  }

  update() {}

  async initActions() {
    this.possibleActions = [
      'HELP',
      'GIFT',
      'TRADE',
      'DONATE',
      'REFUEL',
      'STEAL_FUEL',
      'CHOP',
      'MINE',
      'PLANT',
      'START_GROUP_BUILD',
      'DISBAND_GROUP',
      'JOIN_GROUP',
      'START_POLL',
      'VOTE',
      'START_CHANGING_SCENE',
      'START_RAID',
      'CREATE_NEW_PLAYER',
      'START_CREATING_NEW_ADVENTURE',
      'SHOW_MESSAGE',
      'GITHUB',
    ]
    this.activeActions = this.possibleActions
  }

  public findActionByCommand(command: string) {
    return this.possibleCommands.find((a) => a.command === command)
  }

  public findDynamicActionByCommand(command: string) {
    const quest = this.game.questService.findActionByCommand(command)
    if (quest) {
      return quest
    }

    const poll = this.game.eventService.findActionByCommandInPoll(command)
    if (poll) {
      return poll
    }
  }

  public async handleAction(
    action: IGameSceneAction,
    playerId: string,
    params?: string[],
  ) {
    const player = await this.game.playerService.findOrCreatePlayer(playerId)
    if (!player) {
      return ANSWER.NO_PLAYER_ERROR
    }

    this.game.group.join(player)
    player.updateLastActionAt()

    if (action === 'SHOW_MESSAGE') {
      return this.showMessageAction(player, params)
    }
    if (action === 'REFUEL') {
      return this.refuelAction(player, params)
    }
    if (action === 'CHOP') {
      return this.chopAction(player)
    }
    if (action === 'MINE') {
      return this.mineAction(player)
    }
    if (action === 'PLANT') {
      return this.plantAction(player)
    }
    if (action === 'START_RAID') {
      return this.startRaidAction(player, params)
    }
    if (action === 'START_CHANGING_SCENE') {
      // Admin only
      if (player.id !== config.game.adminPlayerId) {
        return ANSWER.ERROR
      }
      return this.startChangingSceneAction(player, params)
    }
    if (action === 'START_GROUP_BUILD') {
      // Admin only
      if (player.id !== config.game.adminPlayerId) {
        return ANSWER.ERROR
      }
      return this.startGroupBuildAction(player, params)
    }
    if (action === 'DISBAND_GROUP') {
      // Admin only
      if (player.id !== config.game.adminPlayerId) {
        return ANSWER.ERROR
      }
      return this.disbandGroupAction()
    }
    if (action === 'STEAL_FUEL') {
      return this.stealFuelAction(player)
    }
    if (action === 'HELP') {
      return this.helpAction(player)
    }
    if (action === 'GITHUB') {
      return this.githubAction(player)
    }
    if (action === 'DONATE') {
      return this.donateAction(player)
    }
    if (action === 'GIFT') {
      return this.giftAction(player, params)
    }
    if (action === 'TRADE') {
      return this.tradeAction(player, params)
    }
    if (action === 'CREATE_IDEA') {
      return this.createIdeaAction(player, params)
    }

    return ANSWER.ERROR
  }

  public async handleDynamicAction(
    action: GameAction,
    playerId: string,
    params: string[],
  ): Promise<IGameActionResponse> {
    const player = await this.game.playerService.findOrCreatePlayer(playerId)
    if (!player) {
      return ANSWER.NO_PLAYER_ERROR
    }

    this.game.group.join(player)
    player.updateLastActionAt()

    const answer = await action.live(player, params)
    if (answer) {
      return answer
    }

    return ANSWER.ERROR
  }

  public getAvailableCommands() {
    const commands: string[] = []
    for (const action of this.activeActions) {
      if (action === 'HELP') {
        commands.push('!помощь')
      }
      if (action === 'REFUEL') {
        commands.push('!заправить [кол-во]')
      }
      if (action === 'CHOP') {
        commands.push('!рубить')
      }
      if (action === 'MINE') {
        commands.push('!добыть')
      }
      if (action === 'GIFT') {
        commands.push('!подарить [название] [кол-во]')
      }
      if (action === 'DONATE') {
        commands.push('!донат')
      }
    }

    return commands
  }

  isActionPossible(action: IGameSceneAction): boolean {
    return !!this.activeActions.find((a) => a === action)
  }

  private startRaidAction(player: GameObjectPlayer, params?: string[]) {
    // First param is raidersCount
    const raidersCount = params ? Number(params[0]) : 0

    this.game.eventService.initEvent({
      title: 'The raid has started!',
      description: '',
      type: 'RAID_STARTED',
      secondsToEnd: 60 * 5,
    })
    this.game.initRaiders(raidersCount)

    // Raider points
    void player.addRaiderPoints(raidersCount)

    return ANSWER.OK
  }

  private async showMessageAction(player: GameObjectPlayer, params?: string[]) {
    if (!this.isActionPossible('SHOW_MESSAGE')) {
      return ANSWER.ERROR
    }

    if (!params || !params[0]) {
      return ANSWER.ERROR
    }

    const message = params[0]
    player.addMessage(message)

    return ANSWER.OK
  }

  private async stealFuelAction(player: GameObjectPlayer) {
    if (!this.isActionPossible('STEAL_FUEL')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    this.game.wagonService.wagon.emptyFuel()

    await player.addVillainPoints(1)

    return {
      ok: true,
      message: `${player.name}, and you're a villain!`,
    }
  }

  private async refuelAction(player: GameObjectPlayer, params?: string[]) {
    if (!this.isActionPossible('REFUEL')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    if (!params) {
      return ANSWER.NO_TARGET_ERROR
    }

    const count = this.getAmountFromChatCommand(params[0])
    if (!count) {
      return ANSWER.WRONG_AMOUNT_ERROR
    }

    const items = player.inventory?.items ?? []
    const itemExist = items.find((item) => item.type === 'WOOD')
    if (!itemExist) {
      return {
        ok: false,
        message: `${player.name}, you don't have wood.`,
      }
    }

    const isSuccess = await player.inventory?.reduceOrDestroyItem(
      itemExist.type,
      count,
    )
    if (!isSuccess) {
      return {
        ok: false,
        message: `${player.name}, not enough wood.`,
      }
    }

    await player.addRefuellerPoints(count)

    this.game.wagonService.wagon.refuel(count)

    return {
      ok: true,
      message: `${player.name}, you helped refuel the Wagon.`,
    }
  }

  getAmountFromChatCommand(text: string): number | null {
    if (typeof Number(text) === 'number' && Number(text) > 0) {
      return Math.round(Number(text))
    }

    return null
  }

  private async chopAction(player: GameObjectPlayer) {
    if (!this.isActionPossible('CHOP')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }
    if (player.script && !player.script.isInterruptible) {
      return ANSWER.BUSY_ERROR
    }

    const target = this.getTreeToChop()
    if (!target) {
      return ANSWER.NO_AVAILABLE_TREE_ERROR
    }

    const chopTreeFunc = (): boolean => {
      void player.chopTree()
      if (!player.target || player.target.state === 'DESTROYED') {
        player.state = 'IDLE'
        if (player.target instanceof TreeObject) {
          void player.inventory.addOrCreateItem('WOOD', player.target?.resource)
        }
        return true
      }
      return false
    }

    player.script = new ChopTreeScript({
      object: player,
      target,
      chopTreeFunc,
    })

    return ANSWER.OK
  }

  private async mineAction(player: GameObjectPlayer) {
    if (!this.isActionPossible('MINE')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }
    if (player.script && !player.script.isInterruptible) {
      return {
        ok: false,
        message: `${player.name}, you're busy right now.`,
      }
    }

    const target = this.getStoneToMine()
    if (!target) {
      return {
        ok: false,
        message: `${player.name}, there is no available stone.`,
      }
    }

    const mineStoneFunc = (): boolean => {
      void player.mineStone()
      if (!player.target || player.target.state === 'DESTROYED') {
        player.state = 'IDLE'
        if (player.target instanceof StoneObject) {
          void player.inventory.addOrCreateItem(
            'STONE',
            player.target?.resource,
          )
        }
        return true
      }
      return false
    }

    player.script = new MineStoneScript({
      object: player,
      target,
      mineStoneFunc,
    })

    return ANSWER.OK
  }

  private plantAction(player: GameObjectPlayer) {
    if (!this.isActionPossible('PLANT')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }
    if (player.script && !player.script.isInterruptible) {
      return {
        ok: false,
        message: `${player.name}, you're busy right now.`,
      }
    }

    if (this.game.chunkService.chunk instanceof VillageChunk) {
      const target = this.game.chunkService.chunk.checkIfNeedToPlantTree()
      if (!target) {
        return {
          ok: false,
          message: `${player.name}, no space available.`,
        }
      }

      const plantNewTreeFunc = () => {
        if (this.game.chunkService.chunk instanceof VillageChunk) {
          this.game.chunkService.chunk.plantNewTree(target)
        }
      }

      player.script = new PlantNewTreeScript({
        object: player,
        target,
        plantNewTreeFunc,
      })

      return ANSWER.OK
    }

    return ANSWER.ERROR
  }

  private startChangingSceneAction(_: GameObjectPlayer, params?: string[]) {
    if (!this.isActionPossible('START_CHANGING_SCENE')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    if (!params) {
      return ANSWER.NO_TARGET_ERROR
    }

    const scene = this.getSceneTypeFromChatCommand(params[1])
    if (!scene) {
      return ANSWER.NO_TARGET_ERROR
    }

    this.game.eventService.initEvent({
      type: 'SCENE_CHANGING_STARTED',
      title: 'Changing location',
      description: '',
      scene,
      secondsToEnd: 10,
    })

    return ANSWER.OK
  }

  getSceneTypeFromChatCommand(text: string): GameSceneType | null {
    if (text === 'деревня' || text === 'деревню') {
      return 'VILLAGE'
    }
    if (text === 'защиту' || text === 'защита') {
      return 'DEFENCE'
    }

    return null
  }

  private startGroupBuildAction(_: GameObjectPlayer, params?: string[]) {
    if (!this.isActionPossible('START_GROUP_BUILD')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    if (!params) {
      return ANSWER.NO_TARGET_ERROR
    }

    const scene = this.getSceneTypeFromChatCommand(params[1])
    if (!scene) {
      return ANSWER.NO_TARGET_ERROR
    }

    this.game.group = new Group()

    this.game.eventService.initEvent({
      type: 'GROUP_FORM_STARTED',
      title: 'The group is recruiting!',
      description: '',
      scene,
      secondsToEnd: 120,
    })

    return ANSWER.OK
  }

  private disbandGroupAction() {
    if (!this.isActionPossible('DISBAND_GROUP')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    this.game.group?.disband()

    return {
      ok: true,
      message: 'The group has been disbanded!',
    }
  }

  private helpAction(player: GameObjectPlayer) {
    if (!this.isActionPossible('HELP')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    return {
      ok: true,
      message: `${player.name}, this is an interactive chat game that any viewer can participate in! Basic commands: !chop, !mine. The remaining commands appear in events (on the right of the screen). Join our community: ${config.discordServerInviteUrl}`,
    }
  }

  private githubAction(player: GameObjectPlayer) {
    if (!this.isActionPossible('GITHUB')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    return {
      ok: true,
      message: `${player.name}, the game code is in the repository: ${config.githubRepoUrl}`,
    }
  }

  private donateAction(player: GameObjectPlayer) {
    if (!this.isActionPossible('DONATE')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }
    return {
      ok: true,
      message: `${player.name}, support the game: ${config.donateUrl}`,
    }
  }

  private async giftAction(player: GameObjectPlayer, params: string[] | undefined) {
    if (!this.isActionPossible('GIFT')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    if (!params) {
      return {
        ok: false,
        message: `${player.name}, be more specific.`,
      }
    }

    const item = this.getItemTypeFromChatCommand(params[0])
    if (!item) {
      return {
        ok: false,
        message: `${player.name}, be more specific.`,
      }
    }

    const amount = this.getAmountFromChatCommand(params[1])
    if (!amount) {
      return {
        ok: false,
        message: `${player.name}, be more specific.`,
      }
    }

    const warehouse = this.game.chunkService.chunk?.warehouse

    if (item === 'WOOD') {
      const isSuccess = await player.inventory.reduceOrDestroyItem(item, amount)
      if (!isSuccess) {
        return {
          ok: false,
          message: `${player.name}, you don't have enough wood.`,
        }
      }

      await warehouse?.inventory.addOrCreateItem(item, amount)
      await player.addReputation(amount)

      return {
        ok: true,
        message: `${player.name}, you gave wood to the village! Your reputation has increased.`,
      }
    }
    if (item === 'STONE') {
      const isSuccess = await player.inventory.reduceOrDestroyItem(item, amount)
      if (!isSuccess) {
        return {
          ok: false,
          message: `${player.name}, you don't have enough stone.`,
        }
      }

      await warehouse?.inventory.addOrCreateItem(item, amount)
      await player.addReputation(amount)

      return {
        ok: true,
        message: `${player.name}, you gave stones to the village! Your reputation has increased.`,
      }
    }

    return {
      ok: false,
      message: `${player.name}, be more specific.`,
    }
  }

  getItemTypeFromChatCommand(text: string): ItemType | null {
    if (text === 'wood') {
      return 'WOOD'
    }
    if (text === 'stone') {
      return 'STONE'
    }
    if (text === 'axe') {
      return 'AXE'
    }
    if (text === 'pickaxe') {
      return 'PICKAXE'
    }

    return null
  }

  private async tradeAction(player: GameObjectPlayer, params: string[] | undefined) {
    if (!this.isActionPossible('TRADE')) {
      return ANSWER.CANT_DO_THIS_NOW_ERROR
    }

    if (!params) {
      return ANSWER.NO_TARGET_ERROR
    }

    const amount = this.getAmountFromChatCommand(params[1])
    if (!amount) {
      return ANSWER.WRONG_AMOUNT_ERROR
    }

    const status = await this.game.tradeService.findActiveOfferAndTrade(
      params[0],
      amount,
      player,
    )
    if (status === 'OFFER_ERROR') {
      return {
        ok: false,
        message: 'Something is wrong. The deal fell through.',
      }
    }
    if (status === 'OFFER_NOT_FOUND') {
      return ANSWER.NO_TARGET_ERROR
    }

    return {
      ok: true,
      message: `${player.name}, successful trade deal!`,
    }
  }

  private createIdeaAction(player: GameObjectPlayer, params: string[] | undefined) {
    const text = params ? params[0] : ''

    this.game.eventService.initEvent({
      title: 'New idea from Twitch Viewer!',
      description: `${player.name}: ${text}`,
      type: 'IDEA_CREATED',
      secondsToEnd: 60 * 3,
    })

    return ANSWER.OK
  }

  getTreeToChop() {
    // Part 1: Check trees on Wagon Path
    const onlyOnPath = this.game.children.filter(
      (obj) =>
        obj instanceof TreeObject
        && obj.state !== 'DESTROYED'
        && !obj.isReserved
        && obj.isOnWagonPath,
    )
    if (onlyOnPath && onlyOnPath.length > 0) {
      return this.determineNearestObject(
        this.game.wagonService.wagon,
        onlyOnPath,
      ) as TreeObject
    }

    // Part 2: Check nearest free tree
    const other = this.game.children.filter(
      (obj) =>
        obj instanceof TreeObject
        && obj.state !== 'DESTROYED'
        && !obj.isReserved
        && obj.isReadyToChop,
    )
    if (other && other.length > 0) {
      return this.determineNearestObject(this.game.wagonService.wagon, other) as TreeObject
    }
  }

  getStoneToMine() {
    // Part 1: Check on Wagon Path
    const onlyOnPath = this.game.children.filter(
      (obj) =>
        obj instanceof StoneObject
        && obj.state !== 'DESTROYED'
        && !obj.isReserved
        && obj.isOnWagonPath,
    )
    if (onlyOnPath && onlyOnPath.length > 0) {
      return this.determineNearestObject(
        this.game.wagonService.wagon,
        onlyOnPath,
      ) as StoneObject
    }

    // Part 2: Check nearest free
    const other = this.game.children.filter(
      (obj) =>
        obj instanceof StoneObject && obj.state !== 'DESTROYED' && !obj.isReserved,
    )
    if (other && other.length > 0) {
      return this.determineNearestObject(
        this.game.wagonService.wagon,
        other,
      ) as StoneObject
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
    let shortestDistance

    for (const object of objects) {
      const distance = Route.getDistanceBetween2Points(point, object)
      if (!shortestDistance || distance < shortestDistance) {
        shortestDistance = distance
        closestObject = object
      }
    }

    return closestObject
  }
}
