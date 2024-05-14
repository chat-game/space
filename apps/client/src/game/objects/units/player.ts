import type {
  IGameObjectPlayer,
  IGameSkill,
} from "../../../../../../packages/api-sdk/src"
import { PlayerInterface } from "../../components/playerInterface"
import type { Game } from "../../game"
import { Unit } from "./unit"

interface IPlayerOptions {
  game: Game
  object: IGameObjectPlayer
}

export class Player extends Unit implements IGameObjectPlayer {
  reputation!: number
  villainPoints!: number
  refuellerPoints!: number
  userName!: string
  skills!: IGameSkill[]
  lastActionAt!: IGameObjectPlayer["lastActionAt"]

  constructor({ game, object }: IPlayerOptions) {
    super({ game, object })
    this.update(object)

    this.init()
  }

  init() {
    super.init()

    this.interface = new PlayerInterface(this)
    super.addChild(this.interface)
  }

  animate() {
    super.animate()

    this.interface.animate()
    this.showToolInHand()
  }

  showToolInHand() {
    let interfaceContainer: PlayerInterface | undefined

    for (const container of this.children) {
      if (container instanceof PlayerInterface) {
        interfaceContainer = container
      }
    }

    if (!interfaceContainer) {
      return
    }

    if (this.state === "CHOPPING") {
      interfaceContainer.showAxeInHand()
    }
    if (this.state === "MINING") {
      interfaceContainer.showPickaxeInHand()
    }
  }

  update(object: IGameObjectPlayer) {
    super.update(object)

    this.reputation = object.reputation
    this.villainPoints = object.villainPoints
    this.refuellerPoints = object.refuellerPoints
    this.userName = object.userName
    this.skills = object.skills
    this.lastActionAt = object.lastActionAt
  }
}
