import { getDatePlusMinutes } from "../../../../../packages/api-sdk/src";
import type { Flag } from "../objects";
import { Raider } from "../objects/raider";

export class Raid {
  public raiders: Raider[] = [];
  public raidEndsAt!: Date;
  public raidDeletesAt!: Date;

  constructor(raidersCount: number) {
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

  moveAllRaidersBackToCamp(flag: Flag) {
    for (const raider of this.raiders) {
      raider.target = flag;
      raider.state = "MOVING";
    }
  }
}
