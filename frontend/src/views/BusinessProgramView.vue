<template>
  <div v-if="program" class="program-page">

    <!-- Hero -->
    <section class="hero" :style="{ background: program.heroGradient }">
      <div class="hero-inner">
        <div class="hero-icon">{{ program.icon }}</div>
        <h1>{{ program.title }}</h1>
        <p class="subtitle">{{ program.tagline }}</p>
        <router-link :to="`/business-contact?type=${encodeURIComponent(program.title)}`" class="btn-hero">
          Get a Free Quote
        </router-link>
      </div>
    </section>

    <!-- Overview -->
    <section class="overview">
      <div class="overview-inner">
        <h2>Why {{ program.title }}?</h2>
        <p>{{ program.overview }}</p>
      </div>
    </section>

    <!-- Benefits grid -->
    <section class="benefits">
      <h2>What We Offer</h2>
      <div class="benefit-grid">
        <div class="benefit-card" v-for="b in program.benefits" :key="b.title">
          <div class="benefit-icon-wrap" :style="{ background: program.accentGradient }">
            <span>{{ b.icon }}</span>
          </div>
          <h3>{{ b.title }}</h3>
          <p>{{ b.desc }}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="how-it-works">
      <h2>How It Works</h2>
      <div class="steps">
        <div class="step" v-for="(step, i) in program.steps" :key="i">
          <div class="step-number" :style="{ background: program.accentGradient }">{{ i + 1 }}</div>
          <div class="step-text">
            <h4>{{ step.title }}</h4>
            <p>{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta">
      <div class="cta-inner">
        <h2>Ready to get started?</h2>
        <p>Contact us today and we'll build a custom detailing plan for your business.</p>
        <router-link :to="`/business-contact?type=${encodeURIComponent(program.title)}`" class="btn-cta">
          Contact Us
        </router-link>
      </div>
    </section>

  </div>

  <div v-else class="not-found">
    <h2>Program not found.</h2>
    <router-link to="/">Go home</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import fleetImg       from '@/assets/BusinessProgram/fleet_managment.jpg';
import dealershipsImg from '@/assets/BusinessProgram/dealerships.jpg';
import rideshareImg   from '@/assets/BusinessProgram/rideshare.jpg';
import turoImg        from '@/assets/BusinessProgram/turo.jpg';
import hotelsImg      from '@/assets/BusinessProgram/hotels.jpg';
import restaurantsImg from '@/assets/BusinessProgram/restaurants.jpg';
import barbershopsImg from '@/assets/BusinessProgram/barbershops.jpg';

const route = useRoute();

const programs = {
  'fleet-management': {
    title: 'Fleet Management',
    icon: '🚗',
    tagline: 'Keep your entire fleet spotless, on schedule, and on-site — no downtime required.',
    heroImage: fleetImg,
    heroGradient: 'linear-gradient(135deg, rgba(30,58,95,0.88) 0%, rgba(37,99,235,0.80) 100%)',
    accentGradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    overview: `Managing a fleet means every vehicle is a direct reflection of your brand. Dirty or neglected vehicles signal poor attention to detail to your clients and employees. Our fleet detailing program keeps every vehicle in your inventory clean, professional, and road-ready — on a schedule that works around your operations, not against them. We come to your lot or depot, handle everything on-site, and report back on each vehicle's condition.`,
    benefits: [
      { icon: '📅', title: 'Scheduled Service', desc: 'Weekly, bi-weekly, or monthly visits — we lock in a recurring schedule so your fleet is always clean without you having to think about it.' },
      { icon: '📍', title: 'On-Site at Your Lot', desc: 'No need to relocate vehicles. Our mobile team brings all equipment directly to your facility.' },
      { icon: '🚘', title: 'Any Fleet Size', desc: 'From 3 vehicles to 300 — we scale our crew and schedule to match the size of your operation.' },
      { icon: '📋', title: 'Condition Reports', desc: 'After each visit, receive a summary of each vehicle\'s condition, including flagged damage or maintenance concerns.' },
      { icon: '💰', title: 'Volume Pricing', desc: 'Fleet accounts receive preferred rates that decrease per vehicle as your fleet size grows.' },
      { icon: '🤝', title: 'Dedicated Account Manager', desc: 'One point of contact for scheduling, billing, and any special requests — no call centres.' },
    ],
    steps: [
      { title: 'Tell us about your fleet', desc: 'Share your vehicle count, types, location, and how often you need service.' },
      { title: 'We build a custom plan', desc: 'We visit your site, assess your needs, and send a tailored proposal within 24 hours.' },
      { title: 'We come to you', desc: 'Our mobile team arrives at your lot on the scheduled day and handles everything.' },
      { title: 'Ongoing service & reporting', desc: 'Sit back while we keep your fleet clean and send you regular condition updates.' },
    ],
  },

  'car-dealerships': {
    title: 'Car Dealerships',
    icon: '🏢',
    tagline: 'Showroom-ready vehicles on demand — new arrivals, trade-ins, and display cars.',
    heroImage: dealershipsImg,
    heroGradient: 'linear-gradient(135deg, rgba(26,26,46,0.88) 0%, rgba(22,33,62,0.84) 60%, rgba(15,52,96,0.80) 100%)',
    accentGradient: 'linear-gradient(135deg, #0f3460, #533483)',
    overview: `Every vehicle on your lot is a sales opportunity, and presentation is everything. A clean, gleaming car closes deals faster and justifies higher price points. Our dealership detailing program gives your sales team a reliable partner to prep new arrivals, turn around trade-ins quickly, and keep display vehicles looking showroom-perfect every day — without pulling your staff away from selling.`,
    benefits: [
      { icon: '✨', title: 'New Arrival Prep', desc: 'Full exterior polish and interior detail to have every new vehicle floor-ready the day it arrives.' },
      { icon: '🔄', title: 'Trade-In Turnaround', desc: 'Fast turnaround details on trade-ins so they\'re priced and listed on the lot within hours, not days.' },
      { icon: '🪟', title: 'Display & Demo Cars', desc: 'Regular maintenance details to keep your display and demo vehicles looking flawless day after day.' },
      { icon: '⚡', title: 'Priority Scheduling', desc: 'Same-day or next-day service available for high-priority vehicles when a deal is on the line.' },
      { icon: '🧴', title: 'Paint Correction', desc: 'Light scratch removal and paint correction to restore trade-ins and pre-owned stock to near-new condition.' },
      { icon: '📦', title: 'Bulk Package Rates', desc: 'Monthly packages based on volume — predictable costs with no surprise invoices.' },
    ],
    steps: [
      { title: 'Assess your current needs', desc: 'Tell us your monthly vehicle volume, the types of services you need, and your lot location.' },
      { title: 'Custom dealership package', desc: 'We put together a per-vehicle pricing model and service menu that fits your workflow.' },
      { title: 'On-call or scheduled visits', desc: 'Book us per vehicle as needed, or set up a weekly visit to batch-prep new arrivals and trade-ins.' },
      { title: 'Consistent quality, every time', desc: 'Our trained technicians follow a strict checklist for every vehicle so standards never slip.' },
    ],
  },

  'rideshare': {
    title: 'Uber / Rideshare Drivers',
    icon: '🚕',
    tagline: 'Maintain a 5-star interior between shifts with flexible detailing that fits your schedule.',
    heroImage: rideshareImg,
    heroGradient: 'linear-gradient(135deg, rgba(6,78,59,0.88) 0%, rgba(6,95,70,0.84) 60%, rgba(5,150,105,0.80) 100%)',
    accentGradient: 'linear-gradient(135deg, #065f46, #34d399)',
    overview: `Your rating is everything in rideshare. Passengers notice a clean, fresh-smelling car the moment they get in — and they leave better reviews because of it. Between long shifts and back-to-back rides, it's hard to find time for a proper clean. Our mobile detailing service comes to your home, your parking spot, or wherever your car is sitting between shifts, so you can maintain a 5-star interior without losing earning hours.`,
    benefits: [
      { icon: '⭐', title: 'Protect Your Rating', desc: 'A consistently clean interior leads to better passenger reviews, keeping your acceptance rate and rating high.' },
      { icon: '📱', title: 'Flexible Scheduling', desc: 'Book early morning, evenings, or any time your car is parked — we work around your driving schedule.' },
      { icon: '🏠', title: 'We Come to You', desc: 'No need to drive to a detail shop. We come to your home, apartment parking, or any location you prefer.' },
      { icon: '🌿', title: 'Odor Elimination', desc: 'Deep deodorizing treatments to remove food smells, pet odors, and stale air that passengers notice immediately.' },
      { icon: '💺', title: 'Seat & Carpet Cleaning', desc: 'Thorough upholstery and carpet cleaning to remove stains, spills, and debris from daily passenger use.' },
      { icon: '💵', title: 'Driver-Friendly Pricing', desc: 'Affordable single-driver rates with loyalty discounts for recurring bookings every 2–4 weeks.' },
    ],
    steps: [
      { title: 'Pick your service', desc: 'Choose from a quick interior refresh or a full interior deep clean depending on how long it\'s been.' },
      { title: 'Book a time that works', desc: 'Select any available slot — early morning before your shift, or while you\'re sleeping between night sessions.' },
      { title: 'We come to your car', desc: 'Our technician arrives at your location with everything needed. No water or power hookup required from you.' },
      { title: 'Back on the road', desc: 'Your car is fresh, clean, and ready for 5-star passengers within 1–2 hours.' },
    ],
  },

  'turo-hosts': {
    title: 'Turo Hosts',
    icon: '🔑',
    tagline: 'Maximize your ratings and bookings with reliable turnaround details between guest rentals.',
    heroImage: turoImg,
    heroGradient: 'linear-gradient(135deg, rgba(124,45,18,0.88) 0%, rgba(180,83,9,0.84) 60%, rgba(217,119,6,0.80) 100%)',
    accentGradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    overview: `On Turo, photos and reviews sell your car. Guests consistently rate cleanliness as the top factor in their review, and a single low-star review can tank your search ranking. Our Turo host detailing program is built around your booking calendar — we coordinate turnaround cleans between guest drop-offs and pickups so your car is always guest-ready, every time, without you having to scramble.`,
    benefits: [
      { icon: '🗓️', title: 'Calendar-Synced Turnarounds', desc: 'Share your Turo booking windows with us and we\'ll schedule cleans automatically between each rental.' },
      { icon: '📸', title: 'Photo-Ready Results', desc: 'Every clean leaves your vehicle looking spotless — ready for listing photos and first-impression pickups.' },
      { icon: '🔍', title: 'Damage Inspection Report', desc: 'After each guest return, we document the vehicle\'s condition with photos before cleaning, protecting you from disputes.' },
      { icon: '🧽', title: 'Interior Deep Clean', desc: 'Full vacuum, wipe-down, window clean, and odor treatment so the next guest walks into a fresh vehicle.' },
      { icon: '⚡', title: 'Fast Turnaround', desc: 'Same-day service available for back-to-back bookings with short windows between guest handoffs.' },
      { icon: '🏆', title: 'Boost Your Rating', desc: 'Hosts who use regular professional cleans consistently earn higher ratings and more repeat bookings.' },
    ],
    steps: [
      { title: 'Share your booking calendar', desc: 'Tell us your typical rental windows and we\'ll identify the best clean windows between each booking.' },
      { title: 'We build a turnaround plan', desc: 'We set up a recurring or on-call schedule that fits seamlessly into your hosting routine.' },
      { title: 'Guest drops off — we show up', desc: 'After each return, our technician arrives at your pickup location to inspect and clean.' },
      { title: 'Next guest picks up a perfect car', desc: 'Every guest gets a spotless vehicle. Your ratings go up. Your earnings follow.' },
    ],
  },

  'hotels-hospitality': {
    title: 'Hotels & Hospitality',
    icon: '🏨',
    tagline: 'Offer guests premium vehicle care as a value-added amenity or concierge service.',
    heroImage: hotelsImg,
    heroGradient: 'linear-gradient(135deg, rgba(30,27,75,0.88) 0%, rgba(55,48,163,0.84) 60%, rgba(99,102,241,0.80) 100%)',
    accentGradient: 'linear-gradient(135deg, #4338ca, #818cf8)',
    overview: `Premium hotels and resorts are always looking for ways to exceed guest expectations and create memorable experiences. Offering in-stay vehicle detailing — whether as a complimentary amenity or a paid concierge service — is a unique differentiator that leaves a lasting impression. While your guests enjoy their stay, we take care of their vehicles in your parking area, returning them cleaner than they arrived.`,
    benefits: [
      { icon: '🎁', title: 'Guest Amenity Program', desc: 'Offer complimentary or discounted detailing as part of your premium room packages or loyalty program.' },
      { icon: '🤵', title: 'Concierge Integration', desc: 'We work directly with your concierge desk to coordinate bookings seamlessly without disrupting front-of-house operations.' },
      { icon: '🅿️', title: 'In-Parking Lot Service', desc: 'All work is completed in your existing parking structure — no guest needs to move their vehicle or be present.' },
      { icon: '🏅', title: 'White-Glove Standards', desc: 'Our technicians arrive in clean uniforms, branded vehicles, and follow strict quality protocols fitting a luxury environment.' },
      { icon: '📊', title: 'Monthly Billing', desc: 'Consolidated monthly invoicing for all services rendered, making it easy to manage as a hotel expense.' },
      { icon: '🌟', title: 'Elevate Guest Reviews', desc: 'Guests who are delighted by unexpected extras leave better reviews — and come back.' },
    ],
    steps: [
      { title: 'Introduction meeting', desc: 'We meet with your GM or concierge manager to understand your guest profile and how the program would fit your property.' },
      { title: 'Service menu design', desc: 'We create a branded service menu — from express washes to full details — priced for your guests.' },
      { title: 'Concierge activation', desc: 'Your team books details through a simple portal or phone call. We handle the rest in your parking area.' },
      { title: 'Monthly reporting', desc: 'Receive a summary of services rendered each month, with feedback and quality metrics.' },
    ],
  },

  'restaurants-cafes': {
    title: 'Restaurants & Cafes',
    icon: '🍽️',
    tagline: 'Keep delivery vehicles and staff cars clean and professional on a regular schedule.',
    heroImage: restaurantsImg,
    heroGradient: 'linear-gradient(135deg, rgba(127,29,29,0.88) 0%, rgba(185,28,28,0.84) 60%, rgba(239,68,68,0.80) 100%)',
    accentGradient: 'linear-gradient(135deg, #dc2626, #f87171)',
    overview: `Delivery vehicles are a moving advertisement for your restaurant brand. A clean, well-maintained delivery car signals professionalism and care — exactly what customers want to associate with the food they order. Whether you run a catering operation, a food truck, or a busy café with delivery staff, our scheduled mobile detailing service keeps your vehicles looking sharp without pulling your team away from the kitchen.`,
    benefits: [
      { icon: '🚚', title: 'Delivery Fleet Cleaning', desc: 'Regular cleaning of delivery vehicles, vans, and bikes to keep your brand looking professional on every run.' },
      { icon: '🏪', title: 'At Your Location', desc: 'We come to your restaurant, cafe, or central depot during off-hours so vehicles are ready for the next service day.' },
      { icon: '☕', title: 'Food Odor Removal', desc: 'Specialized interior deodorizing to remove food smells that build up in delivery vehicles over time.' },
      { icon: '📅', title: 'Around Your Hours', desc: 'We schedule early morning or late evening cleans so vehicles are ready before your first delivery of the day.' },
      { icon: '🧼', title: 'Interior & Exterior', desc: 'Full inside-out cleaning including cargo areas, storage compartments, and delivery bags on request.' },
      { icon: '💳', title: 'Simple Monthly Billing', desc: 'Flat monthly rate based on vehicle count and frequency — easy to budget and expense.' },
    ],
    steps: [
      { title: 'Tell us about your operation', desc: 'How many vehicles, what type, where they\'re parked, and when they\'re free between shifts.' },
      { title: 'We set up a schedule', desc: 'A recurring clean plan is built around your hours of operation — no disruption to service.' },
      { title: 'Off-hours cleans', desc: 'Our team arrives while the vehicles are parked, cleans everything, and is gone before opening.' },
      { title: 'Fresh vehicles every day', desc: 'Your drivers start each day with a clean vehicle that represents your brand the right way.' },
    ],
  },

  'barbershops-salons': {
    title: 'Barbershops & Salons',
    icon: '✂️',
    tagline: 'Offer clients a car detail while they wait — a unique loyalty perk that sets you apart.',
    heroImage: barbershopsImg,
    heroGradient: 'linear-gradient(135deg, rgba(45,27,105,0.88) 0%, rgba(91,33,182,0.84) 60%, rgba(139,92,246,0.80) 100%)',
    accentGradient: 'linear-gradient(135deg, #6d28d9, #a78bfa)',
    overview: `Your clients are already sitting in your chair for 30–90 minutes. What if they walked out to a freshly detailed car? Partnering with NO1 Detailing turns your wait time into a premium add-on experience that clients will talk about — and come back for. It's a simple, low-effort way to increase your average ticket, earn loyalty, and genuinely stand out from every other shop on the block.`,
    benefits: [
      { icon: '💈', title: 'In-Appointment Details', desc: 'Clients drop their keys at check-in. We clean their car in your parking lot while they\'re in the chair.' },
      { icon: '💰', title: 'New Revenue Stream', desc: 'Add detailing as a paid upsell or loyalty reward. We handle the service — you keep a referral margin.' },
      { icon: '📣', title: 'Word-of-Mouth Marketing', desc: 'Clients who experience this unique perk tell their friends. It becomes part of your brand story.' },
      { icon: '🅿️', title: 'We Use Your Parking', desc: 'No special infrastructure needed. As long as you have a parking lot or street spaces, we can operate there.' },
      { icon: '⏱️', title: 'Express Options', desc: 'Interior refresh and exterior wipe-down packages are available for shorter appointments under 45 minutes.' },
      { icon: '🤝', title: 'Co-Branded Promotions', desc: 'We\'ll help you promote the partnership with social media assets, cards, and co-branded offers.' },
    ],
    steps: [
      { title: 'Partnership setup', desc: 'We meet to understand your appointment volume, parking situation, and what you want to offer clients.' },
      { title: 'Service menu for your clients', desc: 'We design a simple menu — express interior, full detail, etc. — that fits within typical appointment windows.' },
      { title: 'Client books at check-in', desc: 'Client hands over keys when they sit down. Our technician starts on the car immediately.' },
      { title: 'Keys returned, car clean', desc: 'Car is done by the time the client is finished. They leave with a fresh cut and a clean car.' },
    ],
  },
};

const slug = computed(() => route.params.slug);
const program = computed(() => programs[slug.value] ?? null);
</script>

<style scoped>
.program-page {
  font-family: inherit;
}

/* Hero */
.hero {
  padding: 80px 24px 64px;
  text-align: center;
  color: white;
}

.hero-inner {
  max-width: 680px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
}

.hero h1 {
  font-size: 2.8rem;
  font-weight: 900;
  margin-bottom: 16px;
  line-height: 1.15;
}

.subtitle {
  font-size: 1.15rem;
  opacity: 0.88;
  line-height: 1.7;
  margin-bottom: 36px;
}

.btn-hero {
  display: inline-block;
  background: white;
  color: #111827;
  font-weight: 800;
  font-size: 1rem;
  padding: 14px 36px;
  border-radius: 999px;
  text-decoration: none;
  transition: opacity 0.2s, transform 0.2s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.btn-hero:hover {
  opacity: 0.92;
  transform: translateY(-2px);
}

/* Overview */
.overview {
  background: #f0f7ff;
  padding: 56px 24px;
}

.overview-inner {
  max-width: 820px;
  margin: 0 auto;
  border-left: 5px solid #007BFF;
  padding-left: 32px;
}

.overview-inner h2 {
  font-size: 1.6rem;
  font-weight: 800;
  color: #1e40af;
  margin-bottom: 14px;
}

.overview-inner p {
  color: #444;
  font-size: 1rem;
  line-height: 1.8;
  margin: 0;
}

/* Benefits */
.benefits {
  padding: 64px 24px;
  background: white;
}

.benefits h2 {
  font-size: 1.9rem;
  font-weight: 900;
  color: #111827;
  text-align: center;
  margin-bottom: 40px;
}

.benefit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

.benefit-card {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 28px 24px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}

.benefit-icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  margin-bottom: 16px;
}

.benefit-card h3 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 8px;
}

.benefit-card p {
  font-size: 0.9rem;
  color: #6b7280;
  line-height: 1.65;
  margin: 0;
}

/* How it works */
.how-it-works {
  background: #f9fafb;
  padding: 64px 24px;
}

.how-it-works h2 {
  font-size: 1.9rem;
  font-weight: 900;
  color: #111827;
  text-align: center;
  margin-bottom: 48px;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 720px;
  margin: 0 auto;
}

.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.step-number {
  min-width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 900;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-text h4 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 4px;
}

.step-text p {
  font-size: 0.92rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
}

/* CTA */
.cta {
  background: #111827;
  padding: 72px 24px;
  text-align: center;
  color: white;
}

.cta-inner {
  max-width: 560px;
  margin: 0 auto;
}

.cta h2 {
  font-size: 2rem;
  font-weight: 900;
  margin-bottom: 12px;
  color: white;
}

.cta p {
  font-size: 1rem;
  color: #9ca3af;
  margin-bottom: 36px;
  line-height: 1.7;
}

.btn-cta {
  display: inline-block;
  background: #007BFF;
  color: white;
  font-weight: 800;
  font-size: 1.05rem;
  padding: 16px 48px;
  border-radius: 999px;
  text-decoration: none;
  transition: background 0.2s, transform 0.2s;
  box-shadow: 0 4px 20px rgba(0,123,255,0.35);
}

.btn-cta:hover {
  background: #0056b3;
  transform: translateY(-2px);
}

/* Not found */
.not-found {
  text-align: center;
  padding: 80px 24px;
  font-size: 1.2rem;
  color: #6b7280;
}

@media (max-width: 640px) {
  .hero h1 { font-size: 2rem; }
  .benefit-grid { grid-template-columns: 1fr; }
  .overview-inner { padding-left: 20px; }
}
</style>
