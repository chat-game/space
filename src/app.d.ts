/// <reference types="@sveltejs/kit" />
import type { Locale, Profile } from '$lib/types'

declare global {
  namespace App {
    interface Locals {
      profile: null | Profile
      locale: Locale
    }

    // interface Error {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}
