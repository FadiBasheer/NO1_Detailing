<template>
  <div class="referral-page">

    <section class="hero">
      <div class="hero-badge">Friend Referral</div>
      <h1>Your Friend Hooked You Up.</h1>
      <p class="hero-sub">
        You've been invited to NO1 Detailing. Sign up and get
        <strong>10% off your first booking</strong> — applied automatically at checkout.
      </p>
      <button @click="claimOffer" class="btn-claim">Claim My 10% Discount</button>
      <p class="fine-print">New customers only · One-time offer · No credit card to sign up</p>
    </section>

    <section class="what-you-get">
      <h2>Why NO1 Detailing?</h2>
      <div class="included-grid">
        <div class="included-card">
          <span class="inc-icon">🚗</span>
          <h3>Mobile Detailing</h3>
          <p>We come to your home, office, or wherever your car is parked. No shop visit needed.</p>
        </div>
        <div class="included-card">
          <span class="inc-icon">✨</span>
          <h3>Professional Results</h3>
          <p>Trained technicians using premium products for a showroom finish every time.</p>
        </div>
        <div class="included-card">
          <span class="inc-icon">📅</span>
          <h3>Easy Booking</h3>
          <p>Pick your vehicle, date, and time in minutes. Your 10% discount applies automatically.</p>
        </div>
        <div class="included-card">
          <span class="inc-icon">💸</span>
          <h3>10% Off Your First Booking</h3>
          <p>Your friend's referral gives you an instant discount on your very first service.</p>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-number">1</div>
          <h3>Create Your Account</h3>
          <p>Click the button above and register — takes less than a minute.</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">2</div>
          <h3>Book Your Detail</h3>
          <p>Pick your vehicle, date, and time. Your 10% discount is applied automatically.</p>
        </div>
        <div class="step-arrow">→</div>
        <div class="step">
          <div class="step-number">3</div>
          <h3>We Come to You</h3>
          <p>A trained technician arrives at your location and gets to work.</p>
        </div>
      </div>
    </section>

    <section class="cta-bottom">
      <h2>Ready for a spotless car?</h2>
      <p>Claim your 10% discount and book your first detail today.</p>
      <button @click="claimOffer" class="btn-claim">Get 10% Off My First Booking</button>
    </section>

  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const claimOffer = () => {
  const code = route.params.code || '';
  if (code) {
    sessionStorage.setItem('referralCode', code.toString().toUpperCase());
  }
  router.push('/register');
};
</script>

<style scoped>
.referral-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px 60px;
}

.hero {
  text-align: center;
  padding: 70px 20px 60px;
  background: linear-gradient(135deg, #065f46, #10b981);
  border-radius: 20px;
  color: white;
  margin-bottom: 70px;
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 999px;
  padding: 6px 18px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 24px;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 900;
  line-height: 1.15;
  margin-bottom: 20px;
  color: white;
}

.hero-sub {
  font-size: 1.15rem;
  max-width: 480px;
  margin: 0 auto 32px;
  opacity: 0.9;
  line-height: 1.6;
}

.hero-sub strong {
  color: #a7f3d0;
}

.btn-claim {
  background: white;
  color: #065f46;
  border: none;
  padding: 16px 40px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  display: inline-block;
  margin-bottom: 16px;
}

.btn-claim:hover {
  background: #d1fae5;
  transform: translateY(-2px);
}

.fine-print {
  font-size: 0.8rem;
  opacity: 0.65;
  margin: 0;
}

.what-you-get {
  margin-bottom: 70px;
}

.what-you-get h2,
.how-it-works h2,
.cta-bottom h2 {
  font-size: 1.8rem;
  color: #111827;
  text-align: center;
  margin-bottom: 36px;
  font-weight: 800;
}

.included-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 20px;
}

.included-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 28px 22px;
  text-align: center;
}

.inc-icon {
  font-size: 2.2rem;
  display: block;
  margin-bottom: 12px;
}

.included-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.included-card p {
  font-size: 0.88rem;
  color: #555;
  line-height: 1.6;
  margin: 0;
}

.how-it-works {
  margin-bottom: 70px;
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.step {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 28px 24px;
  text-align: center;
  max-width: 220px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.step-number {
  width: 42px;
  height: 42px;
  background: #065f46;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  margin: 0 auto 14px;
}

.step h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.step p {
  font-size: 0.87rem;
  color: #555;
  line-height: 1.55;
  margin: 0;
}

.step-arrow {
  font-size: 1.8rem;
  color: #d1d5db;
  font-weight: 300;
}

.cta-bottom {
  background: #f0fdf4;
  border: 1px solid #a7f3d0;
  border-radius: 16px;
  padding: 56px 30px;
  text-align: center;
}

.cta-bottom p {
  font-size: 1.05rem;
  color: #4b5563;
  margin-bottom: 28px;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.1rem;
  }

  .steps {
    flex-direction: column;
    align-items: stretch;
  }

  .step {
    max-width: 100%;
  }

  .step-arrow {
    transform: rotate(90deg);
    align-self: center;
  }

  .included-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .included-grid {
    grid-template-columns: 1fr;
  }
}
</style>
