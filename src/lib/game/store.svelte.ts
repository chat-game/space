import type { GameOptions } from './types'

class GameOptionsStore implements GameOptions {
  #isReady = $state(false)
  #isPaused = $state(false)
  #isSocketOn = $state(false)
  #isSoundOn = $state(false)

  get isReady() {
    return this.#isReady
  }

  set isReady(option: boolean) {
    this.#isReady = option
  }

  get isPaused() {
    return this.#isPaused
  }

  set isPaused(option: boolean) {
    this.#isPaused = option
  }

  get isSocketOn() {
    return this.#isSocketOn
  }

  set isSocketOn(option: boolean) {
    this.#isSocketOn = option
  }

  get isSoundOn() {
    return this.#isSoundOn
  }

  set isSoundOn(option: boolean) {
    this.#isSoundOn = option
  }
}

export const gameOptions = new GameOptionsStore()
