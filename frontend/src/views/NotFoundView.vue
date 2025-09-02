<template>
  <div class="not-found">
    <div class="content">
      <h1>404</h1>
      <p>Page not found.</p>
      <router-link to="/" class="btn-home">Go Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  font-family: system-ui, sans-serif;
  text-align: center;
  color: #1a1a2e;
}

.content h1 {
  font-size: 6rem;
  font-weight: 700;
  margin: 0;
  color: #6c63ff;
  line-height: 1;
}

.content p {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0.75rem 0 1.75rem;
}

.btn-home {
  display: inline-block;
  background: #6c63ff;
  color: #fff;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-home:hover { opacity: 0.88; }
</style>
