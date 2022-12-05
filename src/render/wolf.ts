import { IMAGES } from "../assets/images";
import { CELL_SIZE } from "../assets/constants";

export const renderWolf = (
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number }
) => {
  if (!ctx) return;

  ctx.drawImage(IMAGES.wolf, position.x, position.y, CELL_SIZE, CELL_SIZE);
};
