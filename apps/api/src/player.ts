import { findInactivePlayers } from "./db.repository.ts";

export async function servePlayer() {
  // Move inactive players
  setInterval(() => {
    void findInactivePlayers();
  }, 5000);
}
