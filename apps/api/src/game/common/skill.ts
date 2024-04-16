import { createId } from "@paralleldrive/cuid2";
import type { IGameSkill } from "../../../../../packages/api-sdk/src";
import { db } from "../../db/db.client";

interface ISkillOptions {
  id: string;
}

export class Skill implements IGameSkill {
  public id: string;
  public objectId: string | null = null;
  public type!: IGameSkill["type"];

  public lvl = 0;
  public xp = 0;
  public xpNextLvl = 0;

  constructor({ id }: ISkillOptions) {
    this.id = id;
  }

  public async init() {
    await this.readFromDB();
  }

  public async addXp(increment = 1) {
    this.xp += increment;

    if (this.xp >= this.xpNextLvl) {
      await this.lvlUpInDB();
      await this.init();
      return;
    }

    return db.skill.update({
      where: { id: this.id },
      data: { xp: { increment } },
    });
  }

  public lvlUpInDB() {
    const xpNextLvl = Math.floor(this.xpNextLvl * 1.5);
    return db.skill.update({
      where: { id: this.id },
      data: {
        lvl: { increment: 1 },
        xp: 0,
        xpNextLvl,
      },
    });
  }

  async readFromDB() {
    const skill = await db.skill.findUnique({
      where: { id: this.id },
    });
    if (!skill) {
      return;
    }

    this.objectId = skill.objectId;
    this.type = skill.type as IGameSkill["type"];
    this.lvl = skill.lvl;
    this.xp = skill.xp;
    this.xpNextLvl = skill.xpNextLvl;
  }

  public static async findAllInDB(objectId: string) {
    return db.skill.findMany({
      where: { objectId },
    });
  }

  public static createInDB(objectId: string, type: IGameSkill["type"]) {
    return db.skill.create({
      data: {
        id: createId(),
        objectId,
        type,
      },
    });
  }
}
