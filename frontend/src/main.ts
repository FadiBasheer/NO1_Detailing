import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)

app.use(createPinia())

// Initialize auth BEFORE installing the router so the beforeEach guard
// sees the restored session when it runs on the initial navigation.
const auth = useAuthStore();
auth.initializeAuth();

app.use(router)
app.mount('#app')
