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
            <li><a href="#">Fleet Management</a></li>
            <li><a href="#">Car Dealerships</a></li>
            <li><a href="#">Uber / Rideshare Drivers</a></li>
            <li><a href="#">Turo Hosts</a></li>
            <li><a href="#">Hotels &amp; Hospitality</a></li>
            <li><a href="#">Restaurants &amp; Cafes</a></li>
            <li><a href="#">Barbershops &amp; Salons</a></li>
          </ul>
        </li>

        <!-- Membership dropdown -->
        <li class="dropdown">
          <p class="dropdown-btn" @click="toggleDropdown('membership')">Membership &#x2BC6;</p>
          <ul class="dropdown-menu" :class="{ 'open': activeDropdown === 'membership' }">
            <li><router-link to="/membership#monthly" @click="closeAll">Monthly Plan</router-link></li>
            <li><router-link to="/membership#annual" @click="closeAll">Annual Plan</router-link></li>
            <li><router-link to="/membership#benefits" @click="closeAll">Compare Benefits</router-link></li>
          </ul>
        </li>

        <li><router-link to="/gift-cards">Gift Cards</router-link></li>
        <li><router-link to="/FAQs">FAQ</router-link></li>

      </ul>
    </nav>
    <div class="auth-buttons">
      <router-link v-if="!user" to="/login" class="btn">Login</router-link>
      <router-link v-if="!user" to="/register" class="btn">Register</router-link>
      <router-link v-if="user" to="/my-bookings" class="btn btn-my-bookings">My Bookings</router-link>
      <router-link v-if="user?.role === 'ADMIN'" to="/admin" class="btn btn-admin">Admin</router-link>
      <button v-if="user" @click="logout" class="btn">Logout</button>
    </div>
    <button class="hamburger" @click="toggleMenu" :class="{ 'open': isMenuOpen }">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth.ts';
import { useRouter } from 'vue-router';

const auth = useAuthStore();
const user = computed(() => auth.user);

const isMenuOpen = ref(false);
const activeDropdown = ref(null); // 'services' | 'business' | 'membership' | null

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleDropdown = (name) => {
  activeDropdown.value = activeDropdown.value === name ? null : name;
};

const closeAll = () => {
  activeDropdown.value = null;
  isMenuOpen.value = false;
};

const router = useRouter();

const logout = () => {
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

.auth-buttons .btn-admin {
  background-color: #1a1a2e;
}

.auth-buttons .btn-admin:hover {
  background-color: #2d2d4e;
}
</style>
