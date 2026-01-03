<template>
  <header class="header">
    <router-link to="/" class="logo">Yumeeco</router-link>
    <nav :class="{ 'nav-open': isMenuOpen }">
      <ul>

        <!-- Services dropdown -->
        <li class="dropdown">
          <p class="dropdown-btn" @click="toggleDropdown('services')">Services &#x2BC6;</p>
          <ul class="dropdown-menu" :class="{ 'open': activeDropdown === 'services' }">
            <li><router-link to="/services/car" @click="closeAll">Car Detailing</router-link></li>
            <li><router-link to="/services/rv" @click="closeAll">RV Detailing</router-link></li>
            <li><router-link to="/services/boat" @click="closeAll">Boat Detailing</router-link></li>
            <li><router-link to="/services/motorcycle" @click="closeAll">Motorcycle Detailing</router-link></li>
          </ul>
        </li>

        <!-- Business Programs dropdown -->
        <li class="dropdown">
          <p class="dropdown-btn" @click="toggleDropdown('business')">Business Programs &#x2BC6;</p>
          <ul class="dropdown-menu" :class="{ 'open': activeDropdown === 'business' }">
            <li><router-link to="/business/fleet-management" @click="closeAll">Fleet Management</router-link></li>
            <li><router-link to="/business/car-dealerships" @click="closeAll">Car Dealerships</router-link></li>
            <li><router-link to="/business/rideshare" @click="closeAll">Uber / Rideshare Drivers</router-link></li>
            <li><router-link to="/business/turo-hosts" @click="closeAll">Turo Hosts</router-link></li>
            <li><router-link to="/business/hotels-hospitality" @click="closeAll">Hotels &amp; Hospitality</router-link></li>
            <li><router-link to="/business/restaurants-cafes" @click="closeAll">Restaurants &amp; Cafes</router-link></li>
            <li><router-link to="/business/barbershops-salons" @click="closeAll">Barbershops &amp; Salons</router-link></li>
          </ul>
        </li>

        <li><router-link to="/membership">Membership</router-link></li>

        <li><router-link to="/gift-cards">Gift Cards</router-link></li>
        <li><router-link to="/FAQs">FAQ</router-link></li>

      </ul>
    </nav>
    <div class="auth-buttons">
      <template v-if="!user">
        <router-link to="/login" class="btn btn-ghost">Login</router-link>
        <router-link to="/register" class="btn btn-primary">Get Started</router-link>
      </template>

      <template v-else>
        <router-link to="/my-referral" class="btn-referral-cta">
          🎁 Refer &amp; Earn
        </router-link>

        <div class="user-menu" @click.stop="toggleUserMenu" ref="userMenuRef">
          <div class="user-avatar">{{ userInitial }}</div>
          <span class="user-email">{{ userShortEmail }}</span>
          <span class="chevron" :class="{ 'chevron-up': userMenuOpen }">&#x2BC6;</span>

          <div class="user-dropdown" v-show="userMenuOpen" @click.stop>
            <div class="dropdown-header">
              <div class="dropdown-avatar">{{ userInitial }}</div>
              <span>{{ user.email }}</span>
            </div>
            <div class="dropdown-divider"></div>
            <router-link to="/account" class="dropdown-item" @click="closeUserMenu">
              <span class="item-icon">👤</span> My Account
            </router-link>
            <router-link to="/my-bookings" class="dropdown-item" @click="closeUserMenu">
              <span class="item-icon">📋</span> My Bookings
            </router-link>
            <router-link v-if="user.role === 'ADMIN'" to="/admin" class="dropdown-item admin-item" @click="closeUserMenu">
              <span class="item-icon">⚙️</span> Admin Panel
            </router-link>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout-item" @click="logout">
              <span class="item-icon">🚪</span> Log Out
            </button>
          </div>
        </div>
      </template>
    </div>
    <button class="hamburger" @click="toggleMenu" :class="{ 'open': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth.ts';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const user = computed(() => auth.user);

const isMenuOpen = ref(false);
const activeDropdown = ref(null);
const userMenuOpen = ref(false);
const userMenuRef = ref(null);

const userInitial = computed(() => user.value?.email?.[0]?.toUpperCase() ?? '?');
const userShortEmail = computed(() => {
  const email = user.value?.email ?? '';
  return email.length > 18 ? email.slice(0, 16) + '…' : email;
});

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; };
const toggleDropdown = (name) => { activeDropdown.value = activeDropdown.value === name ? null : name; };
const closeAll = () => { activeDropdown.value = null; isMenuOpen.value = false; };
const toggleUserMenu = () => { userMenuOpen.value = !userMenuOpen.value; };
const closeUserMenu = () => { userMenuOpen.value = false; closeAll(); };

const handleOutsideClick = (e) => {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target)) {
    userMenuOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleOutsideClick));
onUnmounted(() => document.removeEventListener('click', handleOutsideClick));

const router = useRouter();

const logout = () => {
  closeUserMenu();
  auth.logout();
  router.push('/');
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  width: 100%;
  box-sizing: border-box;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #007BFF;
}

nav ul {
  list-style: none;
  display: flex;
  gap: 20px;
  position: relative;
}

nav a, p {
  text-decoration: none;
  color: #333;
  font-weight: bold;
}

.dropdown {
  position: relative;
}

.dropdown-btn {
  cursor: pointer;
  user-select: none;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  padding: 6px 0;
  margin: 0;
  z-index: 1001;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
}

.dropdown-menu li {
  display: block;
}

.dropdown-menu li a {
  display: block;
  padding: 10px 16px;
  color: #333;
  text-decoration: none;
  font-weight: normal;
  white-space: nowrap;
}

.dropdown-menu li a:hover {
  background-color: #f0f6ff;
  color: #007BFF;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

/* Hamburger menu */
.hamburger {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: #333;
  margin: 3px 0;
  transition: 0.3s;
}

.hamburger.open span:nth-child(1) {
  transform: rotate(-45deg) translate(-5px, 6px);
}

.hamburger.open span:nth-child(2) {
  opacity: 0;
}

.hamburger.open span:nth-child(3) {
  transform: rotate(45deg) translate(-5px, -6px);
}

/* Mobile styles */
@media (max-width: 768px) {
  .header {
    padding: 15px 20px;
  }

  nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: white;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }

  nav.nav-open {
    display: block;
  }

  nav ul {
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  nav li {
    width: 100%;
    text-align: left;
  }

  nav a, nav p {
    display: block;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
  }

  .dropdown-menu {
    position: static;
    display: none;
    box-shadow: none;
    border: none;
    border-radius: 0;
    padding: 0;
  }

  .dropdown-menu li a {
    padding: 12px 20px 12px 36px;
    font-weight: normal;
    border-bottom: 1px solid #f0f0f0;
  }

  .dropdown:hover .dropdown-menu {
    display: none;
  }

  .dropdown-menu.open {
    display: block;
  }

  .hamburger {
    display: flex;
  }
}

/* Auth buttons */
.auth-buttons {
  display: flex;
  gap: 10px;
  align-items: center;
}

.btn-ghost {
  padding: 8px 16px;
  background: transparent;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s;
}

.btn-ghost:hover {
  background: #f3f4f6;
}

.btn-primary {
  padding: 8px 18px;
  background: #2563eb;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s;
}

.btn-primary:hover {
  background: #1d4ed8;
}

/* Referral CTA button */
.btn-referral-cta {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.88rem;
  white-space: nowrap;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.35);
  transition: transform 0.15s, box-shadow 0.15s;
}

.btn-referral-cta:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(22, 163, 74, 0.45);
}

/* User menu trigger */
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  background: white;
  transition: box-shadow 0.15s, border-color 0.15s;
  user-select: none;
}

.user-menu:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-email {
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chevron {
  font-size: 0.65rem;
  color: #9ca3af;
  transition: transform 0.2s;
  display: inline-block;
}

.chevron-up {
  transform: rotate(180deg);
}

/* Dropdown */
.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 220px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 1001;
  overflow: hidden;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: #f9fafb;
}

.dropdown-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dropdown-header span {
  font-size: 0.82rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: #f3f4f6;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  font-size: 0.9rem;
  color: #374151;
  text-decoration: none;
  font-weight: 500;
  background: white;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.item-icon {
  font-size: 1rem;
  width: 20px;
  text-align: center;
}

.admin-item {
  color: #6d28d9;
}

.admin-item:hover {
  background: #f5f3ff;
}

.logout-item {
  color: #dc2626;
}

.logout-item:hover {
  background: #fef2f2;
}

/* Hide email on smaller screens */
@media (max-width: 900px) {
  .user-email {
    display: none;
  }
}
</style>
