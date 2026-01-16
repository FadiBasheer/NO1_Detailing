<template>
  <div class="account-page">
    <div class="account-card">
      <div class="account-header">
        <div class="avatar">{{ userInitial }}</div>
        <div>
          <h1>My Account</h1>
          <p class="email">{{ auth.user?.email }}</p>
        </div>
      </div>

      <form @submit.prevent="saveProfile" class="profile-form">
        <div class="section-title">Personal Information</div>

        <div class="form-group">
          <label for="name">Full Name</label>
          <input
            id="name"
            type="text"
            v-model="form.name"
            placeholder="e.g. John Smith"
          />
        </div>

        <div class="form-group">
          <label for="phone">Phone Number</label>
          <input
            id="phone"
            type="tel"
            v-model="form.phone"
            placeholder="e.g. (403) 555-0123"
          />
        </div>

        <div class="section-title" style="margin-top: 28px;">Default Service Address</div>
        <p class="section-hint">This will be pre-filled every time you book. We service the Lower Mainland, BC.</p>

        <div class="form-group">
          <label for="address-input">Address</label>
          <input
            id="address-input"
            type="text"
            ref="autocompleteInput"
            v-model="form.defaultAddress"
            placeholder="Start typing your address…"
            autocomplete="off"
          />
        </div>

        <div v-if="message" :class="['save-message', messageType]">{{ message }}</div>

        <button type="submit" class="save-btn" :disabled="saving">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth.ts';
import axios from '@/axios.ts';

export default {
  name: 'AccountView',
  data() {
    return {
      form: {
        name: '',
        phone: '',
        defaultAddress: '',
      },
      saving: false,
      message: '',
      messageType: 'success',
      autocomplete: null,
    };
  },
  computed: {
    auth() {
      return useAuthStore();
    },
    userInitial() {
      return this.auth.user?.email?.[0]?.toUpperCase() ?? '?';
    },
  },
  async mounted() {
    // Load latest profile from server
    try {
      const res = await axios.get('/api/profile');
      this.form.name = res.data.name || '';
      this.form.phone = res.data.phone || '';
      this.form.defaultAddress = res.data.defaultAddress || '';
    } catch {
      // Fall back to store data if request fails
      this.form.name = this.auth.user?.name || '';
      this.form.phone = this.auth.user?.phone || '';
      this.form.defaultAddress = this.auth.user?.defaultAddress || '';
    }

    // Set up Google Maps autocomplete on the address field
    const interval = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(interval);
        this.autocomplete = new google.maps.places.Autocomplete(
          this.$refs.autocompleteInput,
          { componentRestrictions: { country: 'ca' }, fields: ['formatted_address'] }
        );
        this.autocomplete.addListener('place_changed', () => {
          const place = this.autocomplete.getPlace();
          if (place?.formatted_address) {
            this.form.defaultAddress = place.formatted_address;
          }
        });
      }
    }, 100);
  },
  methods: {
    async saveProfile() {
      this.saving = true;
      this.message = '';
      try {
        const res = await axios.patch('/api/profile', {
          name: this.form.name,
          phone: this.form.phone,
          defaultAddress: this.form.defaultAddress,
        });
        this.auth.updateUser(res.data.user);
        this.message = 'Profile saved successfully.';
        this.messageType = 'success';
      } catch {
        this.message = 'Failed to save. Please try again.';
        this.messageType = 'error';
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.account-page {
  min-height: 100vh;
  background: #f9fafb;
  display: flex;
  justify-content: center;
  padding: 50px 20px 80px;
}

.account-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.07);
  padding: 36px 40px;
  width: 100%;
  max-width: 520px;
  height: fit-content;
}

.account-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  font-size: 1.3rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.account-header h1 {
  font-size: 1.3rem;
  font-weight: 800;
  color: #0a0a0a;
  margin: 0 0 2px;
}

.email {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
}

.section-title {
  font-size: 0.78rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}

.section-hint {
  font-size: 0.83rem;
  color: #9ca3af;
  margin: -10px 0 16px;
}

.profile-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 18px;
}

.form-group label {
  display: block;
  font-weight: 600;
  font-size: 0.88rem;
  color: #374151;
  margin-bottom: 6px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #f9fafb;
  box-sizing: border-box;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #2563eb;
  background: white;
}

.save-message {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 16px;
}

.save-message.success {
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #86efac;
}

.save-message.error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.save-btn {
  background: #1e40af;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
  margin-top: 8px;
}

.save-btn:hover:not(:disabled) {
  background: #1e3a8a;
}

.save-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .account-card {
    padding: 24px 20px;
  }
}
</style>
