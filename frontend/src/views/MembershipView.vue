<template>
  <div class="membership">

    <!-- ═══════════════════════════════════════════
         ACTIVE / PAUSED MEMBER DASHBOARD
    ═══════════════════════════════════════════ -->
    <template v-if="isMember">

      <section class="member-hero">
        <div :class="['member-badge', membership.status]">
          {{ membership.status === 'paused' ? '⏸ Plan Paused' : '✓ Active Member' }}
        </div>
        <h1 v-if="membership.status === 'active'">You're All Set!</h1>
        <h1 v-else>Your Plan is Paused</h1>
        <p class="subtitle" v-if="membership.status === 'active'">
          Your <strong>{{ planLabel(membership.plan) }}</strong> plan is active.
          Credits load at the start of each billing cycle.
        </p>
        <p class="subtitle" v-else>
          Your plan is paused until <strong>{{ formatDate(membership.pausedUntil) }}</strong>.
          Billing resumes automatically after that.
        </p>
      </section>

      <!-- Quick action cards -->
      <section class="member-actions">
        <div class="action-card" @click="bookService">
          <span class="action-icon">📅</span>
          <h3>Book a Service</h3>
          <p>Schedule your next detail — we come to you</p>
        </div>
        <div class="action-card" @click="addonsModal = true">
          <span class="action-icon">✨</span>
          <h3>Add-On Services</h3>
          <p>Ceramic · Pet hair · Engine bay</p>
        </div>
        <div class="action-card" @click="openManage">
          <span class="action-icon">⚙️</span>
          <h3>Manage Plan</h3>
          <p>Upgrade · Pause · Cancel</p>
        </div>
      </section>

      <!-- Current plan summary -->
      <section class="current-plan-section">
        <h2>Your Current Plan</h2>
        <div :class="['current-plan-card', membership.plan]">
          <div class="cplan-top">
            <div class="cplan-identity">
              <span class="cplan-emoji">{{ planEmoji(membership.plan) }}</span>
              <div>
                <div class="cplan-name">{{ planLabel(membership.plan) }}</div>
                <div class="cplan-price">{{ planPrice(membership.plan) }}<span>/mo</span></div>
              </div>
            </div>
            <div class="cplan-since">Member since {{ formatDate(membership.startDate) }}</div>
          </div>
          <ul class="cplan-features">
            <li v-for="f in planFeatures(membership.plan)" :key="f">✓ {{ f }}</li>
          </ul>
          <button class="btn-manage" @click="openManage">Manage Plan</button>
        </div>
      </section>

    </template>

    <!-- ═══════════════════════════════════════════
         CANCELLED — RE-JOIN OFFER
    ═══════════════════════════════════════════ -->
    <template v-else-if="membership && membership.status === 'cancelled'">

      <section class="hero">
        <h1>Membership Plans</h1>
        <p class="subtitle">We've missed you. Re-join today for an exclusive welcome-back deal.</p>
      </section>

      <section class="rejoin-section">
        <div class="rejoin-card">
          <span class="rejoin-emoji">🎉</span>
          <h3>Welcome-Back Offer</h3>
          <p>Re-activate any plan and get <strong>your first month free</strong>.</p>
          <button class="btn-cta" @click="startSignup(null, true)">Re-Join Now</button>
        </div>
      </section>

      <!-- Show plans with welcome-back context -->
      <section class="plans">
        <div class="plan-grid">
          <div v-for="p in plans" :key="p.id" :class="['plan-card', { featured: p.id === 'pro' }]">
            <div class="badge" v-if="p.id === 'pro'">Most Popular</div>
            <div :class="['plan-header', p.id + '-header']">
              <span class="plan-icon">{{ p.emoji }}</span>
              <h2>{{ p.label }}</h2>
              <p class="plan-tagline">{{ p.tagline }}</p>
            </div>
            <div class="plan-body">
              <div class="price">{{ p.price }}<span>/mo</span></div>
              <p class="billed">{{ p.billedNote }}</p>
              <ul>
                <li v-for="f in p.features" :key="f">{{ f }}</li>
              </ul>
              <button :class="['btn-plan', { 'featured-btn': p.id === 'pro' }]"
                      @click="startSignup(p.id, true)">
                Re-Join — 1st Month Free
              </button>
            </div>
          </div>
        </div>
      </section>

    </template>

    <!-- ═══════════════════════════════════════════
         PUBLIC PAGE (non-member)
    ═══════════════════════════════════════════ -->
    <template v-else>

      <!-- Hero -->
      <section class="hero">
        <h1>Membership Plans</h1>
        <p class="subtitle">
          Always clean, always priority. Save money and skip the hassle with a
          recurring detail plan tailored to how often you drive.
        </p>
      </section>

      <!-- Plans -->
      <section class="plans" ref="plansSection">
        <div class="plan-grid">
          <div v-for="p in plans" :key="p.id" :class="['plan-card', { featured: p.id === 'pro' }]">
            <div class="badge" v-if="p.id === 'pro'">Most Popular</div>
            <div :class="['plan-header', p.id + '-header']">
              <span class="plan-icon">{{ p.emoji }}</span>
              <h2>{{ p.label }}</h2>
              <p class="plan-tagline">{{ p.tagline }}</p>
            </div>
            <div class="plan-body">
              <div class="price">{{ p.price }}<span>/mo</span></div>
              <p class="billed">{{ p.billedNote }}</p>
              <ul>
                <li v-for="f in p.features" :key="f">{{ f }}</li>
              </ul>
              <button :class="['btn-plan', { 'featured-btn': p.id === 'pro' }]"
                      @click="startSignup(p.id)">
                Get Started
              </button>
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
        <button class="btn-cta" @click="scrollToPlans">Choose Your Plan</button>
      </section>

    </template>

    <!-- ═══════════════════════════════════════════
         SIGN-UP MODAL (3-step flow)
    ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="signupModal.open" class="overlay" @click.self="signupModal.open = false">
        <div class="modal">
          <button class="modal-close" @click="signupModal.open = false">×</button>

          <!-- Progress bar -->
          <div class="modal-progress">
            <div v-for="n in 3" :key="n"
                 :class="['progress-dot', { active: signupModal.step === n, done: signupModal.step > n }]">
            </div>
          </div>
          <div class="progress-labels">
            <span :class="{ active: signupModal.step >= 1 }">Plan</span>
            <span :class="{ active: signupModal.step >= 2 }">Billing</span>
            <span :class="{ active: signupModal.step >= 3 }">Confirm</span>
          </div>

          <!-- Step 1 — Choose Plan -->
          <div v-if="signupModal.step === 1" class="modal-step">
            <h2>Choose Your Plan</h2>
            <p class="modal-sub" v-if="signupModal.isRejoin">
              🎉 Welcome back! Your first month is on us.
            </p>
            <div class="modal-plan-options">
              <div v-for="p in plans" :key="p.id"
                   :class="['modal-plan-opt', { selected: signupModal.plan === p.id }]"
                   @click="signupModal.plan = p.id">
                <span class="opt-emoji">{{ p.emoji }}</span>
                <div class="opt-info">
                  <strong>{{ p.label }}</strong>
                  <small>{{ p.tagline }}</small>
                </div>
                <span class="opt-price">{{ p.price }}/mo</span>
                <span class="opt-check" v-if="signupModal.plan === p.id">✓</span>
              </div>
            </div>
            <button class="btn-primary" :disabled="!signupModal.plan"
                    @click="signupModal.step = 2">
              Continue →
            </button>
          </div>

          <!-- Step 2 — Billing -->
          <div v-else-if="signupModal.step === 2" class="modal-step">
            <h2>Set Up Auto-Billing</h2>
            <p class="modal-sub">
              {{ signupModal.isRejoin ? 'First month free, then ' : '' }}
              <strong>{{ planPrice(signupModal.plan) }}/mo</strong> billed automatically.
            </p>
            <form @submit.prevent="activateMembership" class="billing-form">
              <div class="form-group">
                <label>Cardholder Name</label>
                <input v-model="billingForm.name" placeholder="Jane Smith" required />
              </div>
              <div class="form-group">
                <label>Card Number</label>
                <input v-model="billingForm.card" placeholder="•••• •••• •••• ••••"
                       maxlength="19" @input="formatCard" required />
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>Expiry</label>
                  <input v-model="billingForm.expiry" placeholder="MM/YY"
                         maxlength="5" @input="formatExpiry" required />
                </div>
                <div class="form-group">
                  <label>CVV</label>
                  <input v-model="billingForm.cvv" placeholder="•••"
                         maxlength="3" required type="password" />
                </div>
              </div>
              <p class="secure-note">🔒 Your information is encrypted and secure.</p>
              <button type="submit" class="btn-primary">Activate Membership</button>
            </form>
            <button class="btn-back" @click="signupModal.step = 1">← Back</button>
          </div>

          <!-- Step 3 — Confirmation -->
          <div v-else-if="signupModal.step === 3" class="modal-step modal-confirm">
            <div class="confirm-circle">🎉</div>
            <h2>You're a Member!</h2>
            <p>
              Your <strong>{{ planLabel(signupModal.plan) }}</strong> membership is now active.
              <span v-if="signupModal.isRejoin"> Your first month is on us!</span>
            </p>
            <div class="confirm-details">
              <div class="confirm-row">
                <span>Plan</span>
                <strong>{{ planLabel(signupModal.plan) }}</strong>
              </div>
              <div class="confirm-row">
                <span>Next charge</span>
                <strong>{{ nextChargeDate(signupModal.isRejoin) }}</strong>
              </div>
            </div>
            <p class="confirm-email" v-if="user">
              A confirmation email has been sent to <strong>{{ user.email }}</strong>.
            </p>
            <button class="btn-primary" @click="signupModal.open = false">View My Dashboard</button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ═══════════════════════════════════════════
         MANAGE PLAN MODAL
    ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="manageModal.open" class="overlay"
           @click.self="['main','upgrade','pause'].includes(manageModal.step) && (manageModal.open = false)">
        <div class="modal">
          <button v-if="manageModal.step !== 'cancelled'"
                  class="modal-close" @click="manageModal.open = false">×</button>

          <!-- Main options -->
          <div v-if="manageModal.step === 'main'" class="modal-step">
            <h2>Manage Your Plan</h2>
            <p class="modal-sub">Current plan: <strong>{{ planLabel(membership?.plan) }}</strong></p>
            <div class="manage-options">
              <button v-if="membership?.plan !== 'elite'"
                      class="manage-btn upgrade-btn"
                      @click="manageModal.step = 'upgrade'">
                <span>↑</span> Upgrade Plan
                <small>Move to a higher tier with prorated credit</small>
              </button>
              <button v-if="membership?.status === 'active'"
                      class="manage-btn pause-btn"
                      @click="manageModal.step = 'pause'">
                <span>⏸</span> Pause Plan
                <small>Pause billing for up to 2 months</small>
              </button>
              <button v-if="membership?.status === 'paused'"
                      class="manage-btn resume-btn"
                      @click="resumePlan">
                <span>▶</span> Resume Plan
                <small>Restart your membership now</small>
              </button>
              <button class="manage-btn cancel-btn"
                      @click="manageModal.step = 'cancel'">
                <span>✕</span> Cancel Membership
                <small>End your plan at billing cycle close</small>
              </button>
            </div>
          </div>

          <!-- Upgrade -->
          <div v-else-if="manageModal.step === 'upgrade'" class="modal-step">
            <h2>Upgrade Your Plan</h2>
            <p class="modal-sub">Changes take effect immediately. A prorated credit is applied.</p>
            <div class="upgrade-options">
              <div v-for="p in upgradablePlans" :key="p.id"
                   :class="['upgrade-opt', { selected: upgradeTarget === p.id }]"
                   @click="upgradeTarget = p.id">
                <span class="opt-emoji">{{ p.emoji }}</span>
                <div class="opt-info">
                  <strong>{{ p.label }}</strong>
                  <small>{{ p.tagline }}</small>
                </div>
                <div class="opt-right">
                  <span class="opt-price">{{ p.price }}/mo</span>
                  <span class="opt-diff">+{{ planPriceDiff(membership?.plan, p.id) }}/mo</span>
                </div>
                <span class="opt-check" v-if="upgradeTarget === p.id">✓</span>
              </div>
            </div>
            <button class="btn-primary" :disabled="!upgradeTarget" @click="confirmUpgrade">
              Confirm Upgrade
            </button>
            <button class="btn-back" @click="manageModal.step = 'main'">← Back</button>
          </div>

          <!-- Upgraded confirmation -->
          <div v-else-if="manageModal.step === 'upgraded'" class="modal-step modal-confirm">
            <div class="confirm-circle" style="background:#d1fae5;color:#065f46">✓</div>
            <h2>Plan Upgraded!</h2>
            <p>You're now on the <strong>{{ planLabel(membership?.plan) }}</strong> plan.
               A prorated credit has been applied to this billing cycle.</p>
            <button class="btn-primary" @click="manageModal.open = false">Done</button>
          </div>

          <!-- Pause -->
          <div v-else-if="manageModal.step === 'pause'" class="modal-step">
            <h2>Pause Your Plan</h2>
            <p class="modal-sub">Billing is suspended during your pause. No charges, no credits used.</p>
            <div class="pause-selector">
              <label>How long would you like to pause?</label>
              <div class="pause-options">
                <button :class="['pause-opt', { selected: pauseMonths === 1 }]"
                        @click="pauseMonths = 1">
                  1 Month
                </button>
                <button :class="['pause-opt', { selected: pauseMonths === 2 }]"
                        @click="pauseMonths = 2">
                  2 Months
                </button>
              </div>
              <p class="pause-info">
                Your plan will automatically resume on
                <strong>{{ pauseResumeDate() }}</strong>.
              </p>
            </div>
            <button class="btn-primary" @click="confirmPause">Confirm Pause</button>
            <button class="btn-back" @click="manageModal.step = 'main'">← Back</button>
          </div>

          <!-- Paused confirmation -->
          <div v-else-if="manageModal.step === 'paused'" class="modal-step modal-confirm">
            <div class="confirm-circle" style="background:#fef3c7;color:#92400e">⏸</div>
            <h2>Plan Paused</h2>
            <p>Your plan is paused for <strong>{{ pauseMonths }} month(s)</strong>.
               Billing resumes automatically on <strong>{{ formatDate(membership?.pausedUntil) }}</strong>.</p>
            <button class="btn-primary" @click="manageModal.open = false">Done</button>
          </div>

          <!-- Cancel → Win-back offer -->
          <div v-else-if="manageModal.step === 'cancel'" class="modal-step winback-step">
            <div class="winback-sad">😔</div>
            <h2>Before You Go...</h2>
            <p>We'd hate to lose you. As a valued member, here's a special offer:</p>
            <div class="winback-card">
              <span class="winback-gift">🎁</span>
              <div>
                <strong>1 Free Month</strong>
                <p>Stay on your <strong>{{ planLabel(membership?.plan) }}</strong> plan and
                   skip next month's charge — on us.</p>
              </div>
            </div>
            <button class="btn-primary" @click="acceptWinback">Yes, I'll Stay!</button>
            <button class="btn-cancel-link" @click="manageModal.step = 'cancel-confirm'">
              No thanks, cancel my membership
            </button>
          </div>

          <!-- Winback accepted -->
          <div v-else-if="manageModal.step === 'winback-accepted'" class="modal-step modal-confirm">
            <div class="confirm-circle">🎉</div>
            <h2>Great, You're Staying!</h2>
            <p>Your next month is <strong>free</strong>. We've applied the credit to your account.</p>
            <button class="btn-primary" @click="manageModal.open = false">Back to Dashboard</button>
          </div>

          <!-- Cancel confirmation -->
          <div v-else-if="manageModal.step === 'cancel-confirm'" class="modal-step">
            <h2>Are You Sure?</h2>
            <p>Your membership will end at the close of your current billing period.
               You won't be charged again.</p>
            <button class="btn-danger" @click="confirmCancel">Yes, Cancel My Membership</button>
            <button class="btn-back" @click="manageModal.step = 'main'">← Keep My Plan</button>
          </div>

          <!-- Cancelled -->
          <div v-else-if="manageModal.step === 'cancelled'" class="modal-step modal-confirm">
            <div class="confirm-circle" style="background:#fee2e2;color:#dc2626">✕</div>
            <h2>Membership Cancelled</h2>
            <p>Your membership has been cancelled. You'll receive an offboarding email and a short
               survey — your feedback matters to us.</p>
            <p style="margin-top:8px">You can re-join anytime with a welcome-back discount.</p>
            <button class="btn-primary" @click="manageModal.open = false">Close</button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ═══════════════════════════════════════════
         ADD-ONS MODAL
    ═══════════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="addonsModal" class="overlay" @click.self="addonsModal = false">
        <div class="modal modal-wide">
          <button class="modal-close" @click="addonsModal = false">×</button>
          <h2>Add-On Services</h2>
          <p class="modal-sub">As a <strong>{{ planLabel(membership?.plan) }}</strong> member, you save
            <strong>{{ addonDiscount }}%</strong> on all add-ons.</p>
          <div class="addons-list">
            <div v-for="addon in addons" :key="addon.name" class="addon-item">
              <span class="addon-icon">{{ addon.icon }}</span>
              <div class="addon-info">
                <strong>{{ addon.name }}</strong>
                <p>{{ addon.description }}</p>
              </div>
              <div class="addon-pricing">
                <span class="addon-original">{{ addon.original }}</span>
                <span class="addon-member">{{ memberAddonPrice(addon) }}</span>
              </div>
              <button class="addon-book-btn" @click="bookAddon(addon)">Book</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.ts';

const router = useRouter();
const auth = useAuthStore();
const user = computed(() => auth.user);

// ── Plan data ──────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'basic',
    label: 'Basic',
    emoji: '🚗',
    price: '$79',
    priceNum: 79,
    tagline: 'Perfect for the occasional clean',
    billedNote: 'Billed monthly — cancel anytime',
    features: [
      '1 exterior detail per month',
      'Priority booking access',
      '10% off all add-on services',
      'Mobile service — we come to you',
      'Cancel anytime, no questions',
    ],
  },
  {
    id: 'pro',
    label: 'Pro',
    emoji: '⭐',
    price: '$59',
    priceNum: 59,
    tagline: 'Best value for regular drivers',
    billedNote: 'Billed $708/year — save 25%',
    features: [
      '1 full interior + exterior detail/mo',
      'Priority booking access',
      '20% off all add-on services',
      '1 free interior deep clean/year',
      'Mobile service — we come to you',
      'Dedicated account support',
    ],
  },
  {
    id: 'elite',
    label: 'Elite',
    emoji: '💎',
    price: '$99',
    priceNum: 99,
    tagline: 'For the car enthusiast',
    billedNote: 'Billed $1,188/year',
    features: [
      '2 full details per month',
      'First-priority booking — skip all queues',
      '30% off all add-on services',
      'Quarterly paint correction included',
      'Free engine bay cleaning/year',
      'Dedicated account manager',
      'Exclusive member-only promotions',
    ],
  },
];

const addons = [
  { icon: '🪩', name: 'Ceramic Coating', description: 'Long-lasting paint protection up to 2 years.', original: '$350', originalNum: 350 },
  { icon: '🐾', name: 'Pet Hair Removal', description: 'Deep extraction of pet hair from all surfaces.', original: '$80', originalNum: 80 },
  { icon: '🔧', name: 'Engine Bay Cleaning', description: 'Degreased and detailed engine compartment.', original: '$120', originalNum: 120 },
  { icon: '🪟', name: 'Window Tinting', description: 'Professional tint installation, all windows.', original: '$250', originalNum: 250 },
  { icon: '✨', name: 'Paint Correction', description: 'Remove swirl marks and light scratches.', original: '$200', originalNum: 200 },
  { icon: '🧴', name: 'Odor Elimination', description: 'Ozone treatment to neutralise persistent odours.', original: '$90', originalNum: 90 },
];

const faqs = [
  {
    q: 'Can I switch plans after signing up?',
    a: "Yes — you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: 'What if I need to skip a month?',
    a: "Monthly members can pause their plan for up to 2 months per year. Annual members can roll over one unused detail to the following month.",
  },
  {
    q: 'Are memberships limited to cars?',
    a: "Currently membership plans apply to car detailing. RV, boat, and motorcycle memberships are coming soon.",
  },
  {
    q: 'Do I need to be home during the detail?',
    a: "No — as long as we have access to your vehicle, you don't need to be present. Many members leave us a key or access code.",
  },
  {
    q: 'Is there a contract or commitment?',
    a: "Monthly plans have zero commitment — cancel anytime. Annual plans are paid upfront and are non-refundable after 30 days.",
  },
];

// ── Membership state ───────────────────────────────────────────────────────
const membership = ref(JSON.parse(localStorage.getItem('no1_membership') || 'null'));
const isMember = computed(() =>
  membership.value && membership.value.status !== 'cancelled'
);

function saveMembership() {
  localStorage.setItem('no1_membership', JSON.stringify(membership.value));
}

// ── Sign-up modal ──────────────────────────────────────────────────────────
const signupModal = reactive({ open: false, step: 1, plan: null, isRejoin: false });
const billingForm = reactive({ name: '', card: '', expiry: '', cvv: '' });

function startSignup(planId, isRejoin = false) {
  if (!user.value) {
    if (planId) sessionStorage.setItem('no1_pending_plan', planId);
    router.push('/login');
    return;
  }
  signupModal.plan = planId;
  signupModal.isRejoin = isRejoin;
  signupModal.step = planId ? 2 : 1;
  billingForm.name = '';
  billingForm.card = '';
  billingForm.expiry = '';
  billingForm.cvv = '';
  signupModal.open = true;
}

function activateMembership() {
  const data = {
    plan: signupModal.plan,
    status: 'active',
    startDate: new Date().toISOString(),
    pausedUntil: null,
    freeMonth: signupModal.isRejoin,
  };
  membership.value = data;
  saveMembership();
  signupModal.step = 3;
}

function formatCard(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 16);
  billingForm.card = v.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(e) {
  let v = e.target.value.replace(/\D/g, '').slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  billingForm.expiry = v;
}

// ── Manage modal ───────────────────────────────────────────────────────────
const manageModal = reactive({ open: false, step: 'main' });
const pauseMonths = ref(1);
const upgradeTarget = ref(null);

const upgradablePlans = computed(() => {
  const order = ['basic', 'pro', 'elite'];
  const current = order.indexOf(membership.value?.plan);
  return plans.filter((_, i) => i > current);
});

function openManage() {
  manageModal.step = 'main';
  upgradeTarget.value = null;
  pauseMonths.value = 1;
  manageModal.open = true;
}

function confirmUpgrade() {
  membership.value.plan = upgradeTarget.value;
  saveMembership();
  upgradeTarget.value = null;
  manageModal.step = 'upgraded';
}

function confirmPause() {
  const until = new Date();
  until.setMonth(until.getMonth() + pauseMonths.value);
  membership.value.status = 'paused';
  membership.value.pausedUntil = until.toISOString();
  saveMembership();
  manageModal.step = 'paused';
}

function resumePlan() {
  membership.value.status = 'active';
  membership.value.pausedUntil = null;
  saveMembership();
  manageModal.open = false;
}

function acceptWinback() {
  membership.value.freeMonth = true;
  saveMembership();
  manageModal.step = 'winback-accepted';
}

function confirmCancel() {
  membership.value.status = 'cancelled';
  saveMembership();
  manageModal.step = 'cancelled';
}

// ── Add-ons modal ──────────────────────────────────────────────────────────
const addonsModal = ref(false);

const addonDiscount = computed(() => {
  const discounts = { basic: 10, pro: 20, elite: 30 };
  return discounts[membership.value?.plan] ?? 10;
});

function memberAddonPrice(addon) {
  const discounted = Math.round(addon.originalNum * (1 - addonDiscount.value / 100));
  return `$${discounted}`;
}

function bookAddon(addon) {
  addonsModal.value = false;
  router.push('/vehicles');
}

// ── Booking ────────────────────────────────────────────────────────────────
function bookService() {
  router.push('/vehicles');
}

// ── Helpers ────────────────────────────────────────────────────────────────
function planLabel(id) {
  return plans.find(p => p.id === id)?.label ?? id;
}

function planEmoji(id) {
  return plans.find(p => p.id === id)?.emoji ?? '';
}

function planPrice(id) {
  return plans.find(p => p.id === id)?.price ?? '';
}

function planFeatures(id) {
  return plans.find(p => p.id === id)?.features ?? [];
}

function planPriceDiff(fromId, toId) {
  const from = plans.find(p => p.id === fromId)?.priceNum ?? 0;
  const to = plans.find(p => p.id === toId)?.priceNum ?? 0;
  return `$${to - from}`;
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function pauseResumeDate() {
  const d = new Date();
  d.setMonth(d.getMonth() + pauseMonths.value);
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

function nextChargeDate(skip = false) {
  const d = new Date();
  d.setMonth(d.getMonth() + (skip ? 2 : 1));
  return d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' });
}

const plansSection = ref(null);
function scrollToPlans() {
  plansSection.value?.scrollIntoView({ behavior: 'smooth' });
}

// ── On mount: handle redirect-back after login ─────────────────────────────
onMounted(() => {
  const pending = sessionStorage.getItem('no1_pending_plan');
  if (pending && user.value) {
    sessionStorage.removeItem('no1_pending_plan');
    startSignup(pending);
  }
});
</script>

<style scoped>
.membership {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
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
  letter-spacing: 0.03em;
}
.member-badge.active {
  background: #d1fae5;
  color: #065f46;
}
.member-badge.paused {
  background: #fef3c7;
  color: #92400e;
}

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
.action-icon {
  font-size: 2.2rem;
  display: block;
  margin-bottom: 12px;
}
.action-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 6px;
}
.action-card p {
  color: #666;
  font-size: 0.88rem;
  margin: 0;
}

/* ── Current plan card ───────────────────────── */
.current-plan-section {
  margin-bottom: 60px;
}
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
.current-plan-card.basic { border-color: #6b7280; }
.current-plan-card.pro   { border-color: #007BFF; }
.current-plan-card.elite { border-color: #8b5cf6; }

.cplan-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}
.cplan-identity {
  display: flex;
  align-items: center;
  gap: 16px;
}
.cplan-emoji {
  font-size: 2.4rem;
}
.cplan-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1a1a1a;
}
.cplan-price {
  font-size: 1.6rem;
  font-weight: 700;
  color: #007BFF;
}
.cplan-price span {
  font-size: 0.9rem;
  color: #888;
  font-weight: 400;
}
.cplan-since {
  font-size: 0.85rem;
  color: #888;
}
.cplan-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 8px 24px;
}
.cplan-features li {
  font-size: 0.92rem;
  color: #444;
  padding: 4px 0;
}
.cplan-features li::before { content: ''; }
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

/* ── Re-join banner ──────────────────────────── */
.rejoin-section {
  margin-bottom: 50px;
  text-align: center;
}
.rejoin-card {
  display: inline-block;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 16px;
  padding: 40px 48px;
  color: white;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(30,64,175,0.25);
}
.rejoin-emoji {
  font-size: 3rem;
  display: block;
  margin-bottom: 14px;
}
.rejoin-card h3 {
  font-size: 1.4rem;
  font-weight: 800;
  margin-bottom: 10px;
  color: white;
}
.rejoin-card p {
  font-size: 1rem;
  opacity: 0.9;
  margin-bottom: 22px;
}

/* ── Plans ───────────────────────────────────── */
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

/* ── Comparison Table ────────────────────────── */
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
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
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

/* ── FAQ ─────────────────────────────────────── */
.faq { margin-bottom: 70px; }
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
.faq-item h3 { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; }
.faq-item p { color: #555; font-size: 0.92rem; line-height: 1.6; margin: 0; }

/* ── CTA ─────────────────────────────────────── */
.cta {
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  border-radius: 14px;
  padding: 56px 30px;
  text-align: center;
  color: white;
}
.cta h2 { font-size: 2rem; font-weight: 800; color: white; margin-bottom: 10px; }
.cta p { font-size: 1.05rem; opacity: 0.88; margin-bottom: 28px; }
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
.btn-cta:hover { background: #e0ecff; }

/* ═══════════════════════════════════════════════
   MODALS
═══════════════════════════════════════════════ */
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
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.modal-wide { max-width: 640px; }
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

/* Progress */
.modal-progress {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 6px;
}
.progress-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: background 0.2s;
}
.progress-dot.active { background: #007BFF; }
.progress-dot.done   { background: #22c55e; }
.progress-labels {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 24px;
}
.progress-labels span {
  font-size: 0.78rem;
  color: #aaa;
  font-weight: 500;
}
.progress-labels span.active { color: #007BFF; }

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

/* Plan selector in modal */
.modal-plan-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; }
.modal-plan-opt {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  position: relative;
}
.modal-plan-opt:hover { border-color: #007BFF; background: #f0f7ff; }
.modal-plan-opt.selected { border-color: #007BFF; background: #f0f7ff; }
.opt-emoji { font-size: 1.6rem; }
.opt-info { flex: 1; }
.opt-info strong { display: block; font-size: 1rem; color: #1a1a1a; }
.opt-info small { color: #888; font-size: 0.82rem; }
.opt-price { font-size: 1rem; font-weight: 700; color: #007BFF; }
.opt-check {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: #007BFF;
  color: white;
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

/* Billing form */
.billing-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.85rem; font-weight: 600; color: #444; }
.form-group input {
  padding: 11px 14px;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s;
}
.form-group input:focus { border-color: #007BFF; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.secure-note { font-size: 0.8rem; color: #888; text-align: center; margin: -4px 0; }

/* Confirmation step */
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
.modal-confirm h2 { font-size: 1.6rem; margin-bottom: 10px; }
.modal-confirm p { color: #555; line-height: 1.6; }
.confirm-details {
  background: #f9fafb;
  border-radius: 10px;
  padding: 16px 20px;
  margin: 18px 0;
  text-align: left;
}
.confirm-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.92rem;
  color: #555;
}
.confirm-row:not(:last-child) { border-bottom: 1px solid #e5e7eb; }
.confirm-row strong { color: #1a1a1a; }
.confirm-email { font-size: 0.85rem; color: #888; margin-top: 8px; }

/* Manage modal */
.manage-options { display: flex; flex-direction: column; gap: 12px; }
.manage-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px 20px;
  border-radius: 10px;
  border: 1.5px solid;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 700;
  transition: filter 0.15s;
  text-align: left;
  gap: 2px;
}
.manage-btn span { font-size: 1.1rem; margin-bottom: 2px; }
.manage-btn small { font-size: 0.8rem; font-weight: 400; opacity: 0.7; }
.manage-btn:hover { filter: brightness(0.95); }
.upgrade-btn { background: #f0fdf4; border-color: #22c55e; color: #166534; }
.pause-btn   { background: #fffbeb; border-color: #f59e0b; color: #92400e; }
.resume-btn  { background: #eff6ff; border-color: #3b82f6; color: #1e40af; }
.cancel-btn  { background: #fff1f2; border-color: #f43f5e; color: #be123c; }

/* Upgrade options */
.upgrade-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 22px; }
.upgrade-opt {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  position: relative;
}
.upgrade-opt:hover { border-color: #007BFF; background: #f0f7ff; }
.upgrade-opt.selected { border-color: #007BFF; background: #f0f7ff; }
.opt-right { display: flex; flex-direction: column; align-items: flex-end; }
.opt-diff { font-size: 0.78rem; color: #888; }

/* Pause selector */
.pause-selector { margin-bottom: 24px; }
.pause-selector label { font-size: 0.88rem; font-weight: 600; color: #444; display: block; margin-bottom: 12px; }
.pause-options { display: flex; gap: 12px; margin-bottom: 14px; }
.pause-opt {
  flex: 1;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: border-color 0.15s, background 0.15s;
}
.pause-opt:hover { border-color: #007BFF; }
.pause-opt.selected { border-color: #007BFF; background: #f0f7ff; color: #1e40af; }
.pause-info { font-size: 0.85rem; color: #666; }

/* Win-back */
.winback-step { text-align: center; }
.winback-sad { font-size: 3rem; margin-bottom: 16px; }
.winback-step h2 { margin-bottom: 10px; }
.winback-step > p { color: #555; margin-bottom: 20px; }
.winback-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fef3c7;
  border: 1.5px solid #f59e0b;
  border-radius: 12px;
  padding: 18px 20px;
  text-align: left;
  margin-bottom: 22px;
}
.winback-gift { font-size: 2rem; flex-shrink: 0; }
.winback-card strong { display: block; font-size: 1rem; color: #92400e; margin-bottom: 4px; }
.winback-card p { margin: 0; font-size: 0.88rem; color: #78350f; }
.btn-cancel-link {
  background: none;
  border: none;
  cursor: pointer;
  color: #888;
  font-size: 0.85rem;
  text-decoration: underline;
  margin-top: 14px;
  display: block;
  width: 100%;
}
.btn-cancel-link:hover { color: #dc2626; }

/* Shared button styles */
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

/* ── Add-ons ─────────────────────────────────── */
.addons-list { display: flex; flex-direction: column; gap: 14px; margin-top: 4px; }
.addon-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f0f0;
}
.addon-item:last-child { border-bottom: none; }
.addon-icon { font-size: 1.8rem; flex-shrink: 0; }
.addon-info { flex: 1; }
.addon-info strong { display: block; font-size: 0.95rem; color: #1a1a1a; margin-bottom: 2px; }
.addon-info p { margin: 0; font-size: 0.82rem; color: #888; }
.addon-pricing { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
.addon-original { font-size: 0.78rem; color: #aaa; text-decoration: line-through; }
.addon-member { font-size: 1rem; font-weight: 700; color: #007BFF; }
.addon-book-btn {
  background: #007BFF;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}
.addon-book-btn:hover { background: #0056b3; }

/* ── Responsive ──────────────────────────────── */
@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .plan-grid { grid-template-columns: 1fr; }
  .faq-list { grid-template-columns: 1fr; }
  .benefits-grid { grid-template-columns: 1fr; }
  .member-actions { grid-template-columns: 1fr; }
  .cplan-top { flex-direction: column; align-items: flex-start; }
  .modal { padding: 28px 22px; }
  .form-row { grid-template-columns: 1fr; }
}
</style>
