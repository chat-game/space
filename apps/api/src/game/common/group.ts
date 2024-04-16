import { createId } from "@paralleldrive/cuid2";
import type {
  GameSceneType,
  IGameGroup,
  IGameObjectPlayer,
} from "../../../../../packages/api-sdk/src";

interface IGroupOptions {
  creator: IGameObjectPlayer;
  target: GameSceneType;
}

export class Group implements IGameGroup {
  id: string;
  players: IGameObjectPlayer[] = [];
  target: GameSceneType;

  constructor({ creator, target }: IGroupOptions) {
    this.id = createId();

    this.join(creator);
    this.target = target;
  }

  join(player: IGameObjectPlayer): boolean {
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
