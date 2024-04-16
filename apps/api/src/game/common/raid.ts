import {
  type IGameObjectFlag,
  type IGameRaid,
  getDatePlusMinutes,
} from "../../../../../packages/api-sdk/src";
import { Raider } from "../objects";

interface IRaidOptions {
  raidersCount: number;
}

export class Raid implements IGameRaid {
  public raiders: Raider[] = [];
  public raidEndsAt!: Date;
  public raidDeletesAt!: Date;

  constructor({ raidersCount }: IRaidOptions) {
    this.init(raidersCount);
  }

  init(raidersCount: number) {
    this.raiders = this.initRaiders(raidersCount);
    this.raidEndsAt = getDatePlusMinutes(10);
    this.raidDeletesAt = getDatePlusMinutes(12);
  }

  private initRaiders(count: number) {
    const raiders = [];
    for (let i = 0; i < count; i++) {
      raiders.push(new Raider());
    }
    return raiders;
  }

  moveAllRaidersBackToCamp(flag: IGameObjectFlag) {
    for (const raider of this.raiders) {
      raider.target = flag;
      raider.state = "MOVING";
    }
  }
}
