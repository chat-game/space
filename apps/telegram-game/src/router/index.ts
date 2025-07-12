import { createRouter, createWebHistory } from 'vue-router'
import LucideArchiveRestore from '~icons/lucide/archive-restore'
import LucideBookCheck from '~icons/lucide/book-check'
import LucideGamepad2 from '~icons/lucide/gamepad-2'
import LucideShoppingBag from '~icons/lucide/shopping-bag'
import LucideTrophy from '~icons/lucide/trophy'
import CharacterView from '@/views/CharacterView.vue'
import GameView from '@/views/GameView.vue'
import InventoryView from '@/views/InventoryView.vue'
import QuestView from '@/views/QuestView.vue'
import ShopView from '@/views/ShopView.vue'
import TopView from '@/views/TopView.vue'

export const routes = [
  {
    path: '/',
    name: 'game',
    component: GameView,
    icon: LucideGamepad2,
    meta: {
      title: 'route.title.game',
      type: 'MAIN_NAVIGATION',
    },
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryView,
    icon: LucideArchiveRestore,
    meta: {
      title: 'route.title.inventory',
      type: 'MAIN_NAVIGATION',
    },
  },
  {
    path: '/quest',
    name: 'quest',
    component: QuestView,
    icon: LucideBookCheck,
    meta: {
      title: 'route.title.quest',
      type: 'MAIN_NAVIGATION',
    },
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopView,
    icon: LucideShoppingBag,
    meta: {
      title: 'route.title.shop',
      type: 'MAIN_NAVIGATION',
    },
  },
  {
    path: '/top',
    name: 'top',
    component: TopView,
    icon: LucideTrophy,
    meta: {
      title: 'route.title.top',
      type: 'MAIN_NAVIGATION',
    },
  },
  {
    path: '/character',
    name: 'character',
    component: CharacterView,
    icon: undefined,
    meta: {
      title: 'route.title.character',
      type: 'INNER_PAGE',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
