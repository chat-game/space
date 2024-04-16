import { createId } from "@paralleldrive/cuid2";
import type {
  GameGroup,
  GameSceneType,
  Player,
} from "../../../../../packages/api-sdk/src";

export class Group implements GameGroup {
  id: string;
  players: Player[] = [];
  target: GameSceneType;

  constructor(creator: Player, target: GameSceneType) {
    this.id = createId();

    this.join(creator);
    this.target = target;
  }

  join(player: Player): boolean {
    const check = this.findPlayer(player.id);
    if (check) {
      return false;
    }

    this.players.push(player);
    return true;
  }

  findPlayer(id: string) {
    return this.players.find((p) => p.id === id);
  }

  disband() {
    this.players = [];
  }
}
