import type { Group } from "../common";
import type { Game } from "../game";
import { Wagon } from "../objects";
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
        "START_CREATING_NEW_ADVENTURE",
      ],
    });

    void this.init();
  }

  public async init() {
    const village = this.initStartingVillage();
    const wagonStartPoint = village.getWagonStopPoint();

    this.initWagon(wagonStartPoint);
    await this.initGroupPlayers();

    void this.play();
  }

  initStartingVillage() {
    const area = {
      width: 2500,
      height: 2000,
      center: {
        x: Math.round(2500 / 2),
        y: Math.round(2000 / 2),
      },
    };
    return this.generateRandomVillage({
      center: area.center,
      width: area.width,
      height: area.height,
    });
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

  initWagon({ x, y }: { x: number; y: number }) {
    const wagon = new Wagon({ x, y });
    this.objects.push(wagon);
  }
}
