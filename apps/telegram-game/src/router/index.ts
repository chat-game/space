import GameView from '@/views/GameView.vue'
import InventoryView from '@/views/InventoryView.vue'
import ShopView from '@/views/ShopView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'game',
      component: GameView,
    },
    {
      path: '/inventory',
      name: 'inventory',
      component: InventoryView,
    },
    {
      path: '/shop',
      name: 'shop',
      component: ShopView,
    },
  ],
})

export default router
