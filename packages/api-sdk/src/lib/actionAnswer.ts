export const ANSWER = {
  OK: {
    ok: true,
    message: null,
  },
  DONATE_WOOD_OK: {
    ok: true,
    message: "You gave wood to the village! Your reputation has increased.",
  },
  ERROR: {
    ok: false,
    message: null,
  },
  BUSY_ERROR: {
    ok: false,
    message: "You're busy right now",
  },
  CANT_DO_THIS_NOW_ERROR: {
    ok: false,
    message: "This cannot be done now.",
  },
  NO_PLAYER_ERROR: {
    ok: false,
    message: "You are not in active game :(",
  },
  NO_TARGET_ERROR: {
    ok: false,
    message: "No target specified.",
  },
  NO_SPACE_AVAILABLE_ERROR: {
    ok: false,
    message: "No space available.",
  },
  WRONG_AMOUNT_ERROR: {
    ok: false,
    message: "Incorrect quantity specified.",
  },
  ALREADY_VOTED_ERROR: {
    ok: false,
    message: "You've already voted.",
  },
  NOT_ENOUGH_PARAMS_ERROR: {
    ok: false,
    message: "Be more specific.",
  },
  NOT_ENOUGH_WOOD_ERROR: {
    ok: false,
    message: "You don't have enough wood.",
  },
}
