<template>
  <div class="membership">

    <!-- Hero -->
    <section class="hero">
      <h1>Membership Plans</h1>
      <p class="subtitle">
        Always clean, always priority. Save money and skip the hassle with a
        recurring detail plan tailored to how often you drive.
      </p>
    </section>

    <!-- Plans -->
    <section class="plans">
      <div class="plan-grid">

        <!-- Basic -->
        <div class="plan-card">
          <div class="plan-header basic-header">
            <span class="plan-icon">🚗</span>
            <h2>Basic</h2>
            <p class="plan-tagline">Perfect for the occasional clean</p>
          </div>
          <div class="plan-body">
            <div class="price">$79<span>/mo</span></div>
            <p class="billed">Billed monthly — cancel anytime</p>
            <ul>
              <li>1 exterior detail per month</li>
              <li>Priority booking access</li>
              <li>10% off all add-on services</li>
              <li>Mobile service — we come to you</li>
              <li>Cancel anytime, no questions</li>
            </ul>
            <button class="btn-plan">Get Started</button>
          </div>
        </div>

        <!-- Pro (featured) -->
        <div class="plan-card featured">
          <div class="badge">Most Popular</div>
          <div class="plan-header pro-header">
            <span class="plan-icon">⭐</span>
            <h2>Pro</h2>
            <p class="plan-tagline">Best value for regular drivers</p>
          </div>
          <div class="plan-body">
            <div class="price">$59<span>/mo</span></div>
            <p class="billed">Billed $708/year — save 25%</p>
            <ul>
              <li>1 full interior + exterior detail/mo</li>
              <li>Priority booking access</li>
              <li>20% off all add-on services</li>
              <li>1 free interior deep clean/year</li>
              <li>Mobile service — we come to you</li>
              <li>Dedicated account support</li>
            </ul>
            <button class="btn-plan featured-btn">Get Started</button>
          </div>
        </div>

        <!-- Elite -->
        <div class="plan-card">
          <div class="plan-header elite-header">
            <span class="plan-icon">💎</span>
            <h2>Elite</h2>
            <p class="plan-tagline">For the car enthusiast</p>
          </div>
          <div class="plan-body">
            <div class="price">$99<span>/mo</span></div>
            <p class="billed">Billed $1,188/year</p>
            <ul>
              <li>2 full details per month</li>
              <li>First-priority booking — skip all queues</li>
              <li>30% off all add-on services</li>
              <li>Quarterly paint correction included</li>
              <li>Free engine bay cleaning/year</li>
              <li>Dedicated account manager</li>
              <li>Exclusive member-only promotions</li>
            </ul>
            <button class="btn-plan">Get Started</button>
          </div>
        </div>

      </div>
    </section>

    <!-- Comparison Table -->
    <section class="comparison">
      <h2>Plan Comparison</h2>
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Basic</th>
              <th class="highlight-col">Pro</th>
              <th>Elite</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Details per month</td>
              <td>1 exterior</td>
              <td class="highlight-col">1 full detail</td>
              <td>2 full details</td>
            </tr>
            <tr>
              <td>Priority booking</td>
              <td>✓</td>
              <td class="highlight-col">✓</td>
              <td>First priority</td>
            </tr>
            <tr>
              <td>Add-on discount</td>
              <td>10%</td>
              <td class="highlight-col">20%</td>
              <td>30%</td>
            </tr>
            <tr>
              <td>Free interior detail/year</td>
              <td>—</td>
              <td class="highlight-col">✓</td>
              <td>✓</td>
            </tr>
            <tr>
              <td>Paint correction/year</td>
              <td>—</td>
              <td class="highlight-col">—</td>
              <td>✓ Quarterly</td>
            </tr>
            <tr>
              <td>Free engine bay cleaning</td>
              <td>—</td>
              <td class="highlight-col">—</td>
              <td>✓ Annual</td>
            </tr>
            <tr>
              <td>Dedicated support</td>
              <td>—</td>
              <td class="highlight-col">✓</td>
              <td>✓ Account manager</td>
            </tr>
            <tr>
              <td>Cancel anytime</td>
              <td>✓</td>
              <td class="highlight-col">✓</td>
              <td>✓</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Benefits -->
    <section class="benefits">
      <h2>Why Become a Member?</h2>
      <div class="benefits-grid">
        <div class="benefit-card">
          <span class="benefit-icon">💰</span>
          <h3>Save Every Month</h3>
          <p>Members pay significantly less per detail compared to one-time bookings — the savings add up fast.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">📅</span>
          <h3>Priority Scheduling</h3>
          <p>Skip the waitlist. Members get first access to available time slots before the public calendar opens.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">📍</span>
          <h3>We Come to You</h3>
          <p>Home, office, gym, or anywhere that works — we bring our own water and power. No drop-off needed.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">🔄</span>
          <h3>Flexible Cancellation</h3>
          <p>Life happens. Cancel or pause your plan at any time with no penalties and no awkward conversations.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">🛡️</span>
          <h3>Consistent Protection</h3>
          <p>Regular detailing protects your paint, interior, and resale value — not just a one-time clean.</p>
        </div>
        <div class="benefit-card">
          <span class="benefit-icon">🎁</span>
          <h3>Member-Only Perks</h3>
          <p>Exclusive discounts on add-ons, seasonal promotions, and early access to new services.</p>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="faq">
      <h2>Common Questions</h2>
      <div class="faq-list">
        <div class="faq-item" v-for="item in faqs" :key="item.q">
          <h3>{{ item.q }}</h3>
          <p>{{ item.a }}</p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <h2>Ready to stay clean all year?</h2>
      <p>Join hundreds of members who never worry about booking again.</p>
      <button class="btn-cta">Choose Your Plan</button>
    </section>

  </div>
</template>

<script setup>
const faqs = [
  {
    q: 'Can I switch plans after signing up?',
    a: 'Yes — you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    q: 'What if I need to skip a month?',
    a: 'Monthly members can pause their plan for up to one month per year. Annual members can roll over one unused detail to the following month.',
  },
  {
    q: 'Are memberships limited to cars?',
    a: 'Currently membership plans apply to car detailing. RV, boat, and motorcycle memberships are coming soon as those services launch.',
  },
  {
    q: 'Do I need to be home during the detail?',
    a: 'No — as long as we have access to your vehicle, you don\'t need to be present. Many members leave us a key or access code.',
  },
  {
    q: 'Is there a contract or commitment?',
    a: 'Monthly plans have zero commitment — cancel anytime. Annual plans are paid upfront for the year and are non-refundable after 30 days.',
  },
];
</script>

<style scoped>
.membership {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* ── Hero ── */
.hero {
  text-align: center;
  padding: 60px 20px 50px;
}

.hero h1 {
  font-size: 2.6rem;
  color: #007BFF;
  margin-bottom: 14px;
  font-weight: 800;
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.65;
}

/* ── Plans ── */
.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  margin-bottom: 70px;
  align-items: start;
}

.plan-card {
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  position: relative;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.plan-card.featured {
  border-color: #007BFF;
  box-shadow: 0 4px 24px rgba(0, 123, 255, 0.18);
}

.badge {
  position: absolute;
  top: -1px;
  right: 20px;
  background: #007BFF;
  color: white;
  padding: 5px 16px;
  border-radius: 0 0 10px 10px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.04em;
}

.plan-header {
  padding: 28px 28px 20px;
  text-align: center;
  color: white;
}

.basic-header  { background: linear-gradient(135deg, #374151, #6b7280); }
.pro-header    { background: linear-gradient(135deg, #1e40af, #3b82f6); }
.elite-header  { background: linear-gradient(135deg, #5b21b6, #8b5cf6); }

.plan-icon {
  font-size: 2.2rem;
  display: block;
  margin-bottom: 8px;
}

.plan-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 6px;
  color: white;
  text-align: center;
}

.plan-tagline {
  font-size: 0.9rem;
  opacity: 0.85;
  margin: 0;
}

.plan-body {
  padding: 24px 28px 28px;
}

.price {
  font-size: 2.8rem;
  font-weight: 800;
  color: #007BFF;
  margin-bottom: 4px;
  line-height: 1;
}

.price span {
  font-size: 1rem;
  color: #888;
  font-weight: 400;
}

.billed {
  font-size: 0.82rem;
  color: #888;
  margin-bottom: 20px;
}

.plan-body ul {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
}

.plan-body ul li {
  padding: 7px 0;
  color: #444;
  font-size: 0.93rem;
  border-bottom: 1px solid #f0f0f0;
}

.plan-body ul li::before {
  content: '✓ ';
  color: #007BFF;
  font-weight: 700;
}

.btn-plan {
  width: 100%;
  padding: 13px;
  border: 2px solid #007BFF;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  background: white;
  color: #007BFF;
  transition: background 0.2s, color 0.2s;
}

.btn-plan:hover {
  background: #007BFF;
  color: white;
}

.featured-btn {
  background: #007BFF;
  color: white;
}

.featured-btn:hover {
  background: #0056b3;
  border-color: #0056b3;
}

/* ── Comparison Table ── */
.comparison {
  margin-bottom: 70px;
}

.comparison h2 {
  font-size: 1.8rem;
  color: #222;
  text-align: center;
  margin-bottom: 28px;
}

.table-wrapper {
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 0.93rem;
}

thead tr {
  background: #f0f7ff;
}

th {
  padding: 14px 20px;
  text-align: center;
  font-weight: 700;
  color: #222;
  border-bottom: 2px solid #e0e0e0;
}

th:first-child {
  text-align: left;
}

td {
  padding: 12px 20px;
  text-align: center;
  color: #444;
  border-bottom: 1px solid #f0f0f0;
}

td:first-child {
  text-align: left;
  font-weight: 500;
  color: #222;
}

.highlight-col {
  background: #f0f7ff;
  color: #1e40af;
  font-weight: 600;
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody tr:hover {
  background: #fafafa;
}

/* ── Benefits ── */
.benefits {
  margin-bottom: 70px;
}

.benefits h2 {
  font-size: 1.8rem;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 20px;
}

.benefit-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 28px 24px;
  border: 1px solid #e5e7eb;
}

.benefit-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 12px;
}

.benefit-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #007BFF;
  margin-bottom: 8px;
}

.benefit-card p {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

/* ── FAQ ── */
.faq {
  margin-bottom: 70px;
}

.faq h2 {
  font-size: 1.8rem;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}

.faq-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(440px, 1fr));
  gap: 16px;
}

.faq-item {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 22px 24px;
}

.faq-item h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.faq-item p {
  color: #555;
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0;
}

/* ── CTA ── */
.cta {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 14px;
  padding: 56px 30px;
  text-align: center;
  color: white;
}

.cta h2 {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 10px;
}

.cta p {
  font-size: 1.05rem;
  opacity: 0.88;
  margin-bottom: 28px;
}

.btn-cta {
  background: white;
  color: #1e40af;
  border: none;
  padding: 14px 36px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cta:hover {
  background: #e0ecff;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }

  .plan-grid {
    grid-template-columns: 1fr;
  }

  .faq-list {
    grid-template-columns: 1fr;
  }

  .benefits-grid {
    grid-template-columns: 1fr;
  }
}
</style>
