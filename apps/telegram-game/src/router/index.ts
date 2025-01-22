import GameView from '@/views/GameView.vue'
import InventoryView from '@/views/InventoryView.vue'
import QuestView from '@/views/QuestView.vue'
import ShopView from '@/views/ShopView.vue'
import TopView from '@/views/TopView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import LucideArchiveRestore from '~icons/lucide/archive-restore'
import LucideBookCheck from '~icons/lucide/book-check'
import LucideGamepad2 from '~icons/lucide/gamepad-2'
import LucideShoppingBag from '~icons/lucide/shopping-bag'
import LucideTrophy from '~icons/lucide/trophy'

export const routes = [
  {
    path: '/',
    name: 'game',
    component: GameView,
    icon: LucideGamepad2,
    meta: {
      title: 'route.title.game',
    },
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryView,
    icon: LucideArchiveRestore,
    meta: {
      title: 'route.title.inventory',
    },
  },
  {
    path: '/quest',
    name: 'quest',
    component: QuestView,
    icon: LucideBookCheck,
    meta: {
      title: 'route.title.quest',
    },
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopView,
    icon: LucideShoppingBag,
    meta: {
      title: 'route.title.shop',
    },
  },
  {
    path: '/top',
    name: 'top',
    component: TopView,
    icon: LucideTrophy,
    meta: {
      title: 'route.title.top',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
