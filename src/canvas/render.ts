import { IMAGES } from "./images";

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const CELL_SIZE = 64;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

let lastFrameTime = 0;
let fps = 0;

// Set canvas to size of window
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// On window resize, resize canvas
window.addEventListener("resize", resizeCanvas);

let wolfX = 100;
// Change the wolf's X
function moveWolf() {
  wolfX += 1;

  if (wolfX > windowWidth) {
    wolfX = 0;
  }
}

function render(time: number = 0) {
  if (!ctx) return;

  ctx.clearRect(0, 0, windowWidth, windowHeight);

  // Main render loop
  drawBackground();
  drawHero();

  // Wolves
  drawWolf({ x: wolfX, y: 100 });
  drawWolf({ x: wolfX, y: 200 });
  drawWolf({ x: wolfX, y: 300 });
  drawWolf({ x: wolfX, y: 400 });
  drawWolf({ x: wolfX, y: 500 });
  //
  moveWolf();

  // FPS
  fps = Math.floor(1 / ((performance.now() - lastFrameTime) / 1000));
  lastFrameTime = time;
  drawFPS();

  requestAnimationFrame(render);
}

function drawHero() {
  if (!ctx) return;

  const image = IMAGES.hero;
  const x = windowWidth / 2 - CELL_SIZE / 2;
  const y = windowHeight / 2 - CELL_SIZE / 2;

  ctx.drawImage(image, x, y, CELL_SIZE, CELL_SIZE);
}

function drawWolf({ x, y }: { x: number; y: number }) {
  if (!ctx) return;
  if (!x || !y) return;

  const image = IMAGES.wolf;

  ctx.drawImage(image, x, y, CELL_SIZE, CELL_SIZE);
}

function drawBackground() {
  if (!ctx) return;

  const image = IMAGES.background;

  // draw image in a pattern
  const pattern = ctx.createPattern(image, "repeat");
  if (pattern) {
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, windowWidth, windowHeight);
  }
}

// Draw FPS
function drawFPS() {
  if (!ctx) return;

  ctx.font = "16px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("FPS: " + fps, windowWidth - 100, 20);
}

function init() {
  resizeCanvas();
  render();
  console.log("Game started!");
}

// Start!
init();

export { init };
