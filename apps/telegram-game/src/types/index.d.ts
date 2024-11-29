export interface ApplicationConfig {
  readonly VITE_WEBSOCKET_URL: string
}

declare global {
  interface Window {
    config: ApplicationConfig
  }
}
