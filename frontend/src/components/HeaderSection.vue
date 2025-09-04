<template>
  <header class="header">
    <router-link to="/" class="logo">Yumeeco</router-link>
    <nav :class="{ 'nav-open': isMenuOpen }">
      <ul>

        <li><a href="#">Membership</a></li>
        <li class="dropdown" style="position: relative">
          <p class="dropdown-btn" @click="toggleDropdown">Business Programs &#x2BC6;</p>
          <ul class="dropdown-menu" :class="{ 'open': isDropdownOpen }">
            <li><a href="#">Fleet Services</a></li>
            <li><a href="#">Dealerships</a></li>
            <li><a href="#">Another item</a></li> <!-- Uber Drives -->
            <li><a href="#">Another item</a></li> <!-- Turo -->
            <li><a href="#">Another item</a></li>  <!-- Hotels -->
            <li><a href="#">Another item</a></li>  <!-- Resturants -->
            <li><a href="#">Another item</a></li>  <!-- Barbershops -->
          </ul>
        </li>

        <li><a href="#">Car Services</a></li>
        <li><a href="#">RV services</a></li>
        <li><a href="#">Boats Services</a></li>

        <li><a href="#">Gift Cards</a></li>
        

        <li><router-link to="/FAQs">FAQs</router-link></li>
        <li><a href="#">Contact</a></li>
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
const isDropdownOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
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

  width: 100%;       /* 🔑 Make header full width */
  box-sizing: border-box; /* Prevent padding from pushing it wider */
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

.pricing-btn {
  background-color: #007BFF;
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 5px;
}

.dropdown {
  position: relative; /* 🔑 Needed so the submenu positions correctly */
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 160px;
  background: white;
  border: 1px solid #ccc;
  list-style: none;
  padding: 0;
  margin: 0;
  z-index: 1001;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  flex-direction: column; /* ✅ Optional if needed for layout fix */
}

/* ✅ This ensures vertical list display inside dropdown */
.dropdown-menu li {
  display: block;
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
  }

  .dropdown:hover .dropdown-menu,
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
