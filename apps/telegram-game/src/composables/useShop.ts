import type { Product } from '@chat-game/types'
import { useFetch } from '@vueuse/core'

const { data, execute: refreshShop } = useFetch('https://chatgame.space/api/shop').get().json<Product[]>()

export function useShop() {
  return { products: data, refreshShop }
}
