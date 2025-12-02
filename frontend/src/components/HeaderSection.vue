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

      <div v-else class="user-menu" @click.stop="toggleUserMenu" ref="userMenuRef">
        <div class="user-avatar">{{ userInitial }}</div>
        <span class="user-email">{{ userShortEmail }}</span>
        <span class="chevron" :class="{ 'chevron-up': userMenuOpen }">&#x2BC6;</span>

        <div class="user-dropdown" v-show="userMenuOpen" @click.stop>
          <div class="dropdown-header">
            <div class="dropdown-avatar">{{ userInitial }}</div>
            <span>{{ user.email }}</span>
          </div>
          <div class="dropdown-divider"></div>
          <router-link to="/my-bookings" class="dropdown-item" @click="closeUserMenu">
            <span class="item-icon">📋</span> My Bookings
          </router-link>
          <router-link to="/my-referral" class="dropdown-item" @click="closeUserMenu">
            <span class="item-icon">🎁</span> Referral Program
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

.auth-buttons .btn {
  padding: 8px 16px;
  background-color: #007BFF;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.auth-buttons .btn:hover {
  background-color: #0056b3;
}

.auth-buttons button {
  border: none;
  cursor: pointer;
}

.auth-buttons .btn-my-bookings {
  background-color: #6c63ff;
}

.auth-buttons .btn-my-bookings:hover {
  background-color: #574fd6;
}

.auth-buttons .btn-referral {
  background-color: #28a745;
}

.auth-buttons .btn-referral:hover {
  background-color: #1e7e34;
}

.auth-buttons .btn-admin {
  background-color: #1a1a2e;
}

.auth-buttons .btn-admin:hover {
  background-color: #2d2d4e;
}
</style>
