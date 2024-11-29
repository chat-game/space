import type { ApplicationConfig } from './../types'

export function getEnv(name: keyof ApplicationConfig, defaultValue: string = '') {
  return window?.config?.[name] || import.meta.env[name] || defaultValue
}
