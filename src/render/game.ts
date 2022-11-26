let x = 90;
let y = 34;
let held_directions: string[] = []; // State of which arrow keys we are holding down
const speed = 0.4; // How fast the character moves in pixels per frame
const PIXEL_SIZE = 2;

const placeCharacter = (
  mapDiv: HTMLDivElement,
  heroDiv: HTMLDivElement,
  hero: any
) => {
  if (!mapDiv || !heroDiv) return;

  const held_direction = held_directions[0];
  if (held_direction) {
    // if (held_direction === directions.right) {
    //   hero.x += speed;
    // }
    // if (held_direction === directions.left) {
    //   hero.x -= speed;
    // }
    // if (held_direction === directions.down) {
    //   hero.y += speed;
    // }
    // if (held_direction === directions.up) {
    //   hero.y -= speed;
    // }
    //heroDiv?.setAttribute("data-facing", held_direction);
  }
  //heroDiv?.setAttribute("data-walking", held_direction ? "true" : "false");

  // if (hero.direction) {
  //   heroDiv?.setAttribute("data-facing", hero.direction);
  // }

  // Limits
  // let leftLimit = -8;
  // let rightLimit = 16 * 11 + 8;
  // let topLimit = -8 + 32;
  // let bottomLimit = 16 * 7;
  // if (x < leftLimit) {
  //   x = leftLimit;
  // }
  // if (x > rightLimit) {
  //   x = rightLimit;
  // }
  // if (y < topLimit) {
  //   y = topLimit;
  // }
  // if (y > bottomLimit) {
  //   y = bottomLimit;
  // }

  let camera_left = (PIXEL_SIZE * 400) / 2 - 64;
  let camera_top = (PIXEL_SIZE * 250) / 2 - 64;

  mapDiv.style.transform = `translate3d( ${
    -hero.x * PIXEL_SIZE + camera_left
  }px, ${-hero.y * PIXEL_SIZE + camera_top}px, 0 )`;

  heroDiv.style.transform = `translate3d( ${hero.x * PIXEL_SIZE}px, ${
    hero.y * PIXEL_SIZE
  }px, 0 )`;
};

//Set up the game loop
export const step = (
  mapDiv: HTMLDivElement,
  heroDiv: HTMLDivElement,
  hero: any
) => {
  placeCharacter(mapDiv, heroDiv, hero);
  window.requestAnimationFrame(() => {
    step(mapDiv, heroDiv, hero);
  });
};

/* Direction key state */
const directions = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
};
const keys = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

// document.addEventListener("keydown", (e) => {
//   let key = e.key as "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
//   let direction = keys[key];
//   if (direction && held_directions.indexOf(direction) === -1) {
//     held_directions.unshift(direction);
//   }
// });
//
// document.addEventListener("keyup", (e) => {
//   let key = e.key as "ArrowRight" | "ArrowLeft" | "ArrowUp" | "ArrowDown";
//   let direction = keys[key];
//   let index = held_directions.indexOf(direction);
//   if (index > -1) {
//     held_directions.splice(index, 1);
//   }
// });
