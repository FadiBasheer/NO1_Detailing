<template>
  <div class="business-contact">
    <div class="form-card">
      <h2>Get a Custom Quote</h2>
      <p class="form-sub">Fill out the form below and we'll get back to you within 1 business day.</p>

      <form @submit.prevent="submitForm">
        <div class="field-row">
          <div class="field">
            <label>Full Name *</label>
            <input v-model="form.name" type="text" placeholder="Jane Smith" required />
          </div>
          <div class="field">
            <label>Business Name *</label>
            <input v-model="form.business" type="text" placeholder="Acme Corp" required />
          </div>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Email *</label>
            <input v-model="form.email" type="email" placeholder="jane@acme.com" required />
          </div>
          <div class="field">
            <label>Phone</label>
            <input v-model="form.phone" type="tel" placeholder="+1 (613) 555-0100" />
          </div>
        </div>

        <div class="field">
          <label>Business Type *</label>
          <select v-model="form.type" required>
            <option value="" disabled>Select your business type</option>
            <option value="Fleet Management">Fleet Management</option>
            <option value="Car Dealerships">Car Dealerships</option>
            <option value="Uber / Rideshare Drivers">Uber / Rideshare Drivers</option>
            <option value="Turo Hosts">Turo Hosts</option>
            <option value="Hotels & Hospitality">Hotels &amp; Hospitality</option>
            <option value="Restaurants & Cafes">Restaurants &amp; Cafes</option>
            <option value="Barbershops & Salons">Barbershops &amp; Salons</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div class="field-row">
          <div class="field">
            <label>Number of Vehicles</label>
            <input v-model="form.vehicles" type="number" min="1" placeholder="e.g. 10" />
          </div>
          <div class="field">
            <label>Preferred Frequency</label>
            <select v-model="form.frequency">
              <option value="">Not sure yet</option>
              <option value="Weekly">Weekly</option>
              <option value="Bi-weekly">Bi-weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="One-time">One-time</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label>Message</label>
          <textarea v-model="form.message" rows="4" placeholder="Tell us about your needs, location, or any questions..."></textarea>
        </div>

        <p v-if="errorMsg" class="error-msg">{{ errorMsg }}</p>
        <p v-if="successMsg" class="success-msg">{{ successMsg }}</p>

        <button type="submit" class="btn-submit" :disabled="submitting">
          {{ submitting ? 'Sending…' : 'Send Inquiry' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const form = ref({
  name: '', business: '', email: '', phone: '',
  type: '', vehicles: '', frequency: '', message: ''
});

onMounted(() => {
  if (route.query.type) {
    form.value.type = decodeURIComponent(route.query.type);
  }
});

const submitting = ref(false);
const successMsg = ref('');
const errorMsg = ref('');

const submitForm = async () => {
  submitting.value = true;
  errorMsg.value = '';
  successMsg.value = '';
  try {
    const subject = encodeURIComponent(`Business Inquiry – ${form.value.type || 'General'}`);
    const body = encodeURIComponent(
      `Name: ${form.value.name}\n` +
      `Business: ${form.value.business}\n` +
      `Email: ${form.value.email}\n` +
      `Phone: ${form.value.phone}\n` +
      `Type: ${form.value.type}\n` +
      `Vehicles: ${form.value.vehicles}\n` +
      `Frequency: ${form.value.frequency}\n\n` +
      `Message:\n${form.value.message}`
    );
    window.location.href = `mailto:info@yumeeco.ca?subject=${subject}&body=${body}`;
    successMsg.value = 'Your email client has been opened. We look forward to hearing from you!';
    form.value = { name: '', business: '', email: '', phone: '', type: '', vehicles: '', frequency: '', message: '' };
  } catch {
    errorMsg.value = 'Something went wrong. Please email us directly at info@yumeeco.ca';
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.business-contact {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  background: #f3f4f6;
}

.form-card {
  width: 100%;
  max-width: 720px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
}

.form-card h2 {
  font-size: 1.8rem;
  font-weight: 900;
  color: #111827;
  margin-bottom: 8px;
}

.form-sub {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 32px;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.field label {
  font-size: 0.88rem;
  font-weight: 700;
  color: #374151;
  margin-bottom: 6px;
}

.field input,
.field select,
.field textarea {
  padding: 11px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #111827;
  background: #f9fafb;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #007BFF;
  background: white;
}

.field textarea {
  resize: vertical;
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 8px;
}

.btn-submit:hover:not(:disabled) {
  background: #374151;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #dc2626;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.success-msg {
  color: #065f46;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

@media (max-width: 600px) {
  .field-row {
    grid-template-columns: 1fr;
  }

  .form-card {
    padding: 32px 20px;
  }
}
</style>
