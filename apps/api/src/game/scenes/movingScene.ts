import type { Group } from "../common";
import type { Game } from "../game";
import { Flag, Wagon } from "../objects";
import { GameScene } from "./gameScene";

interface IMovingSceneOptions {
  game: Game;
  group: Group | undefined;
}

export class MovingScene extends GameScene {
  constructor({ game, group }: IMovingSceneOptions) {
    super({
      game,
      group,
      possibleActions: [
        "HELP",
        "CHOP",
        "MINE",
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
    this.generateRandomVillage({ x: 1000, y: 1000 });
    this.generateRandomForest({ x: 4000, y: 3000 });
    this.generateRandomVillage({ x: 8000, y: 3000 });

    this.initWagon();
    const wagon = this.getWagon();
    if (wagon) {
      this.initWagonMovementFlags({
        startX: wagon.x,
        startY: wagon.y,
        endX: 7900,
        endY: 3200,
      });

      const finalFlag = this.objects.find(
        (obj) => obj instanceof Flag && obj.type === "WAGON_MOVEMENT",
      );
      if (finalFlag) {
        wagon.target = finalFlag;
        wagon.state = "MOVING";
      }
    }

    await this.initGroupPlayers();

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

  initWagon() {
    const wagon = new Wagon({ x: 500, y: 1100 });
    this.objects.push(wagon);
  }
}
