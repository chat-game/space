import { getRandomInRange } from "../../../../../packages/api-sdk/src";
import type { Group } from "../common";
import type { Game } from "../game";
import { Flag, Rabbit, Stone, Tree, Wolf } from "../objects";
import { GameScene } from "./gameScene";

interface IVillageSceneOptions {
  game: Game;
  group: Group | undefined;
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

    void this.play();
  }

  async initGroupPlayers() {
    if (!this.group) {
      return;
    }

    for (const player of this.group.players) {
      const instance = await this.initPlayer(player.id);
      this.objects.push(instance);
    }
  }

  private initTrees(count: number) {
    for (let i = 0; i < count; i++) {
      const size = getRandomInRange(40, 90);
      this.objects.push(new Tree({ size }));
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
    const outsideFlag = new Flag({
      x: -100,
      y: 620,
      id: "outside",
      isOnScreen: false,
    });
    const outsideRaidersCampFlag = new Flag({
      x: 4000,
      y: 650,
      id: "raiders-camp",
      isOnScreen: false,
    });
    this.objects.push(outsideFlag, outsideRaidersCampFlag);
    for (let i = 0; i < count; i++) {
      this.objects.push(new Flag({}));
    }
  }
}
