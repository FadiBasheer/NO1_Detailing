<template>
  <div class="membership">
    <section class="hero">
      <h1>Membership Plans</h1>
      <p class="subtitle">Save more with a recurring detail plan — no hassle, always clean.</p>
    </section>

    <section class="plans" id="plans">
      <div class="plan-grid">
        <div class="plan-card" id="monthly">
          <h2>Monthly</h2>
          <div class="price">$79<span>/mo</span></div>
          <ul>
            <li>1 exterior detail per month</li>
            <li>Priority booking</li>
            <li>10% off add-ons</li>
            <li>Cancel anytime</li>
          </ul>
          <button class="btn-plan">Get Started</button>
        </div>

        <div class="plan-card featured" id="annual">
          <div class="badge">Best Value</div>
          <h2>Annual</h2>
          <div class="price">$59<span>/mo</span></div>
          <p class="billed">Billed $708/year — save 25%</p>
          <ul>
            <li>1 full detail per month</li>
            <li>Priority booking</li>
            <li>20% off add-ons</li>
            <li>1 free interior detail/year</li>
          </ul>
          <button class="btn-plan">Get Started</button>
        </div>
      </div>
    </section>

    <section class="benefits" id="benefits">
      <h2>Why Become a Member?</h2>
      <div class="benefits-grid">
        <div class="benefit">
          <h3>Save Every Month</h3>
          <p>Members pay less per detail compared to one-time bookings.</p>
        </div>
        <div class="benefit">
          <h3>Priority Scheduling</h3>
          <p>Skip the waitlist — members get first access to available slots.</p>
        </div>
        <div class="benefit">
          <h3>We Come to You</h3>
          <p>Home, office, or anywhere — we bring water and electricity.</p>
        </div>
        <div class="benefit">
          <h3>Flexible Cancellation</h3>
          <p>Monthly plan members can cancel at any time, no questions asked.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.membership {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px 40px;
}

.hero h1 {
  font-size: 2.5rem;
  color: #007BFF;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
}

.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
  margin-bottom: 60px;
}

.plan-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 36px 28px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.plan-card.featured {
  border-color: #007BFF;
  box-shadow: 0 4px 20px rgba(0, 123, 255, 0.2);
}

.badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background: #007BFF;
  color: white;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
}

.plan-card h2 {
  font-size: 1.5rem;
  margin-bottom: 12px;
}

.price {
  font-size: 2.8rem;
  font-weight: bold;
  color: #007BFF;
  margin-bottom: 4px;
}

.price span {
  font-size: 1rem;
  color: #888;
}

.billed {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 20px;
}

.plan-card ul {
  list-style: none;
  padding: 0;
  margin: 20px 0;
  text-align: left;
}

.plan-card ul li {
  padding: 6px 0;
  color: #444;
  font-size: 0.95rem;
}

.plan-card ul li::before {
  content: '✓ ';
  color: #007BFF;
  font-weight: bold;
}

.btn-plan {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 12px 28px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-top: 8px;
}

.btn-plan:hover {
  background-color: #0056b3;
}

h2 {
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 28px;
  color: #222;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.benefit {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 24px;
}

.benefit h3 {
  font-size: 1rem;
  margin-bottom: 8px;
  color: #007BFF;
}

.benefit p {
  color: #666;
  font-size: 0.9rem;
}
</style>
