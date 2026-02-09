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
          <BookingCard :booking="b" :cancel-fn="cancelBooking" :edit-fn="openEdit" />
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

    <!-- Edit Modal -->
    <div v-if="editingBooking" class="modal-overlay" @click.self="closeEdit">
      <div class="modal">
        <div class="modal-header">
          <h2>Edit Booking</h2>
          <button class="modal-close" @click="closeEdit">✕</button>
        </div>

        <div class="modal-body">
          <!-- Date -->
          <div class="form-group">
            <label>Date</label>
            <input type="date" v-model="editForm.date" :min="todayDate" @change="onEditDateChange" />
          </div>

          <!-- Time -->
          <div class="form-group">
            <label>Time</label>
            <select v-model="editForm.time" :disabled="!editForm.date || loadingSlots">
              <option value="">{{ loadingSlots ? 'Loading slots…' : '-- Select a time --' }}</option>
              <option v-for="slot in availableSlots" :key="slot.time" :value="slot.time">
                {{ formatTime(slot.time) }}
              </option>
            </select>
            <p v-if="editForm.date && !loadingSlots && availableSlots.length === 0" class="field-hint error-hint">
              No available slots on this date.
            </p>
          </div>

          <!-- Address -->
          <div class="form-group">
            <label>Address</label>
            <input
              type="text"
              ref="editAddressInput"
              v-model="editForm.address"
              placeholder="Service address"
              autocomplete="off"
            />
          </div>

          <!-- Notes -->
          <div class="form-group">
            <label>Special Instructions <span class="optional">(optional)</span></label>
            <textarea v-model="editForm.notes" rows="3" placeholder="Any notes for the detailer…"></textarea>
          </div>

          <p class="rebook-hint">Need to change your service or add a vehicle? Please cancel this booking and start over.</p>

          <p v-if="editError" class="edit-error">{{ editError }}</p>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" @click="closeEdit">Cancel</button>
          <button class="btn-save" @click="saveEdit" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, defineComponent, h, type PropType } from 'vue';
import { useRouter } from 'vue-router';
import axios from '../axios';

interface Service { serviceId: string; name: string; price: number; durationMinutes: number }
interface Addon   { addonId: string;   name: string; price: number; durationMinutes: number }

interface Booking {
  id: string;
  date: string;
  endTime: string;
  address: string;
  notes?: string;
  status: string;
  vehicle: { type: string; brand?: string; model?: string };
  services: Service[];
  addons: Addon[];
}

// ── Inline BookingCard component ───────────────────────────────────────────────
const BookingCard = defineComponent({
  props: {
    booking:   { type: Object as () => Booking, required: true },
    cancelFn:  { type: Function as PropType<(id: string) => void>, default: undefined },
    editFn:    { type: Function as PropType<(b: Booking) => void>, default: undefined },
    payFn:     { type: Function as PropType<(b: Booking) => void>, default: undefined },
    payingId:  { type: String as PropType<string | null>, default: null },
  },
  setup(props) {
    function formatDate(iso: string) {
      return new Date(iso).toLocaleDateString('en-CA', {
        timeZone: 'UTC', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    }
    function formatTime(iso: string) {
      return new Date(iso).toLocaleTimeString('en-CA', {
        timeZone: 'UTC', hour: '2-digit', minute: '2-digit', hour12: true,
      });
    }
    function total(b: Booking) {
      return ([...b.services, ...b.addons] as any[]).reduce((s, x) => s + x.price, 0).toFixed(2);
    }
    function statusClass(s: string) {
      return { PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed', COMPLETED: 'badge-completed', CANCELLED: 'badge-cancelled' }[s] ?? '';
    }
    function statusLabel(s: string) {
      return { PENDING: 'Pending', CONFIRMED: 'Confirmed', COMPLETED: 'Completed', CANCELLED: 'Cancelled' }[s] ?? s;
    }

    return () => {
      const b = props.booking;
      const canPay    = !!props.payFn    && b.status === 'PENDING';
      const canCancel = !!props.cancelFn && b.status === 'PENDING';
      const canEdit   = !!props.editFn   && (b.status === 'CONFIRMED' || b.status === 'PENDING');

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
            h('span', [ b.vehicle.type, (b.vehicle.brand ? ` · ${b.vehicle.brand} ${b.vehicle.model ?? ''}` : '') ]),
          ]),
          h('div', { class: 'card-row' }, [
            h('span', { class: 'label' }, 'Address'),
            h('span', b.address),
          ]),
          b.notes ? h('div', { class: 'card-row' }, [
            h('span', { class: 'label' }, 'Notes'),
            h('span', b.notes),
          ]) : null,
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
        (canEdit || canCancel)
          ? h('div', { class: 'card-footer' }, [
              canEdit   ? h('button', { class: 'btn-edit',   onClick: () => props.editFn!(b) },   'Edit Booking')   : null,
              canCancel ? h('button', { class: 'btn-cancel', onClick: () => props.cancelFn!(b.id) }, 'Cancel Booking') : null,
            ])
          : null,
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

const todayDate = computed(() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
});

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

async function cancelBooking(id: string) {
  if (!confirm('Are you sure you want to cancel this booking?')) return;
  try {
    const booking = bookings.value.find(b => b.id === id);
    await axios.patch(`/api/bookings/${id}/cancel`);
    if (booking?.status === 'PENDING') {
      bookings.value = bookings.value.filter(b => b.id !== id);
    } else {
      const idx = bookings.value.findIndex(b => b.id === id);
      if (idx !== -1) bookings.value[idx] = { ...bookings.value[idx], status: 'CANCELLED' };
    }
  } catch (err: any) {
    alert(err.response?.data?.message ?? 'Could not cancel booking. Please try again.');
  }
}

// ── Edit modal ─────────────────────────────────────────────────────────────────
const editingBooking  = ref<Booking | null>(null);
const editAddressInput = ref<HTMLInputElement | null>(null);
const availableSlots  = ref<{ time: string }[]>([]);
const loadingSlots    = ref(false);
const saving          = ref(false);
const editError       = ref('');
let   autocomplete: any = null;

const editForm = ref({ date: '', time: '', address: '', notes: '' });

function formatTime(t: string) {
  // t is "HH:MM" — format as 12-hour without timezone conversion
  const [h, m] = t.split(':');
  let hour = parseInt(h);
  const period = hour < 12 ? 'AM' : 'PM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${period}`;
}

function toDateString(iso: string) {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}

function toTimeString(iso: string) {
  const d = new Date(iso);
  return `${String(d.getUTCHours()).padStart(2,'0')}:${String(d.getUTCMinutes()).padStart(2,'0')}`;
}

async function openEdit(b: Booking) {
  editingBooking.value = b;
  editForm.value = {
    date:    toDateString(b.date),
    time:    toTimeString(b.date),
    address: b.address,
    notes:   b.notes ?? '',
  };
  editError.value = '';
  await fetchSlots(editForm.value.date);

  // Set up Google Maps autocomplete after the modal renders
  await nextTick();
  const win = window as any;
  if (win.google?.maps?.places && editAddressInput.value) {
    autocomplete = new win.google.maps.places.Autocomplete(editAddressInput.value, {
      componentRestrictions: { country: 'ca' },
      fields: ['formatted_address'],
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place?.formatted_address) editForm.value.address = place.formatted_address;
    });
  }
}

function closeEdit() {
  editingBooking.value = null;
  autocomplete = null;
  availableSlots.value = [];
}

async function onEditDateChange() {
  editForm.value.time = '';
  await fetchSlots(editForm.value.date);
}

async function fetchSlots(date: string) {
  if (!date || !editingBooking.value) return;
  loadingSlots.value = true;
  try {
    const duration = [
      ...editingBooking.value.services.map(s => s.durationMinutes),
      ...editingBooking.value.addons.map(a => a.durationMinutes),
    ].reduce((a, b) => a + b, 0);

    const res = await axios.get('/api/available-times', { params: { date, duration } });
    availableSlots.value = res.data.availableSlots;
  } catch {
    availableSlots.value = [];
  } finally {
    loadingSlots.value = false;
  }
}

async function saveEdit() {
  if (!editingBooking.value) return;
  if (!editForm.value.date || !editForm.value.time) {
    editError.value = 'Please select a date and time.';
    return;
  }
  saving.value   = true;
  editError.value = '';
  try {
    const res = await axios.patch(`/api/bookings/${editingBooking.value.id}`, {
      date:    editForm.value.date,
      time:    editForm.value.time,
      address: editForm.value.address,
      notes:   editForm.value.notes,
    });
    const updated = res.data.booking;
    const idx = bookings.value.findIndex(b => b.id === updated.id);
    if (idx !== -1) {
      bookings.value[idx] = {
        ...bookings.value[idx],
        date:    updated.date,
        endTime: updated.endTime,
        address: updated.address,
        notes:   updated.notes,
      };
    }
    closeEdit();
  } catch (err: any) {
    editError.value = err.response?.data?.message ?? 'Could not save changes. Please try again.';
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.my-bookings-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.25rem 4rem;
  font-family: system-ui, sans-serif;
  color: #1a1a2e;
}

.page-header { margin-bottom: 1.75rem; }
.page-header h1 { font-size: 1.6rem; font-weight: 700; margin: 0; }

.section-title {
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin: 1.75rem 0 0.75rem;
}
.past-title { color: #9ca3af; }

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  margin-bottom: 1rem;
  overflow: hidden;
}
.card.past { opacity: 0.72; }

:deep(.card-inner) { padding: 1.25rem 1.5rem; }
:deep(.card-top) { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; }
:deep(.card-date) { display: flex; flex-direction: column; gap: 0.2rem; }
:deep(.date-main) { font-weight: 600; font-size: 0.95rem; }
:deep(.date-time) { font-size: 0.82rem; color: #6b7280; }
:deep(.card-body) { display: flex; flex-direction: column; gap: 0.55rem; }
:deep(.card-row) { display: flex; gap: 0.75rem; font-size: 0.875rem; align-items: flex-start; }
:deep(.label) { min-width: 70px; font-weight: 600; color: #6b7280; font-size: 0.8rem; padding-top: 0.1rem; }
:deep(.total-row) { margin-top: 0.25rem; }
:deep(.total) { font-weight: 700; font-size: 1rem; }
:deep(.tags) { display: flex; flex-wrap: wrap; gap: 0.3rem; }
:deep(.tag) { background: #ede9fe; color: #5b21b6; font-size: 0.72rem; font-weight: 500; padding: 0.2rem 0.55rem; border-radius: 99px; }
:deep(.tag.addon) { background: #fef3c7; color: #92400e; }

:deep(.badge) { font-size: 0.72rem; font-weight: 600; padding: 0.25rem 0.65rem; border-radius: 99px; white-space: nowrap; }
:deep(.badge-pending)   { background: #fef9c3; color: #854d0e; }
:deep(.badge-confirmed) { background: #dcfce7; color: #166534; }
:deep(.badge-completed) { background: #dbeafe; color: #1e40af; }
:deep(.badge-cancelled) { background: #fee2e2; color: #991b1b; }

:deep(.card-footer) {
  padding: 0.75rem 1.5rem 1.25rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

:deep(.btn-edit) {
  background: none;
  border: 1px solid #93c5fd;
  color: #1e40af;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
:deep(.btn-edit:hover) { background: #eff6ff; }

:deep(.btn-cancel) {
  background: none;
  border: 1px solid #fca5a5;
  color: #dc2626;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
:deep(.btn-cancel:hover) { background: #fee2e2; }

/* ── Edit Modal ─────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem 0;
}

.modal-header h2 { font-size: 1.1rem; font-weight: 700; margin: 0; }

.modal-close {
  background: none;
  border: none;
  font-size: 1rem;
  color: #6b7280;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.modal-close:hover { background: #f3f4f6; }

.modal-body { padding: 1.25rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }

.form-group { display: flex; flex-direction: column; gap: 0.35rem; }

.form-group label { font-size: 0.85rem; font-weight: 600; color: #374151; }

.form-group input,
.form-group select,
.form-group textarea {
  padding: 9px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #111827;
  background: #f9fafb;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
  width: 100%;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1e40af;
  background: white;
}

.form-group textarea { resize: vertical; }

.optional { font-weight: 400; color: #9ca3af; font-size: 0.78rem; }

.field-hint { font-size: 0.78rem; color: #9ca3af; margin: 0; }
.error-hint { color: #dc2626; }

.rebook-hint {
  font-size: 0.83rem;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0;
}

.edit-error {
  color: #dc2626;
  font-size: 0.85rem;
  background: #fef2f2;
  border: 1px solid #fca5a5;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 0;
}

.modal-footer {
  padding: 0 1.5rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-secondary {
  background: none;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary:hover { background: #f3f4f6; }

.btn-save {
  background: #1e40af;
  color: white;
  border: none;
  padding: 0.5rem 1.4rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
}
.btn-save:hover:not(:disabled) { background: #1e3a8a; }
.btn-save:disabled { background: #9ca3af; cursor: not-allowed; }

/* ── Empty / state ──────────────────────────────────────────────────────────── */
.state-msg { text-align: center; padding: 3rem; color: #6b7280; }
.state-msg.error { color: #dc2626; }
.empty-state { text-align: center; padding: 4rem 1rem; color: #6b7280; }
.empty-state p { margin-bottom: 1.25rem; font-size: 1rem; }
.btn-book { display: inline-block; background: #6c63ff; color: #fff; padding: 0.6rem 1.4rem; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 0.9rem; }
.btn-book:hover { opacity: 0.88; }

@media (max-width: 480px) {
  .modal { border-radius: 12px; }
  .modal-footer { flex-direction: column-reverse; }
  .btn-secondary, .btn-save { width: 100%; text-align: center; }
}
</style>
