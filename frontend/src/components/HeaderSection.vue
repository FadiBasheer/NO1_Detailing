<template>
  <header class="header">
    <router-link to="/" class="logo">Yumeeco</router-link>
    <nav>
      <ul>
        <li class="dropdown" style="position: relative">
          <p class="dropdown-btn">Business Programs &#x2BC6;</p>
          <ul class="dropdown-menu">
            <li><a href="#">An item</a></li>
            <li><a href="#">Another item</a></li>
            <li><a href="#">Another item</a></li>
            <li><a href="#">Another item</a></li>
          </ul>
        </li>

        <li><a href="#">Car Services</a></li>
        <li><a href="#">RV services</a></li>
        <li><a href="#">Boats Services</a></li>

        <li><a href="#">Gift Cards</a></li>
        <li><a href="#">Membership</a></li>

        <li><router-link to="/FAQs">FAQs</router-link></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>
</template>


<style>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
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

</style>
