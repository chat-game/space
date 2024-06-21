/// <reference types="@sveltejs/kit" />
import type { IProfile, Locale } from '$lib/types'

declare global {
  namespace App {
    interface Locals {
      profile: null | IProfile
      locale: Locale
    }

    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
