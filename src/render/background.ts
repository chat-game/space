import { IMAGES } from "../assets/images";

export const renderBackground = (ctx: CanvasRenderingContext2D) => {
  if (!ctx) return;

  const image = IMAGES.background;

  // draw image in a pattern
  const pattern = ctx.createPattern(image, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
  }
};
