import { createId } from "@paralleldrive/cuid2";
import type {
  Skill as ISkill,
  SkillType,
} from "../../../../../packages/api-sdk/src";
import { db } from "../../db/db.client";

export class Skill implements ISkill {
  public id: string;
  public objectId: string | null = null;
  public type: SkillType | null = null;

  public lvl = 0;
  public xp = 0;
  public xpNextLvl = 0;

  constructor(id: string) {
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
    this.type = skill.type as SkillType;
    this.lvl = skill.lvl;
    this.xp = skill.xp;
    this.xpNextLvl = skill.xpNextLvl;
  }

  public static async findAllInDB(objectId: string) {
    return db.skill.findMany({
      where: { objectId },
    });
  }

  public static createInDB(objectId: string, type: SkillType) {
    return db.skill.create({
      data: {
        id: createId(),
        objectId,
        type,
      },
    });
  }
}
