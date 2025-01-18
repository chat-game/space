import {
  $debug,
  backButton,
  closingBehavior,
  disableVerticalSwipes,
  initData,
  init as initSDK,
  miniApp,
  swipeBehavior,
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
  swipeBehavior.mount()
  closingBehavior.mount()
  initData.restore()
  viewport
    .mount()
    .catch((e) => {
      console.error('Something went wrong mounting the viewport', e)
    })
    .then(() => {
      viewport.bindCssVars()

      if (viewport.requestFullscreen.isAvailable()) {
        viewport.requestFullscreen().finally(() => {
          // Wait
          setTimeout(() => {
            // The app is now in fullscreen
            if (window.innerWidth > 600) {
              // Application should be in fullscreen mode only on small screens!
              viewport.exitFullscreen()
            }
          }, 50)
        })
      }
    })

  // Define components-related CSS variables.
  miniApp.bindCssVars()
  themeParams.bindCssVars()

  if (disableVerticalSwipes.isAvailable()) {
    disableVerticalSwipes()
  }
  if (closingBehavior.enableConfirmation.isAvailable()) {
    closingBehavior.enableConfirmation()
  }

  // It will listen for changes in viewport size (even with the changes by opening a Virtual Keyboard), then apply the correct size into body of HTML.
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      document.body.style.height = `${window.visualViewport?.height}px`
    })
  }
  // This will ensure user never overscroll the page
  window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
      window.scrollTo(0, 0)
    }
  })

  // Add Eruda if needed.
  // if (debug) {
  //   import('eruda')
  //     .then((lib) => lib.default.init())
  //     .catch(console.error)
  // }
}
