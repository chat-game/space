/// <reference types="@sveltejs/kit" />
import type { IProfile } from '$lib/types'

declare global {
  namespace App {
    interface Locals {
      profile: null | IProfile
      lang: string
    }

    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
