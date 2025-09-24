<template>
  <div class="rv-detail">

    <!-- Hero -->
    <section class="hero" :style="{ backgroundImage: `url(${rvImage})` }">
      <div class="hero-overlay">
        <h1>RV Detailing</h1>
        <p class="subtitle">
          Professional detailing for motorhomes, travel trailers, and camper vans —
          bringing showroom quality to your home away from home.
        </p>
      </div>
    </section>

    <!-- Description -->
    <section class="description">
      <div class="desc-inner">
        <h2>What Our RV Detailing Service Covers</h2>
        <p>
          RVs face some of the toughest conditions on the road — UV exposure, road grime, roof
          mold, oxidized paint, and more. Our specialized RV detailing service is designed to
          address every inch of your motorhome or trailer, inside and out. From deep-cleaning
          your living quarters to restoring faded fiberglass panels, our trained technicians
          arrive at your location with professional-grade equipment so you don't have to haul
          your rig anywhere.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services">
      <h2>Our RV Detailing Services</h2>
      <div class="service-grid">
        <div class="service-card" v-for="svc in rvServices" :key="svc.name">
          <div class="card-image" :style="{ background: svc.gradient }">
            <span class="card-icon">{{ svc.icon }}</span>
          </div>
          <div class="card-body">
            <h3>{{ svc.name }}</h3>
            <p>{{ svc.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Coming Soon -->
    <section class="coming-soon">
      <div class="coming-soon-inner">
        <div class="cs-icon">🚧</div>
        <h2>Coming Soon</h2>
        <p>
          RV detailing bookings are not yet open, but we're working hard to make this
          service available to you. Check back soon or reach out to us directly to get
          on the waitlist and be the first to know when it launches.
        </p>
        <span class="cs-badge">Launching Soon</span>
      </div>
    </section>

  </div>
</template>

<script setup>
import rvImage from '@/assets/rv-trailer.jpg';

const rvServices = [
  {
    name: 'Exterior Full Wash',
    icon: '🪣',
    gradient: 'linear-gradient(135deg, #1e40af, #3b82f6)',
    description:
      'A thorough hand wash of the entire exterior body, wheel wells, and undercarriage. Removes road grime, bug splatter, and built-up dirt for a clean, streak-free finish.',
  },
  {
    name: 'Roof Cleaning & Treatment',
    icon: '🏠',
    gradient: 'linear-gradient(135deg, #0e7490, #22d3ee)',
    description:
      'Removal of black streaks, mold, mildew, and algae from the RV roof using specialized cleaners, followed by a protective sealant to guard against future buildup.',
  },
  {
    name: 'Interior Deep Clean',
    icon: '🛋️',
    gradient: 'linear-gradient(135deg, #b45309, #f59e0b)',
    description:
      'Complete vacuuming, upholstery cleaning, and surface sanitization of the living area, kitchen, bathroom, and sleeping quarters — leaving the interior fresh and spotless.',
  },
  {
    name: 'Oxidation Removal & Polish',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #6d28d9, #a78bfa)',
    description:
      'Restore faded, chalky fiberglass or painted surfaces with a multi-step oxidation removal and polishing process, reviving the original color and gloss of your RV exterior.',
  },
  {
    name: 'Awning & Slide-Out Cleaning',
    icon: '🪟',
    gradient: 'linear-gradient(135deg, #065f46, #34d399)',
    description:
      'Thorough scrubbing of awnings and slide-out surfaces to remove algae, grime, tree sap, and debris — keeping the moving parts clean and extending their lifespan.',
  },
  {
    name: 'Odor Elimination & Sanitization',
    icon: '🌿',
    gradient: 'linear-gradient(135deg, #166534, #4ade80)',
    description:
      'A deep deodorizing treatment that targets and neutralizes persistent odors from the interior, combined with an antimicrobial sanitization pass for a truly fresh environment.',
  },
];
</script>

<style scoped>
.rv-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* ── Hero ── */
.hero {
  background-size: cover;
  background-position: center;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 60px;
  min-height: 380px;
  display: flex;
  align-items: center;
}

.hero-overlay {
  width: 100%;
  padding: 60px 40px;
  background: linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.2) 100%);
  color: white;
}

.hero-overlay h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 14px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

.subtitle {
  font-size: 1.1rem;
  max-width: 560px;
  line-height: 1.6;
  opacity: 0.92;
}

/* ── Description ── */
.description {
  margin-bottom: 60px;
}

.desc-inner {
  background: #f0f7ff;
  border-left: 5px solid #007BFF;
  border-radius: 10px;
  padding: 36px 40px;
}

.desc-inner h2 {
  font-size: 1.6rem;
  color: #1e40af;
  margin-bottom: 14px;
}

.desc-inner p {
  color: #444;
  font-size: 1rem;
  line-height: 1.75;
  margin: 0;
}

/* ── Services ── */
.services h2 {
  font-size: 1.8rem;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.service-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s, box-shadow 0.2s;
  background: #fff;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
}

.card-body {
  padding: 20px 22px 24px;
}

.card-body h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.card-body p {
  color: #555;
  font-size: 0.93rem;
  line-height: 1.65;
  margin: 0;
}

/* ── Coming Soon ── */
.coming-soon {
  background: linear-gradient(135deg, #1e293b, #334155);
  border-radius: 14px;
  padding: 60px 30px;
  text-align: center;
  color: white;
}

.cs-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.coming-soon h2 {
  font-size: 2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 14px;
}

.coming-soon p {
  font-size: 1.05rem;
  max-width: 560px;
  margin: 0 auto 28px;
  opacity: 0.85;
  line-height: 1.7;
}

.cs-badge {
  display: inline-block;
  background: #f59e0b;
  color: #1a1a1a;
  font-weight: 700;
  font-size: 0.95rem;
  padding: 10px 28px;
  border-radius: 999px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-overlay h1 {
    font-size: 2rem;
  }

  .hero-overlay {
    padding: 40px 24px;
  }

  .desc-inner {
    padding: 24px;
  }

  .service-grid {
    grid-template-columns: 1fr;
  }
}
</style>
