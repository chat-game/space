import { db } from "./db.client";

export class DBRepository {
  private readonly db;

  constructor() {
    this.db = db;
  }

  findTrees() {
    return this.db.tree.findMany();
  }

  findStones() {
    return this.db.stone.findMany();
  }

  findPlayers() {
    return this.db.player.findMany();
  }
}
