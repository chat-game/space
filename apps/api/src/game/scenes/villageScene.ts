import type { Group } from "../common"
import type { Game } from "../game"
import { Rabbit, Wolf } from "../objects"
import { GameScene } from "./gameScene"

interface IVillageSceneOptions {
  game: Game
  group: Group | undefined
}

export class VillageScene extends GameScene {
  constructor({ game, group }: IVillageSceneOptions) {
    super({
      game,
      group,
      possibleActions: [
        "HELP",
        "CHOP",
        "MINE",
        "GIFT",
        "SELL",
        "BUY",
        "DONATE",
        "START_GROUP_BUILD",
        "DISBAND_GROUP",
        "JOIN_GROUP",
        "START_CHANGING_SCENE",
        "CREATE_NEW_PLAYER",
      ],
    })

    void this.init()
  }

  public async init() {
    await this.initGroupPlayers()
    this.initRabbits(8)
    this.initWolfs(4)

    void this.play()
  }

  async initGroupPlayers() {
    if (!this.group) {
      return
    }

    for (const player of this.group.players) {
      const instance = await this.initPlayer(player.id)
      this.objects.push(instance)
    }
  }

  private initRabbits(count: number) {
    for (let i = 0; i < count; i++) {
      this.objects.push(new Rabbit())
    }
  }

  private initWolfs(count: number) {
    for (let i = 0; i < count; i++) {
      this.objects.push(new Wolf())
    }
  }
}
