import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue'),
    },
    {
      path: '/vehicles',
      name: 'vehicles',
      component: () => import('../views/VehicleSelectionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/address-selection',
      name: 'AddressSelectionView',
      component: () => import('../views/AddressSelectionView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/booking',
      name: 'BookingView',
      component: () => import('../views/BookingView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/choosing-service',
      name: 'ChoosingServiceView',
      component: () => import('../views/ChoosingServiceView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/thank-you',
      name: 'thank-you',
      component: () => import('../views/ThankYouView.vue')
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

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.accessToken) {
    next('/login');
  } else {
    next();
  }
});

export default router
