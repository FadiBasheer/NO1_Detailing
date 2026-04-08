<template>
  <div class="membership">

    <!-- ═══════════════════════════════════════════
         LOADING
    ═══════════════════════════════════════════ -->
    <div v-if="loading" class="loading-state">
      <p>Loading...</p>
    </div>

    <!-- ═══════════════════════════════════════════
         ACTIVE MEMBER DASHBOARD
    ═══════════════════════════════════════════ -->
    <template v-else-if="membership && membership.status === 'ACTIVE'">

      <section class="member-hero">
        <div class="member-badge active">✓ Active Member</div>
        <h1>You're All Set!</h1>
        <p class="subtitle">
          Your <strong>{{ tierLabel(membership.tier) }}</strong> plan is active for your
          <strong>{{ membership.vehicleType }}</strong>.
          Credits reset each billing cycle.
        </p>
      </section>

      <!-- Quick actions -->
      <section class="member-actions">
        <div class="action-card" @click="$router.push('/vehicles')">
          <span class="action-icon">📅</span>
          <h3>Book a Service</h3>
          <p>Schedule your next detail — we come to you</p>
        </div>
        <div class="action-card" @click="manageOpen = true">
          <span class="action-icon">⚙️</span>
          <h3>Manage Plan</h3>
          <p>View details or cancel</p>
        </div>
      </section>

      <!-- Current plan summary -->
      <section class="current-plan-section">
        <h2>Your Current Plan</h2>
        <div :class="['current-plan-card', membership.tier.toLowerCase()]">
          <div class="cplan-top">
            <div class="cplan-identity">
              <span class="cplan-emoji">{{ tierEmoji(membership.tier) }}</span>
              <div>
                <div class="cplan-name">{{ tierLabel(membership.tier) }}</div>
                <div class="cplan-price">${{ membership.monthlyPrice }}<span>/mo</span></div>
              </div>
            </div>
            <div class="cplan-since">Member since {{ formatDate(membership.startDate) }}</div>
          </div>
          <ul class="cplan-features">
            <li v-for="f in tierFeatures(membership.tier)" :key="f">✓ {{ f }}</li>
          </ul>
          <div class="cplan-credits">
            <div class="credit-title">This Month's Credits</div>
            <div class="credit-row" v-if="['TIER1','TIER3'].includes(membership.tier)">
              <span>Exterior Wash</span>
              <span :class="membership.washCreditUsed ? 'used' : 'available'">
                {{ membership.washCreditUsed ? 'Used' : 'Available' }}
              </span>
            </div>
            <div class="credit-row" v-if="['TIER2','TIER3'].includes(membership.tier)">
              <span>Full Detail</span>
              <span :class="membership.detailCreditUsed ? 'used' : 'available'">
                {{ membership.detailCreditUsed ? 'Used' : 'Available' }}
              </span>
            </div>
            <div class="credit-note">5% off all add-on services</div>
          </div>
          <div class="cplan-billing">
            Next billing date: <strong>{{ formatDate(membership.nextBillingDate) }}</strong>
          </div>
          <button class="btn-manage" @click="manageOpen = true">Manage Plan</button>
        </div>
      </section>

    </template>

    <!-- ═══════════════════════════════════════════
         CANCELLED — RE-JOIN
    ═══════════════════════════════════════════ -->
    <template v-else-if="membership && membership.status === 'CANCELLED'">
      <section class="hero">
        <h1>Membership Plans</h1>
        <p class="subtitle">We'd love to have you back. Re-join anytime.</p>
      </section>
      <section class="plans" ref="plansSection">
        <p class="vehicle-prompt" v-if="!vehicleType">
          <router-link :to="{ path: '/vehicles', query: { next: 'membership' } }">
            Choose your vehicle
          </router-link>
          to see your personalised pricing.
        </p>
        <div v-else class="plan-grid">
          <div v-for="p in plans" :key="p.tier"
               :class="['plan-card', { featured: p.tier === 'TIER2' }]">
            <div class="badge" v-if="p.tier === 'TIER2'">Most Popular</div>
            <div :class="['plan-header', p.tier.toLowerCase() + '-header']">
              <span class="plan-icon">{{ p.emoji }}</span>
              <h2>{{ p.label }}</h2>
              <p class="plan-tagline">{{ p.tagline }}</p>
            </div>
            <div class="plan-body">
              <div class="price">${{ pricing[p.tier] }}<span>/mo</span></div>
              <ul>
                <li v-for="f in p.features" :key="f">{{ f }}</li>
              </ul>
              <button :class="['btn-plan', { 'featured-btn': p.tier === 'TIER2' }]"
                      @click="startSignup(p.tier)">
                Re-Join
              </button>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- ═══════════════════════════════════════════
         PUBLIC — NON-MEMBER
    ═══════════════════════════════════════════ -->
    <template v-else>

      <section class="hero">
        <h1>Membership Plans</h1>
        <p class="subtitle">
          Always clean, always priority. Save money and skip the hassle with a
          recurring detail plan tailored to how often you drive.
        </p>
      </section>

      <!-- Plans -->
      <section class="plans" ref="plansSection">
        <p v-if="!vehicleType" class="vehicle-prompt">
          <router-link :to="{ path: '/vehicles', query: { next: 'membership' } }">
            Select your vehicle
          </router-link>
          to see pricing for your car type.
        </p>
        <div v-else class="plan-grid">
          <div v-for="p in plans" :key="p.tier"
               :class="['plan-card', { featured: p.tier === 'TIER2' }]">
            <div class="badge" v-if="p.tier === 'TIER2'">Most Popular</div>
            <div :class="['plan-header', p.tier.toLowerCase() + '-header']">
              <span class="plan-icon">{{ p.emoji }}</span>
              <h2>{{ p.label }}</h2>
              <p class="plan-tagline">{{ p.tagline }}</p>
            </div>
            <div class="plan-body">
              <div class="price">${{ pricing[p.tier] }}<span>/mo</span></div>
              <p class="billed">Billed monthly — cancel anytime</p>
              <ul>
                <li v-for="f in p.features" :key="f">{{ f }}</li>
              </ul>
              <button :class="['btn-plan', { 'featured-btn': p.tier === 'TIER2' }]"
                      @click="startSignup(p.tier)">
                Get Started
              </button>
            </div>
          </div>
        </div>

        <div v-if="!vehicleType" class="no-vehicle-cta">
          <router-link :to="{ path: '/vehicles', query: { next: 'membership' } }"
                       class="btn-select-vehicle">
            Select Your Vehicle →
          </router-link>
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
                <th>Tier 1</th>
                <th class="highlight-col">Tier 2</th>
                <th>Tier 3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Exterior wash / month</td>
                <td>1</td>
                <td class="highlight-col">—</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Full detail / month</td>
                <td>—</td>
                <td class="highlight-col">1</td>
                <td>1</td>
              </tr>
              <tr>
                <td>Add-on discount</td>
                <td>5%</td>
                <td class="highlight-col">5%</td>
                <td>5%</td>
              </tr>
              <tr>
                <td>Priority booking</td>
                <td>✓</td>
                <td class="highlight-col">✓</td>
                <td>✓</td>
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
            <p>Members pay less per detail compared to one-time bookings.</p>
          </div>
          <div class="benefit-card">
            <span class="benefit-icon">📅</span>
            <h3>Priority Scheduling</h3>
            <p>Members get first access to available time slots.</p>
          </div>
          <div class="benefit-card">
            <span class="benefit-icon">📍</span>
            <h3>We Come to You</h3>
            <p>Home, office, gym — we bring our own water and power.</p>
          </div>
          <div class="benefit-card">
            <span class="benefit-icon">🛡️</span>
            <h3>Consistent Protection</h3>
            <p>Regular detailing protects your paint and resale value.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="cta">
        <h2>Ready to stay clean all year?</h2>
        <p>Join members who never worry about booking again.</p>
        <router-link :to="{ path: '/vehicles', query: { next: 'membership' } }"
                     class="btn-cta">
          Choose Your Plan
        </router-link>
      </section>

    </template>

    <!-- ═══════════════════════════════════════════
         SIGN-UP MODAL (payment)
    ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="signupModal.open" class="overlay" @click.self="closeSignup">
        <div class="modal">
          <button class="modal-close" @click="closeSignup">×</button>

          <!-- Step 1 — Confirm plan -->
          <div v-if="signupModal.step === 1" class="modal-step">
            <h2>Confirm Your Plan</h2>
            <p class="modal-sub">
              <strong>{{ tierLabel(signupModal.tier) }}</strong> for your
              <strong>{{ vehicleType }}</strong>
            </p>
            <div class="confirm-summary">
              <div class="confirm-row">
                <span>Monthly charge</span>
                <strong>${{ pricing[signupModal.tier] }}/mo</strong>
              </div>
              <div class="confirm-row">
                <span>Included</span>
                <strong>{{ tierIncluded(signupModal.tier) }}</strong>
              </div>
              <div class="confirm-row">
                <span>Add-on discount</span>
                <strong>5% off</strong>
              </div>
              <div class="confirm-row">
                <span>Cancel anytime</span>
                <strong>✓</strong>
              </div>
            </div>
            <p v-if="signupModal.error" class="modal-error">{{ signupModal.error }}</p>
            <button class="btn-primary" :disabled="signupModal.loading" @click="proceedToPayment">
              {{ signupModal.loading ? 'Loading...' : 'Proceed to Payment →' }}
            </button>
          </div>

          <!-- Step 2 — Processing -->
          <div v-else-if="signupModal.step === 2" class="modal-step modal-confirm">
            <div class="confirm-circle">💳</div>
            <h2>Complete Payment</h2>
            <p class="modal-sub">A payment window will appear. Complete your payment to activate your membership.</p>
          </div>

          <!-- Step 3 — Confirmed -->
          <div v-else-if="signupModal.step === 3" class="modal-step modal-confirm">
            <div class="confirm-circle">🎉</div>
            <h2>You're a Member!</h2>
            <p>Your <strong>{{ tierLabel(signupModal.tier) }}</strong> membership is now active.</p>
            <div class="confirm-details">
              <div class="confirm-row">
                <span>Vehicle</span>
                <strong>{{ vehicleType }}</strong>
              </div>
              <div class="confirm-row">
                <span>Monthly charge</span>
                <strong>${{ pricing[signupModal.tier] }}/mo</strong>
              </div>
            </div>
            <button class="btn-primary" @click="signupModal.open = false">View My Dashboard</button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ═══════════════════════════════════════════
         MANAGE PLAN MODAL
    ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="manageOpen" class="overlay" @click.self="manageOpen = false">
        <div class="modal">
          <button class="modal-close" @click="manageOpen = false">×</button>

          <div v-if="!cancelConfirm && !cancelDone" class="modal-step">
            <h2>Manage Your Plan</h2>
            <p class="modal-sub">
              <strong>{{ tierLabel(membership?.tier) }}</strong> — ${{ membership?.monthlyPrice }}/mo
            </p>
            <div class="plan-detail-list">
              <div class="plan-detail-row"><span>Vehicle</span><strong>{{ membership?.vehicleType }}</strong></div>
              <div class="plan-detail-row"><span>Started</span><strong>{{ formatDate(membership?.startDate) }}</strong></div>
              <div class="plan-detail-row"><span>Next billing</span><strong>{{ formatDate(membership?.nextBillingDate) }}</strong></div>
            </div>
            <button class="manage-btn cancel-btn" @click="cancelConfirm = true">
              <span>✕</span> Cancel Membership
              <small>End your plan at next billing date</small>
            </button>
          </div>

          <div v-else-if="cancelConfirm && !cancelDone" class="modal-step">
            <h2>Cancel Membership?</h2>
            <p>Your plan will end immediately and you won't be charged again. You can re-join anytime.</p>
            <p v-if="cancelError" class="modal-error">{{ cancelError }}</p>
            <button class="btn-danger" :disabled="cancelLoading" @click="confirmCancel">
              {{ cancelLoading ? 'Cancelling...' : 'Yes, Cancel My Membership' }}
            </button>
            <button class="btn-back" @click="cancelConfirm = false">← Keep My Plan</button>
          </div>

          <div v-else class="modal-step modal-confirm">
            <div class="confirm-circle" style="background:#fee2e2;color:#dc2626">✕</div>
            <h2>Membership Cancelled</h2>
            <p>Your membership has been cancelled. You can re-join anytime.</p>
            <button class="btn-primary" @click="manageOpen = false; cancelDone = false">Close</button>
          </div>

        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';
import api from '../axios.ts';

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

// ── Route params (from vehicle selection) ─────────────────────────────────
const vehicleType = computed(() => route.query.vehicle || null);

// ── State ─────────────────────────────────────────────────────────────────
const loading = ref(true);
const membership = ref(null);
const pricing = ref({ TIER1: null, TIER2: null, TIER3: null });

// ── Plan definitions ──────────────────────────────────────────────────────
const plans = [
  {
    tier: 'TIER1',
    label: 'Tier 1',
    emoji: '🚗',
    tagline: 'Keep the outside spotless',
    features: [
      '1 exterior wash per month',
      'Priority booking access',
      '5% off all add-on services',
      'Mobile service — we come to you',
      'Cancel anytime',
    ],
  },
  {
    tier: 'TIER2',
    label: 'Tier 2',
    emoji: '⭐',
    tagline: 'Full inside & out every month',
    features: [
      '1 full detail per month (interior + exterior)',
      'Priority booking access',
      '5% off all add-on services',
      'Mobile service — we come to you',
      'Cancel anytime',
    ],
  },
  {
    tier: 'TIER3',
    label: 'Tier 3',
    emoji: '💎',
    tagline: 'Maximum coverage for car enthusiasts',
    features: [
      '1 full detail per month',
      '1 extra exterior wash per month',
      'Priority booking access',
      '5% off all add-on services',
      'Mobile service — we come to you',
      'Cancel anytime',
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────
function tierLabel(tier) {
  return plans.find(p => p.tier === tier)?.label ?? tier;
}
function tierEmoji(tier) {
  return plans.find(p => p.tier === tier)?.emoji ?? '';
}
function tierFeatures(tier) {
  return plans.find(p => p.tier === tier)?.features ?? [];
}
function tierIncluded(tier) {
  const map = {
    TIER1: '1 exterior wash/mo',
    TIER2: '1 full detail/mo',
    TIER3: '1 full detail + 1 exterior wash/mo',
  };
  return map[tier] ?? '';
}
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

// ── Fetch membership + pricing on mount ───────────────────────────────────
onMounted(async () => {
  // Fetch current membership if logged in
  if (auth.accessToken) {
    try {
      const res = await api.get('/api/membership/me');
      membership.value = res.data.membership;
    } catch (err) {
      console.error('Failed to load membership:', err);
    }
  }

  // Fetch pricing if vehicle type is in URL
  if (vehicleType.value) {
    try {
      const res = await api.get('/api/membership/pricing', { params: { vehicleType: vehicleType.value } });
      if (res.data.pricing) pricing.value = res.data.pricing;
    } catch (err) {
      console.error('Failed to load pricing:', err);
    }
  }

  loading.value = false;

  // Helcim Pay.js message listener
  window.addEventListener('message', onHelcimMessage);
});

onUnmounted(() => {
  window.removeEventListener('message', onHelcimMessage);
  removeHelcimIframe();
});

// ── Sign-up flow ──────────────────────────────────────────────────────────
const signupModal = reactive({ open: false, step: 1, tier: null, loading: false, error: '' });

function startSignup(tier) {
  if (!auth.accessToken) {
    sessionStorage.setItem('yumeeco_pending_plan', JSON.stringify({ tier, vehicle: vehicleType.value }));
    router.push('/login');
    return;
  }
  if (!vehicleType.value) {
    router.push({ path: '/vehicles', query: { next: 'membership' } });
    return;
  }
  signupModal.tier = tier;
  signupModal.step = 1;
  signupModal.loading = false;
  signupModal.error = '';
  signupModal.open = true;
}

function closeSignup() {
  if (signupModal.step === 2) return; // Don't close during payment
  removeHelcimIframe();
  signupModal.open = false;
}

async function proceedToPayment() {
  signupModal.loading = true;
  signupModal.error = '';
  try {
    const res = await api.post('/api/membership/checkout-token', {
      vehicleType: vehicleType.value,
      tier: signupModal.tier,
    });
    signupModal.step = 2;
    signupModal.loading = false;
    loadHelcimScript(() => {
      appendHelcimPayIframe(res.data.checkoutToken);
    });
  } catch (err) {
    signupModal.error = err.response?.data?.message || 'Failed to start payment.';
    signupModal.loading = false;
  }
}

function loadHelcimScript(cb) {
  if (window.appendHelcimPayIframe) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'https://secure.helcim.app/helcim-pay/services/start.js';
  s.onload = cb;
  document.head.appendChild(s);
}

async function onHelcimMessage(event) {
  if (event.data?.eventType !== 'HELCIM_PAY_JS_WITH_RESULT') return;

  removeHelcimIframe();

  if (event.data.eventStatus === 'FAILED') {
    signupModal.step = 1;
    signupModal.error = 'Payment failed or was cancelled. Please try again.';
    return;
  }

  if (event.data.eventStatus === 'SUCCESS') {
    const tx = event.data.data?.transactions?.[0] || event.data.data || {};
    try {
      const res = await api.post('/api/membership/activate', {
        vehicleType: vehicleType.value,
        tier: signupModal.tier,
        transactionId: tx.transactionId,
        cardToken: tx.cardToken || null,
        customerCode: tx.customerCode || null,
      });
      membership.value = res.data.membership;
      signupModal.step = 3;
    } catch (err) {
      signupModal.step = 1;
      signupModal.error = err.response?.data?.message || 'Activation failed. Contact support.';
    }
  }
}

function removeHelcimIframe() {
  const iframe = document.querySelector('iframe[name="helcimPayIframe"]') ||
                 document.getElementById('helcim-pay-iframe');
  if (iframe) iframe.remove();
  const overlay = document.querySelector('.helcim-pay-overlay');
  if (overlay) overlay.remove();
}

// ── Cancel flow ───────────────────────────────────────────────────────────
const manageOpen = ref(false);
const cancelConfirm = ref(false);
const cancelDone = ref(false);
const cancelLoading = ref(false);
const cancelError = ref('');

async function confirmCancel() {
  cancelLoading.value = true;
  cancelError.value = '';
  try {
    const res = await fetch('/api/membership/cancel', {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    const data = await res.json();
    if (res.ok) {
      membership.value = data.membership;
      cancelDone.value = true;
    } else {
      cancelError.value = data.message || 'Failed to cancel.';
    }
  } catch (err) {
    cancelError.value = 'Network error. Please try again.';
  } finally {
    cancelLoading.value = false;
  }
}
</script>

<style scoped>
.membership {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #888;
  font-size: 1.1rem;
}

/* ── Hero ────────────────────────────────────── */
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

/* ── Vehicle prompt ──────────────────────────── */
.vehicle-prompt {
  text-align: center;
  font-size: 1.05rem;
  color: #555;
  margin-bottom: 32px;
}
.vehicle-prompt a {
  color: #007BFF;
  font-weight: 700;
  text-decoration: none;
}
.vehicle-prompt a:hover { text-decoration: underline; }

.no-vehicle-cta {
  text-align: center;
  margin-top: 32px;
}
.btn-select-vehicle {
  display: inline-block;
  background: #007BFF;
  color: white;
  padding: 14px 36px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-select-vehicle:hover { background: #0056b3; }

/* ── Member hero ─────────────────────────────── */
.member-hero {
  text-align: center;
  padding: 50px 20px 40px;
}
.member-hero h1 {
  font-size: 2.4rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 12px;
}
.member-badge {
  display: inline-block;
  padding: 6px 20px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 16px;
}
.member-badge.active { background: #d1fae5; color: #065f46; }

/* ── Action cards ────────────────────────────── */
.member-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 50px;
}
.action-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 28px 24px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}
.action-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.09);
  border-color: #007BFF;
}
.action-icon { font-size: 2.2rem; display: block; margin-bottom: 12px; }
.action-card h3 { font-size: 1.05rem; font-weight: 700; color: #1a1a1a; margin-bottom: 6px; }
.action-card p { color: #666; font-size: 0.88rem; margin: 0; }

/* ── Current plan card ───────────────────────── */
.current-plan-section { margin-bottom: 60px; }
.current-plan-section h2 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 20px;
  text-align: center;
}
.current-plan-card {
  border-radius: 16px;
  padding: 28px 32px;
  border: 2px solid #e0e0e0;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.current-plan-card.tier1 { border-color: #6b7280; }
.current-plan-card.tier2 { border-color: #007BFF; }
.current-plan-card.tier3 { border-color: #8b5cf6; }

.cplan-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}
.cplan-identity { display: flex; align-items: center; gap: 16px; }
.cplan-emoji { font-size: 2.4rem; }
.cplan-name { font-size: 1.4rem; font-weight: 800; color: #1a1a1a; }
.cplan-price { font-size: 1.6rem; font-weight: 700; color: #007BFF; }
.cplan-price span { font-size: 0.9rem; color: #888; font-weight: 400; }
.cplan-since { font-size: 0.85rem; color: #888; }

.cplan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px 24px;
}
.cplan-features li { font-size: 0.92rem; color: #444; padding: 4px 0; }

.cplan-credits {
  background: #f0f7ff;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 16px;
}
.credit-title { font-size: 0.85rem; font-weight: 700; color: #1e40af; margin-bottom: 10px; }
.credit-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.88rem;
  color: #444;
  padding: 4px 0;
}
.credit-row .available { color: #16a34a; font-weight: 700; }
.credit-row .used { color: #9ca3af; font-weight: 700; }
.credit-note { font-size: 0.8rem; color: #6b7280; margin-top: 8px; }
.cplan-billing { font-size: 0.85rem; color: #666; margin-bottom: 20px; }

.btn-manage {
  background: #007BFF;
  color: #fff;
  border: none;
  padding: 12px 28px;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-manage:hover { background: #0056b3; }

/* ── Plans grid ──────────────────────────────── */
.plans { margin-bottom: 70px; }
.plan-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 28px;
  align-items: start;
}
.plan-card {
  border: 1px solid #e0e0e0;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  position: relative;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}
.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.plan-card.featured {
  border-color: #007BFF;
  box-shadow: 0 4px 24px rgba(0,123,255,0.18);
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
}
.plan-header {
  padding: 28px 28px 20px;
  text-align: center;
  color: white;
}
.tier1-header { background: linear-gradient(135deg, #374151, #6b7280); }
.tier2-header { background: linear-gradient(135deg, #1e40af, #3b82f6); }
.tier3-header { background: linear-gradient(135deg, #5b21b6, #8b5cf6); }
.plan-icon { font-size: 2.2rem; display: block; margin-bottom: 8px; }
.plan-header h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin: 0 0 6px;
  color: white;
  text-align: center;
}
.plan-tagline { font-size: 0.9rem; opacity: 0.85; margin: 0; }
.plan-body { padding: 24px 28px 28px; }
.price {
  font-size: 2.8rem;
  font-weight: 800;
  color: #007BFF;
  margin-bottom: 4px;
  line-height: 1;
}
.price span { font-size: 1rem; color: #888; font-weight: 400; }
.billed { font-size: 0.82rem; color: #888; margin-bottom: 20px; }
.plan-body ul { list-style: none; padding: 0; margin: 0 0 24px; }
.plan-body ul li {
  padding: 7px 0;
  color: #444;
  font-size: 0.93rem;
  border-bottom: 1px solid #f0f0f0;
}
.plan-body ul li::before { content: '✓ '; color: #007BFF; font-weight: 700; }
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
.btn-plan:hover { background: #007BFF; color: white; }
.featured-btn { background: #007BFF; color: white; }
.featured-btn:hover { background: #0056b3; border-color: #0056b3; }

/* ── Comparison ──────────────────────────────── */
.comparison { margin-bottom: 70px; }
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
table { width: 100%; border-collapse: collapse; background: white; font-size: 0.93rem; }
thead tr { background: #f0f7ff; }
th {
  padding: 14px 20px;
  text-align: center;
  font-weight: 700;
  color: #222;
  border-bottom: 2px solid #e0e0e0;
}
th:first-child { text-align: left; }
td { padding: 12px 20px; text-align: center; color: #444; border-bottom: 1px solid #f0f0f0; }
td:first-child { text-align: left; font-weight: 500; color: #222; }
.highlight-col { background: #f0f7ff; color: #1e40af; font-weight: 600; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: #fafafa; }

/* ── Benefits ────────────────────────────────── */
.benefits { margin-bottom: 70px; }
.benefits h2 {
  font-size: 1.8rem;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}
.benefit-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 28px 24px;
  border: 1px solid #e5e7eb;
}
.benefit-icon { font-size: 2rem; display: block; margin-bottom: 12px; }
.benefit-card h3 { font-size: 1.05rem; font-weight: 700; color: #007BFF; margin-bottom: 8px; }
.benefit-card p { color: #555; font-size: 0.9rem; line-height: 1.6; margin: 0; }

/* ── CTA ─────────────────────────────────────── */
.cta {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 14px;
  padding: 56px 30px;
  text-align: center;
  color: white;
  margin-bottom: 40px;
}
.cta h2 { font-size: 2rem; font-weight: 800; color: white; margin-bottom: 10px; }
.cta p { font-size: 1.05rem; opacity: 0.88; margin-bottom: 28px; }
.btn-cta {
  display: inline-block;
  background: white;
  color: #1e40af;
  border: none;
  padding: 14px 36px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  transition: background 0.2s;
}
.btn-cta:hover { background: #e0ecff; }

/* ── Modals ──────────────────────────────────── */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9000;
  padding: 20px;
}
.modal {
  background: #fff;
  border-radius: 18px;
  padding: 36px 40px;
  width: 100%;
  max-width: 460px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-close {
  position: absolute;
  top: 16px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.6rem;
  cursor: pointer;
  color: #888;
  line-height: 1;
}
.modal-close:hover { color: #333; }
.modal-step h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 8px;
  text-align: center;
}
.modal-sub {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-bottom: 22px;
}
.modal-error {
  color: #dc2626;
  font-size: 0.88rem;
  text-align: center;
  margin-bottom: 12px;
}
.modal-confirm { text-align: center; }
.confirm-circle {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #dbeafe;
  color: #1e40af;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}
.confirm-summary {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 20px;
  text-align: left;
}
.confirm-row {
  display: flex;
  justify-content: space-between;
  padding: 7px 0;
  font-size: 0.92rem;
  color: #555;
  border-bottom: 1px solid #e5e7eb;
}
.confirm-row:last-child { border-bottom: none; }
.confirm-row strong { color: #1a1a1a; }
.confirm-details {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px 20px;
  margin: 18px 0;
  text-align: left;
}

/* Manage modal */
.plan-detail-list { margin-bottom: 24px; }
.plan-detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 0.92rem;
  color: #555;
  border-bottom: 1px solid #f0f0f0;
}
.plan-detail-row:last-child { border-bottom: none; }
.plan-detail-row strong { color: #1a1a1a; }
.manage-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1.5px solid;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  gap: 2px;
  text-align: left;
}
.manage-btn span { font-size: 1.1rem; margin-bottom: 2px; }
.manage-btn small { font-size: 0.8rem; font-weight: 400; opacity: 0.7; }
.manage-btn:hover { filter: brightness(0.95); }
.cancel-btn { background: #fff1f2; border-color: #f43f5e; color: #be123c; }

/* Shared */
.btn-primary {
  width: 100%;
  background: #007BFF;
  color: white;
  border: none;
  padding: 13px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 4px;
}
.btn-primary:hover { background: #0056b3; }
.btn-primary:disabled { background: #b3d1ff; cursor: not-allowed; }
.btn-back {
  background: none;
  border: none;
  color: #007BFF;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 10px 0 0;
  display: block;
  width: 100%;
  text-align: center;
}
.btn-back:hover { text-decoration: underline; }
.btn-danger {
  width: 100%;
  background: #dc2626;
  color: white;
  border: none;
  padding: 13px;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  margin-bottom: 10px;
  transition: background 0.2s;
}
.btn-danger:hover { background: #b91c1c; }
.btn-danger:disabled { background: #fca5a5; cursor: not-allowed; }

/* ── Responsive ──────────────────────────────── */
@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .plan-grid { grid-template-columns: 1fr; }
  .benefits-grid { grid-template-columns: 1fr; }
  .member-actions { grid-template-columns: 1fr; }
  .cplan-top { flex-direction: column; align-items: flex-start; }
  .modal { padding: 28px 22px; }
}
</style>
