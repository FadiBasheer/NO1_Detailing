<template>
  <div class="admin-page">
    <header class="admin-header">
      <h1>Admin — Bookings</h1>
      <button class="btn btn-secondary" @click="logout">Logout</button>
    </header>

    <div class="admin-controls">
      <label class="date-label">
        Filter by date
        <input type="date" v-model="selectedDate" class="date-input" />
      </label>
      <button class="btn btn-ghost" @click="selectedDate = ''" :disabled="!selectedDate">
        Clear filter
      </button>
      <span class="booking-count">{{ filteredBookings.length }} booking{{ filteredBookings.length !== 1 ? 's' : '' }}</span>
    </div>

    <div v-if="loading" class="state-msg">Loading bookings…</div>
    <div v-else-if="error" class="state-msg error">{{ error }}</div>
    <div v-else-if="filteredBookings.length === 0" class="state-msg">No bookings found.</div>

    <div v-else class="table-wrapper">
      <table class="bookings-table">
        <thead>
          <tr>
            <th>Date & Time</th>
            <th>Customer</th>
            <th>Vehicle</th>
            <th>Services</th>
            <th>Address</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="booking in filteredBookings" :key="booking.id">
            <td class="td-datetime">
              <span class="date">{{ formatDate(booking.date) }}</span>
              <span class="time">{{ formatTime(booking.date) }} – {{ formatTime(booking.endTime) }}</span>
            </td>
            <td>{{ booking.customer.email }}</td>
            <td class="td-vehicle">
              <span>{{ booking.vehicle.type }}</span>
              <span v-if="booking.vehicle.brand" class="muted">{{ booking.vehicle.brand }} {{ booking.vehicle.model }}</span>
            </td>
            <td class="td-services">
              <span v-for="s in booking.services" :key="s.serviceId" class="tag">{{ s.name }}</span>
              <span v-for="a in booking.addons" :key="a.addonId" class="tag addon">{{ a.name }}</span>
            </td>
            <td class="td-address">{{ booking.address }}</td>
            <td class="td-total">${{ calcTotal(booking) }}</td>
            <td>
              <select
                class="status-select"
                :class="statusClass(booking.status)"
                :value="booking.status"
                :disabled="updatingId === booking.id"
                @change="updateStatus(booking, ($event.target as HTMLSelectElement).value)"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </td>
            <td>
              <button class="btn btn-sm" @click="openEdit(booking)">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingBooking" class="modal-overlay" @click.self="closeEdit">
      <div class="modal">
        <h2>Edit Booking</h2>
        <p class="modal-sub">{{ editingBooking.customer.email }} — {{ editingBooking.vehicle.type }}</p>

        <div class="form-group">
          <label>Date</label>
          <input type="date" v-model="editForm.date" class="form-input" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Start time</label>
            <input type="time" v-model="editForm.startTime" class="form-input" />
          </div>
          <div class="form-group">
            <label>End time</label>
            <input type="time" v-model="editForm.endTime" class="form-input" />
          </div>
        </div>
        <div class="form-group">
          <label>Address</label>
          <input type="text" v-model="editForm.address" class="form-input" />
        </div>

        <p v-if="editError" class="error-msg">{{ editError }}</p>

        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closeEdit">Cancel</button>
          <button class="btn btn-primary" :disabled="saving" @click="saveEdit">
            {{ saving ? 'Saving…' : 'Save changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import axios from '../../axios';

interface Service { serviceId: string; name: string; price: number; durationMinutes: number }
interface Addon   { addonId: string;   name: string; price: number; durationMinutes: number }

interface Booking {
  id: string;
  date: string;
  endTime: string;
  address: string;
  status: string;
  customer: { id: string; email: string };
  vehicle: { type: string; brand?: string; model?: string };
  services: Service[];
  addons: Addon[];
}

const router = useRouter();
const auth = useAuthStore();

const bookings   = ref<Booking[]>([]);
const loading    = ref(true);
const error      = ref('');
const selectedDate = ref('');
const updatingId = ref<string | null>(null);

const editingBooking = ref<Booking | null>(null);
const editForm = ref({ date: '', startTime: '', endTime: '', address: '' });
const saving   = ref(false);
const editError = ref('');

// ── Data fetching ──────────────────────────────────────────────────────────────

async function fetchBookings() {
  loading.value = true;
  error.value = '';
  try {
    const res = await axios.get('/api/admin/bookings');
    bookings.value = res.data.sort(
      (a: Booking, b: Booking) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch {
    error.value = 'Failed to load bookings.';
  } finally {
    loading.value = false;
  }
}

onMounted(fetchBookings);

// ── Filtering ──────────────────────────────────────────────────────────────────

const filteredBookings = computed(() => {
  if (!selectedDate.value) return bookings.value;
  return bookings.value.filter(b => {
    const bookingDate = new Date(b.date).toLocaleDateString('en-CA'); // YYYY-MM-DD
    return bookingDate === selectedDate.value;
  });
});

// ── Status update ──────────────────────────────────────────────────────────────

async function updateStatus(booking: Booking, newStatus: string) {
  if (newStatus === booking.status) return;
  updatingId.value = booking.id;
  try {
    const res = await axios.patch(`/api/admin/bookings/${booking.id}/status`, { status: newStatus });
    const idx = bookings.value.findIndex(b => b.id === booking.id);
    if (idx !== -1) bookings.value[idx] = res.data;
  } catch {
    error.value = 'Failed to update status.';
  } finally {
    updatingId.value = null;
  }
}

// ── Edit modal ─────────────────────────────────────────────────────────────────

function openEdit(booking: Booking) {
  editingBooking.value = booking;
  editError.value = '';
  const start = new Date(booking.date);
  const end   = new Date(booking.endTime);
  editForm.value = {
    date:      start.toLocaleDateString('en-CA'),
    startTime: toTimeString(start),
    endTime:   toTimeString(end),
    address:   booking.address,
  };
}

function closeEdit() {
  editingBooking.value = null;
}

async function saveEdit() {
  if (!editingBooking.value) return;
  editError.value = '';
  saving.value = true;
  try {
    const { date, startTime, endTime, address } = editForm.value;
    const newDate    = new Date(`${date}T${startTime}`).toISOString();
    const newEndTime = new Date(`${date}T${endTime}`).toISOString();

    const res = await axios.patch(`/api/admin/bookings/${editingBooking.value.id}`, {
      date: newDate,
      endTime: newEndTime,
      address,
    });

    const idx = bookings.value.findIndex(b => b.id === editingBooking.value!.id);
    if (idx !== -1) bookings.value[idx] = res.data;
    closeEdit();
  } catch {
    editError.value = 'Failed to save changes.';
  } finally {
    saving.value = false;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function toTimeString(d: Date) {
  return d.toTimeString().slice(0, 5); // HH:MM
}

function calcTotal(booking: Booking) {
  const s = booking.services.reduce((sum, x) => sum + x.price, 0);
  const a = booking.addons.reduce((sum, x) => sum + x.price, 0);
  return (s + a).toFixed(2);
}

function statusClass(status: string) {
  return {
    'status-pending':   status === 'PENDING',
    'status-confirmed': status === 'CONFIRMED',
    'status-completed': status === 'COMPLETED',
    'status-cancelled': status === 'CANCELLED',
  };
}

function logout() {
  auth.logout();
  router.push('/login');
}
</script>

<style scoped>
/* ── Layout ─────────────────────────────────────────────────────────────────── */
.admin-page {
  min-height: 100vh;
  background: #f4f5f7;
  font-family: system-ui, sans-serif;
  color: #1a1a2e;
}

.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: #1a1a2e;
  color: #fff;
}

.admin-header h1 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

/* ── Controls ───────────────────────────────────────────────────────────────── */
.admin-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem 2rem;
  background: #fff;
  border-bottom: 1px solid #e2e4e9;
}

.date-label {
  display: flex;
  flex-direction: column;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  gap: 0.25rem;
}

.date-input {
  padding: 0.4rem 0.6rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
}

.date-input:focus {
  border-color: #6c63ff;
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.15);
}

.booking-count {
  margin-left: auto;
  font-size: 0.85rem;
  color: #6b7280;
}

/* ── Table ──────────────────────────────────────────────────────────────────── */
.table-wrapper {
  padding: 1.5rem 2rem;
  overflow-x: auto;
}

.bookings-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  font-size: 0.875rem;
}

.bookings-table th {
  background: #f9fafb;
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-bottom: 1px solid #e5e7eb;
}

.bookings-table td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}

.bookings-table tr:last-child td {
  border-bottom: none;
}

.bookings-table tr:hover td {
  background: #fafafa;
}

.td-datetime {
  white-space: nowrap;
}

.td-datetime .date {
  display: block;
  font-weight: 500;
}

.td-datetime .time,
.td-vehicle .muted {
  display: block;
  color: #6b7280;
  font-size: 0.8rem;
}

.td-vehicle span {
  display: block;
}

.td-services {
  max-width: 180px;
}

.tag {
  display: inline-block;
  background: #ede9fe;
  color: #5b21b6;
  font-size: 0.72rem;
  font-weight: 500;
  padding: 0.2rem 0.5rem;
  border-radius: 99px;
  margin: 0.1rem 0.1rem 0.1rem 0;
}

.tag.addon {
  background: #fef3c7;
  color: #92400e;
}

.td-address {
  max-width: 200px;
  font-size: 0.8rem;
  color: #374151;
}

.td-total {
  font-weight: 600;
  white-space: nowrap;
}

/* ── Status select ──────────────────────────────────────────────────────────── */
.status-select {
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  outline: none;
  appearance: auto;
}

.status-pending   { background: #fef9c3; color: #854d0e; border-color: #fde68a; }
.status-confirmed { background: #dcfce7; color: #166534; border-color: #86efac; }
.status-completed { background: #dbeafe; color: #1e40af; border-color: #93c5fd; }
.status-cancelled { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }

/* ── Buttons ────────────────────────────────────────────────────────────────── */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn:not(:disabled):hover { opacity: 0.85; }

.btn-primary   { background: #6c63ff; color: #fff; }
.btn-secondary { background: #e5e7eb; color: #374151; }
.btn-ghost     { background: transparent; color: #6b7280; border: 1px solid #d1d5db; }
.btn-sm        { padding: 0.3rem 0.7rem; font-size: 0.8rem; background: #6c63ff; color: #fff; border-radius: 5px; }

/* ── State messages ─────────────────────────────────────────────────────────── */
.state-msg {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.95rem;
}

.state-msg.error { color: #dc2626; }

/* ── Modal ──────────────────────────────────────────────────────────────────── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}

.modal h2 {
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.modal-sub {
  margin: 0 0 1.5rem;
  font-size: 0.85rem;
  color: #6b7280;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1rem;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #374151;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.15s;
}

.form-input:focus {
  border-color: #6c63ff;
  box-shadow: 0 0 0 2px rgba(108, 99, 255, 0.15);
}

.error-msg {
  color: #dc2626;
  font-size: 0.85rem;
  margin: 0.5rem 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
