<template>
  <div class="gift-cards">
    <section class="hero">
      <h1>Gift Cards</h1>
      <p class="subtitle">Give the gift of a clean car — perfect for any occasion.</p>
    </section>

    <section class="options">
      <h2>Choose an Amount</h2>
      <div class="amounts">
        <button
          v-for="amount in amounts"
          :key="amount"
          class="amount-btn"
          :class="{ selected: selectedAmount === amount }"
          @click="selectedAmount = amount"
        >
          ${{ amount }}
        </button>
        <div class="custom-amount">
          <label>Custom amount</label>
          <input
            type="number"
            v-model.number="customAmount"
            placeholder="Enter amount"
            min="10"
            @focus="selectedAmount = null"
          />
        </div>
      </div>

      <div class="recipient">
        <h2>Recipient Details</h2>
        <div class="form-group">
          <label>Recipient's Name</label>
          <input type="text" v-model="recipientName" placeholder="e.g. John Smith" />
        </div>
        <div class="form-group">
          <label>Recipient's Email</label>
          <input type="email" v-model="recipientEmail" placeholder="e.g. john@example.com" />
        </div>
        <div class="form-group">
          <label>Personal Message (optional)</label>
          <textarea v-model="message" placeholder="Happy Birthday! Enjoy your detail." rows="3"></textarea>
        </div>
      </div>

      <button class="btn-purchase">Purchase Gift Card</button>
    </section>

    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step">
          <div class="step-num">1</div>
          <p>Choose an amount and enter recipient details</p>
        </div>
        <div class="step">
          <div class="step-num">2</div>
          <p>We email the gift card code directly to the recipient</p>
        </div>
        <div class="step">
          <div class="step-num">3</div>
          <p>They book a detail and redeem the code at checkout</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const amounts = [50, 80, 100, 160];
const selectedAmount = ref(null);
const customAmount = ref('');
const recipientName = ref('');
const recipientEmail = ref('');
const message = ref('');
</script>

<style scoped>
.gift-cards {
  max-width: 800px;
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

h2 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #222;
}

.amounts {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: center;
  margin-bottom: 40px;
}

.amount-btn {
  padding: 14px 24px;
  border: 2px solid #007BFF;
  border-radius: 8px;
  background: white;
  color: #007BFF;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.amount-btn:hover,
.amount-btn.selected {
  background: #007BFF;
  color: white;
}

.custom-amount {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.custom-amount label {
  font-size: 0.85rem;
  color: #666;
}

.custom-amount input {
  padding: 12px 14px;
  border: 2px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  width: 140px;
}

.custom-amount input:focus {
  border-color: #007BFF;
  outline: none;
}

.recipient {
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: bold;
  color: #333;
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007BFF;
  outline: none;
}

.btn-purchase {
  background-color: #007BFF;
  color: white;
  border: none;
  padding: 14px 36px;
  border-radius: 6px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  margin-bottom: 60px;
}

.btn-purchase:hover {
  background-color: #0056b3;
}

.how-it-works {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 40px 30px;
  text-align: center;
}

.steps {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
}

.step {
  max-width: 200px;
}

.step-num {
  width: 40px;
  height: 40px;
  background: #007BFF;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin: 0 auto 12px;
}

.step p {
  color: #555;
  font-size: 0.95rem;
}
</style>
