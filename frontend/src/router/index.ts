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
      path: '/promo/:code',
      name: 'promo',
      component: () => import('../views/PromoLandingView.vue'),
    },
    {
      path: '/ref/:code',
      name: 'referral-landing',
      component: () => import('../views/ReferralLandingView.vue'),
    },
    {
      path: '/my-referral',
      name: 'my-referral',
      component: () => import('../views/ReferralView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/services/rv',
      name: 'service-rv',
      component: () => import('../views/RVDetailView.vue'),
    },
    {
      path: '/services/boat',
      name: 'service-boat',
      component: () => import('../views/BoatDetailView.vue'),
    },
    {
      path: '/services/motorcycle',
      name: 'service-motorcycle',
      component: () => import('../views/MotorcycleDetailView.vue'),
    },
    {
      path: '/services/:type',
      name: 'service-detail',
      component: () => import('../views/ServiceDetailView.vue'),
    },
    {
      path: '/business-contact',
      name: 'business-contact',
      component: () => import('../views/BusinessContactView.vue'),
    },
    {
      path: '/membership',
      name: 'membership',
      component: () => import('../views/MembershipView.vue'),
    },
    {
      path: '/gift-cards',
      name: 'gift-cards',
      component: () => import('../views/GiftCardsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
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
