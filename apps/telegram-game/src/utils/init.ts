import {
  $debug,
  backButton,
  initData,
  init as initSDK,
  miniApp,
  themeParams,
  viewport,
} from '@telegram-apps/sdk-vue'

/**
 * Initializes the application and configures its dependencies.
 */
export function init(debug: boolean): void {
  // Set @telegram-apps/sdk-react debug mode.
  $debug.set(debug)

  // Initialize special event handlers for Telegram Desktop, Android, iOS, etc.
  // Also, configure the package.
  initSDK()

  // Check if all required components are supported.
  if (!backButton.isSupported() || !miniApp.isSupported()) {
    throw new Error('ERR_NOT_SUPPORTED')
  }

  // Mount all components used in the project.
  backButton.mount()
  miniApp.mount()
  themeParams.mount()
  initData.restore()
  void viewport
    .mount()
    .catch((e) => {
      console.error('Something went wrong mounting the viewport', e)
    })
    .then(() => {
      viewport.bindCssVars()
    })

  // Define components-related CSS variables.
  miniApp.bindCssVars()
  themeParams.bindCssVars()
}
