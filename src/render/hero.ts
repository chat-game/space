import { IMAGES } from "../assets/images";
import { CELL_SIZE } from "../assets/constants";

export const renderHero = (ctx: CanvasRenderingContext2D, hero: any) => {
  if (!ctx) return;

  ctx.drawImage(IMAGES.hero, hero.x, hero.y, CELL_SIZE, CELL_SIZE);
};