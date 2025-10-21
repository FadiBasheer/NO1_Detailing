<template>
  <div class="business-contact">

    <!-- Hero -->
    <section class="hero">
      <h1>Business Programs</h1>
      <p class="subtitle">
        Fleet management, dealerships, rideshare drivers, and more — we offer custom detailing
        solutions built around your operation. Get in touch and we'll build a plan for you.
      </p>
    </section>

    <!-- Program cards -->
    <section class="programs">
      <div class="program-grid">
        <div class="program-card" v-for="p in programs" :key="p.title">
          <div class="program-icon">{{ p.icon }}</div>
          <h3>{{ p.title }}</h3>
          <p>{{ p.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Contact form -->
    <section class="form-section">
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
              <option v-for="p in programs" :key="p.title" :value="p.title">{{ p.title }}</option>
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
    </section>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const programs = [
  { icon: '🚗', title: 'Fleet Management',       desc: 'Keep your entire fleet spotless with scheduled mobile detailing at your lot.' },
  { icon: '🏢', title: 'Car Dealerships',         desc: 'Showroom-ready vehicles on demand — new arrivals, trade-ins, and display cars.' },
  { icon: '🚕', title: 'Uber / Rideshare Drivers', desc: 'Maintain a 5-star interior between shifts with flexible booking that fits your schedule.' },
  { icon: '🔑', title: 'Turo Hosts',              desc: 'Maximize your ratings with reliable turnaround details between guest rentals.' },
  { icon: '🏨', title: 'Hotels & Hospitality',    desc: 'Offer guests premium vehicle care as a value-added amenity or concierge service.' },
  { icon: '🍽️', title: 'Restaurants & Cafes',    desc: 'Keep delivery vehicles and staff cars clean and presentable on a regular schedule.' },
  { icon: '✂️', title: 'Barbershops & Salons',   desc: 'Offer clients a car detail while they wait — a unique loyalty perk that sets you apart.' },
];

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
    // Compose a mailto link as a fallback since there's no dedicated backend endpoint yet
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
  font-family: inherit;
}

/* Hero */
.hero {
  background: #111827;
  color: white;
  text-align: center;
  padding: 72px 24px 56px;
}

.hero h1 {
  font-size: 2.6rem;
  font-weight: 900;
  margin-bottom: 16px;
}

.subtitle {
  font-size: 1.1rem;
  color: #9ca3af;
  max-width: 640px;
  margin: 0 auto;
  line-height: 1.7;
}

/* Programs */
.programs {
  background: #f9fafb;
  padding: 56px 24px;
}

.program-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  max-width: 1100px;
  margin: 0 auto;
}

.program-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 28px 20px;
  text-align: center;
}

.program-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}

.program-card h3 {
  font-size: 1rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
}

.program-card p {
  font-size: 0.88rem;
  color: #6b7280;
  line-height: 1.6;
}

/* Form section */
.form-section {
  padding: 56px 24px 80px;
  background: white;
}

.form-card {
  max-width: 720px;
  margin: 0 auto;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  padding: 48px 40px;
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
  background: white;
  outline: none;
  transition: border-color 0.2s;
  font-family: inherit;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: #007BFF;
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

  .hero h1 {
    font-size: 2rem;
  }
}
</style>
