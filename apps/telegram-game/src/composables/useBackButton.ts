import { backButton } from '@telegram-apps/sdk-vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useBackButton() {
  let offClick: () => void = () => {}
  const route = useRoute()
  const router = useRouter()

  watch(() => route.name, () => {
    if (route.name === 'index') {
      backButton.hide()
      offClick()
    } else if (!backButton.isVisible()) {
      backButton.show()
      offClick = backButton.onClick(onBackButtonClick)
    }
  })

  function onBackButtonClick(): void {
    router.go(-1)
  }
}
