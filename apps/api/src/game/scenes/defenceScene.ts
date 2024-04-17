import type { Group } from "../common";
import type { Game } from "../game";
import { Stone, Tree } from "../objects";
import { GameScene } from "./gameScene";

export class DefenceScene extends GameScene {
  constructor(game: Game, group: Group | undefined) {
    super({
      game,
      group,
      canAddNewPlayer: false,
      possibleActions: [
        "CHOP",
        "MINE",
        "START_CHANGING_SCENE",
        "HELP",
        "DONATE",
      ],
    });

    void this.init();
  }

  public async init() {
    await this.initGroupPlayers();
    this.initTrees(6);
    this.initStones(4);

    this.initEvent({
      type: "COUNTDOWN_NEXT_WAVE_STARTED",
      title: "Скоро будет волна",
      secondsToEnd: 60 * 5,
    });
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
}
