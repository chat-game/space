import { IMAGES } from "../assets/images";
import { CELL_SIZE } from "../assets/constants";

export const renderHero = (
  ctx: CanvasRenderingContext2D,
  position: { x: number; y: number }
) => {
  if (!ctx) return;

  ctx.drawImage(IMAGES.hero, position.x, position.y, CELL_SIZE, CELL_SIZE);
};

export const renderHeroMovingTo = (
  ctx: CanvasRenderingContext2D,
  movingTo: { x: number; y: number },
  isMoving: boolean
) => {
  if (!ctx || !isMoving) return;

  ctx.save();
  ctx.globalAlpha = 0.7;
  ctx.drawImage(
    IMAGES.hero,
    movingTo.x,
    movingTo.y,
    CELL_SIZE * 0.5,
    CELL_SIZE * 0.5
  );
  ctx.restore();
};
