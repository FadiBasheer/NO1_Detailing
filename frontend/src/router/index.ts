import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('../views/VehicleSelectionView.vue'),
    },
    {
      path: '/address-selection',
      name: 'AddressSelectionView',
      component: () => import('@/views/AddressSelectionView.vue')
    },
    {
      path: '/booking',
      name: 'BookingView',
      component: () => import('@/views/BookingView.vue')
    },
    {
      path: '/FAQs',
      name: 'FAQs',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/FAQs.vue'),
    },
  ],
})

export default router
