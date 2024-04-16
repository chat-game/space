import type { Group } from "../common";
import type { Game } from "../game";
import { Flag, Rabbit, Stone, Tree, Wolf } from "../objects";
import { GameScene } from "./gameScene";

export class VillageScene extends GameScene {
  constructor(game: Game, group: Group | undefined) {
    super({
      game,
      group,
      canAddNewPlayer: true,
      possibleActions: [
        "HELP",
        "CHOP",
        "MINE",
        "DONATE",
        "START_GROUP_BUILD",
        "DISBAND_GROUP",
        "JOIN_GROUP",
      ],
    });

    void this.init();
  }

  public async init() {
    await this.initGroupPlayers();
    this.initTrees(30);
    this.initStones(15);
    this.initRabbits(8);
    this.initWolfs(4);
    this.initFlags(30);
  }

  private initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      this.objects.push(new Tree());
    }
  }

  private initStones(count: number) {
    for (let i = 0; i < count; i++) {
      this.objects.push(new Stone());
    }
  }

  private initRabbits(count: number) {
    for (let i = 0; i < count; i++) {
      this.objects.push(new Rabbit());
    }
  }

  private initWolfs(count: number) {
    for (let i = 0; i < count; i++) {
      this.objects.push(new Wolf());
    }
  }

  private initFlags(count: number) {
    const outsideFlag = new Flag(-100, 600, "outside", false);
    const outsideRaidersCampFlag = new Flag(4000, 650, "raiders-camp", false);
    this.objects.push(outsideFlag, outsideRaidersCampFlag);
    for (let i = 0; i < count; i++) {
      this.objects.push(new Flag());
    }
  }
}
