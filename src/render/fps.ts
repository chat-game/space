export const renderFPS = (ctx: CanvasRenderingContext2D, fps: number) => {
  if (!ctx) return;

  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("FPS: " + fps, window.innerWidth - 100, 20);
};
