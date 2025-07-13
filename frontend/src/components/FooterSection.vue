<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Left side: Logo / About -->
      <div class="footer-about">
        <h2 class="logo">Yumeeco</h2>
        <p>Mobile detailing for cars, RVs, boats, and more. We bring the shine to you!</p>
      </div>

      <!-- Middle: Quick links -->
      <div class="footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><a href="#">Car Services</a></li>
          <li><a href="#">RV Services</a></li>
          <li><a href="#">Boat Services</a></li>
          <li><router-link to="/FAQs">FAQs</router-link></li>
          <li><a href="#">Contact</a></li>
        </ul>
      </div>

      <!-- Right side: Contact -->
      <div class="footer-contact">
        <h3>Contact Us</h3>
        <p>Email: support@yumeeco.com</p>
        <p>Phone: (123) 456-7890</p>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="footer-bottom">
      <p>© 2025 Yumeeco. All rights reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #222;
  color: white;
  padding: 40px 20px 20px;
  margin-top: 50px;
}

.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  gap: 30px;
}

.footer-about,
.footer-links,
.footer-contact {
  flex: 1;
  min-width: 250px;
}

.footer .logo {
  color: #007BFF;
  font-size: 22px;
  margin-bottom: 10px;
}

.footer-links h3,
.footer-contact h3 {
  margin-bottom: 10px;
  font-size: 18px;
  color: #007BFF;
}

.footer-links ul {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin: 8px 0;
}

.footer-links a,
.footer-contact p {
  color: #ccc;
  text-decoration: none;
  font-size: 14px;
}

.footer-links a:hover {
  color: white;
}

.footer-bottom {
  border-top: 1px solid #444;
  margin-top: 20px;
  padding-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #aaa;
}
</style>
