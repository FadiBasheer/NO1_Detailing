<template>
  <div class="my-bookings-page">
    <div class="page-header">
      <h1>My Bookings</h1>
    </div>

    <div v-if="loading" class="state-msg">Loading your bookings…</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <div v-else-if="bookings.length === 0" class="empty-state">
      <p>You have no bookings yet.</p>
      <router-link to="/vehicles" class="btn-book">Book Now</router-link>
    </div>

    <div v-else class="bookings-list">
      <!-- Upcoming -->
      <section v-if="upcoming.length">
        <h2 class="section-title">Upcoming</h2>
        <div class="card" v-for="b in upcoming" :key="b.id">
          <BookingCard :booking="b" />
        </div>
      </section>

      <!-- Past -->
      <section v-if="past.length">
        <h2 class="section-title past-title">Past</h2>
        <div class="card past" v-for="b in past" :key="b.id">
          <BookingCard :booking="b" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue';
import axios from '../axios';

interface Service { serviceId: string; name: string; price: number }
interface Addon   { addonId: string;   name: string; price: number }

interface Booking {
  id: string;
  date: string;
  endTime: string;
  address: string;
  status: string;
  vehicle: { type: string; brand?: string; model?: string };
  services: Service[];
  addons: Addon[];
}

// ── Inline BookingCard component ───────────────────────────────────────────────
const BookingCard = defineComponent({
  props: { booking: { type: Object as () => Booking, required: true } },
  setup(props) {
    function formatDate(iso: string) {
      return new Date(iso).toLocaleDateString('en-CA', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    }
    function formatTime(iso: string) {
      return new Date(iso).toLocaleTimeString('en-CA', {
        hour: '2-digit', minute: '2-digit', hour12: true,
      });
    }
    function total(b: Booking) {
      return ([...b.services, ...b.addons] as any[]).reduce((s, x) => s + x.price, 0).toFixed(2);
    }
    function statusClass(status: string) {
      const map: Record<string, string> = {
        PENDING: 'badge-pending',
        CONFIRMED: 'badge-confirmed',
        COMPLETED: 'badge-completed',
        CANCELLED: 'badge-cancelled',
      };
      return map[status] ?? '';
    }
    function statusLabel(status: string) {
      const map: Record<string, string> = {
        PENDING: 'Pending', CONFIRMED: 'Confirmed',
        COMPLETED: 'Completed', CANCELLED: 'Cancelled',
      };
      return map[status] ?? status;
    }

    return () => {
      const b = props.booking;
      return h('div', { class: 'card-inner' }, [
        h('div', { class: 'card-top' }, [
          h('div', { class: 'card-date' }, [
            h('span', { class: 'date-main' }, formatDate(b.date)),
            h('span', { class: 'date-time' }, `${formatTime(b.date)} – ${formatTime(b.endTime)}`),
          ]),
          h('span', { class: `badge ${statusClass(b.status)}` }, statusLabel(b.status)),
        ]),
        h('div', { class: 'card-body' }, [
          h('div', { class: 'card-row' }, [
            h('span', { class: 'label' }, 'Vehicle'),
            h('span', [
              b.vehicle.type,
              (b.vehicle.brand ? ` · ${b.vehicle.brand} ${b.vehicle.model ?? ''}` : ''),
            ]),
          ]),
          h('div', { class: 'card-row' }, [
            h('span', { class: 'label' }, 'Address'),
            h('span', b.address),
          ]),
          h('div', { class: 'card-row' }, [
            h('span', { class: 'label' }, 'Services'),
            h('div', { class: 'tags' }, [
              ...b.services.map(s => h('span', { class: 'tag' }, s.name)),
              ...b.addons.map(a => h('span', { class: 'tag addon' }, a.name)),
            ]),
          ]),
          h('div', { class: 'card-row total-row' }, [
            h('span', { class: 'label' }, 'Total'),
            h('span', { class: 'total' }, `$${total(b)}`),
          ]),
        ]),
      ]);
    };
  },
});

// ── Page logic ─────────────────────────────────────────────────────────────────
const bookings = ref<Booking[]>([]);
const loading  = ref(true);
const error    = ref('');

const now = new Date();

const upcoming = computed(() =>
  bookings.value.filter(b => new Date(b.date) >= now && b.status !== 'CANCELLED')
);

const past = computed(() =>
  bookings.value.filter(b => new Date(b.date) < now || b.status === 'CANCELLED')
);

onMounted(async () => {
  try {
    const res = await axios.get('/api/bookings/my');
    bookings.value = res.data;
  } catch {
    error.value = 'Failed to load your bookings.';
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.my-bookings-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
  font-family: system-ui, sans-serif;
  color: #1a1a2e;
}

.page-header {
  margin-bottom: 1.75rem;
}

.page-header h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0;
}

/* ── Sections ───────────────────────────────────────────────────────────────── */
.section-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin: 1.75rem 0 0.75rem;
}

.past-title { color: #9ca3af; }

/* ── Card ───────────────────────────────────────────────────────────────────── */
.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
  overflow: hidden;
}

.card.past { opacity: 0.72; }

/* rendered by BookingCard */
:deep(.card-inner) { padding: 1.25rem 1.5rem; }

:deep(.card-top) {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

:deep(.card-date) { display: flex; flex-direction: column; gap: 0.2rem; }
:deep(.date-main) { font-weight: 600; font-size: 0.95rem; }
:deep(.date-time) { font-size: 0.82rem; color: #6b7280; }

:deep(.card-body) { display: flex; flex-direction: column; gap: 0.55rem; }

:deep(.card-row) {
  display: flex;
  gap: 0.75rem;
  font-size: 0.875rem;
  align-items: flex-start;
}

:deep(.label) {
  min-width: 70px;
  font-weight: 600;
  color: #6b7280;
  font-size: 0.8rem;
  padding-top: 0.1rem;
}

:deep(.total-row) { margin-top: 0.25rem; }
:deep(.total) { font-weight: 700; font-size: 1rem; }

/* ── Tags ───────────────────────────────────────────────────────────────────── */
:deep(.tags) { display: flex; flex-wrap: wrap; gap: 0.3rem; }

:deep(.tag) {
  background: #ede9fe;
  color: #5b21b6;
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.2rem 0.55rem;
  border-radius: 99px;
}

:deep(.tag.addon) { background: #fef3c7; color: #92400e; }

/* ── Status badge ───────────────────────────────────────────────────────────── */
:deep(.badge) {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 99px;
  white-space: nowrap;
}

:deep(.badge-pending)   { background: #fef9c3; color: #854d0e; }
:deep(.badge-confirmed) { background: #dcfce7; color: #166534; }
:deep(.badge-completed) { background: #dbeafe; color: #1e40af; }
:deep(.badge-cancelled) { background: #fee2e2; color: #991b1b; }

/* ── Empty / state ──────────────────────────────────────────────────────────── */
.state-msg {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

.state-msg.error { color: #dc2626; }

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #6b7280;
}

.empty-state p { margin-bottom: 1.25rem; font-size: 1rem; }

.btn-book {
  display: inline-block;
  background: #6c63ff;
  color: #fff;
  padding: 0.6rem 1.4rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  font-size: 0.9rem;
}

.btn-book:hover { opacity: 0.88; }
</style>
