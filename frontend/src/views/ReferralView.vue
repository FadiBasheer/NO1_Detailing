<template>
  <div class="referral-dashboard">
    <h1>Refer a Friend</h1>
    <p class="subtitle">Share your unique link. Your friend gets 10% off their first booking.</p>

    <div v-if="!canRefer" class="locked-card">
      <div class="lock-icon">🔒</div>
      <h2>Complete a booking first</h2>
      <p>You'll unlock your referral link after your first completed service.</p>
      <router-link to="/vehicles" class="btn-book">Book Now</router-link>
    </div>

    <template v-else>
      <p v-if="loadError" style="color:red;margin-bottom:12px;">{{ loadError }}</p>

      <!-- Referral link card -->
      <div class="link-card">
        <h2>Your Referral Link</h2>
        <p class="link-desc">Share this link with friends. They get 10% off, you help them discover Yumeeco.</p>
        <div class="link-row">
          <input :value="referralLink" readonly class="link-input" />
          <button @click="copyLink" class="btn-copy">{{ copied ? 'Copied!' : 'Copy' }}</button>
        </div>
        <div class="share-row">
          <button @click="shareLink" class="btn-share">Share Link</button>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-number">{{ stats.totalReferrals }}</div>
          <div class="stat-label">Friends Referred</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ stats.usedReferrals }}</div>
          <div class="stat-label">Discounts Used</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth.ts';
import axios from '../axios.ts';

const auth = useAuthStore();
const copied = ref(false);
const stats = ref({ totalReferrals: 0, usedReferrals: 0 });
const fetchedReferralCode = ref(auth.user?.referralCode ?? '');
const loadError = ref('');

const canRefer = computed(() => (auth.user?.completedBookingsCount ?? 0) >= 1);

const referralLink = computed(() => {
  if (!fetchedReferralCode.value) return '';
  return `${window.location.origin}/ref/${fetchedReferralCode.value}`;
});

onMounted(async () => {
  if (canRefer.value) {
    try {
      const res = await axios.get('/api/referral/my-info');
      fetchedReferralCode.value = res.data.referralCode ?? '';
      stats.value = { totalReferrals: res.data.totalReferrals, usedReferrals: res.data.usedReferrals };
    } catch (err) {
      loadError.value = err?.response?.data?.message ?? 'Failed to load referral info.';
    }
  }
});

const copyLink = async () => {
  if (!referralLink.value) return;
  await navigator.clipboard.writeText(referralLink.value);
  copied.value = true;
  setTimeout(() => { copied.value = false; }, 2000);
};

const shareLink = () => {
  if (navigator.share) {
    navigator.share({
      title: 'Get 10% off your first car detail!',
      text: "I've been using Yumeeco — mobile car detailing that comes to you. Use my link and get 10% off your first booking.",
      url: referralLink.value,
    });
  } else {
    copyLink();
  }
};
</script>

<style scoped>
.referral-dashboard {
  max-width: 640px;
  margin: 0 auto;
  padding: 48px 20px 60px;
}

h1 {
  font-size: 2rem;
  font-weight: 900;
  color: #111827;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 1rem;
  color: #6b7280;
  margin-bottom: 36px;
}

/* Locked state */
.locked-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
}

.lock-icon {
  font-size: 2.8rem;
  margin-bottom: 16px;
}

.locked-card h2 {
  font-size: 1.3rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 10px;
}

.locked-card p {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 28px;
}

.btn-book {
  display: inline-block;
  background: #111827;
  color: white;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.95rem;
  transition: background 0.2s;
}

.btn-book:hover {
  background: #374151;
}

/* Link card */
.link-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}

.link-card h2 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
}

.link-desc {
  font-size: 0.9rem;
  color: #6b7280;
  margin-bottom: 20px;
}

.link-row {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.link-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #374151;
  background: #f9fafb;
  outline: none;
}

.btn-copy {
  padding: 10px 22px;
  background: #065f46;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-copy:hover {
  background: #047857;
}

.share-row {
  display: flex;
  justify-content: flex-end;
}

.btn-share {
  padding: 9px 20px;
  background: transparent;
  color: #065f46;
  border: 1.5px solid #065f46;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  font-size: 0.88rem;
  transition: background 0.2s, color 0.2s;
}

.btn-share:hover {
  background: #065f46;
  color: white;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.stat-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 28px 20px;
  text-align: center;
}

.stat-number {
  font-size: 2.4rem;
  font-weight: 900;
  color: #065f46;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 0.88rem;
  color: #6b7280;
  font-weight: 600;
}

@media (max-width: 480px) {
  .link-row {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
