import { findCompletedStones } from "./db.repository.ts";

export async function serveStone() {
  // Check for completed
  setInterval(() => {
    void findCompletedStones();
  }, 5000);
}
