// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { IProfile } from "$lib/types";

declare global {
  namespace App {
    interface Locals {
      profile: null | IProfile
    }

    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export type {}
