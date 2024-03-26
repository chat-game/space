import { findCompletedTrees, growTrees } from "./db.repository.ts";

export async function serveTree() {
  // Slow grow
  setInterval(() => {
    void growTrees();
  }, 5000);

  // Check for completed
  setInterval(() => {
    void findCompletedTrees();
  }, 5000);
}
