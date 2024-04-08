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

  findActivePlayers() {
    const milliseconds = 20 * 60 * 1000;
    const gte = new Date(new Date().getTime() - milliseconds);

    return this.db.player.findMany({
      where: {
        lastActionAt: { gte },
      },
    });
  }
}
