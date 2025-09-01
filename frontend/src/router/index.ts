import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth'

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
      component: () => import('../views/FAQs.vue'),
    },
    {
      path: '/my-bookings',
      name: 'my-bookings',
      component: () => import('../views/MyBookingsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminBookings.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.accessToken) {
    next('/login');
  } else if (to.meta.requiresAdmin && auth.user?.role !== 'ADMIN') {
    next('/');
  } else {
    next();
  }
});

export default router
