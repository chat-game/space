import GameView from '@/views/GameView.vue'
import InventoryView from '@/views/InventoryView.vue'
import ShopView from '@/views/ShopView.vue'
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
      title: 'Игра',
    },
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: InventoryView,
    icon: LucideArchiveRestore,
    meta: {
      title: 'Инвентарь',
    },
  },
  {
    path: '/quest',
    name: 'quest',
    component: InventoryView,
    icon: LucideBookCheck,
    meta: {
      title: 'Задания',
    },
  },
  {
    path: '/shop',
    name: 'shop',
    component: ShopView,
    icon: LucideShoppingBag,
    meta: {
      title: 'Магазин',
    },
  },
  {
    path: '/top',
    name: 'top',
    component: ShopView,
    icon: LucideTrophy,
    meta: {
      title: 'Топ',
    },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
