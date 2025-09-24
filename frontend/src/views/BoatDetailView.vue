<template>
  <div class="boat-detail">

    <!-- Hero -->
    <section class="hero" :style="{ backgroundImage: `url(${boatImage})` }">
      <div class="hero-overlay">
        <h1>Boat Detailing</h1>
        <p class="subtitle">
          Expert detailing for powerboats, sailboats, pontoons, and personal watercraft —
          restoring your vessel to its best condition, right at the dock or marina.
        </p>
      </div>
    </section>

    <!-- Description -->
    <section class="description">
      <div class="desc-inner">
        <h2>What Our Boat Detailing Service Covers</h2>
        <p>
          Boats take a beating from sun, salt, algae, and waterline staining — damage that
          builds up fast and degrades both appearance and resale value. Our professional boat
          detailing service is built around the unique demands of marine environments. From
          removing stubborn waterline scum and oxidized gelcoat to cleaning and conditioning
          upholstery in the cabin, our technicians bring the right tools and products directly
          to your slip so your boat is always ready to launch.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services">
      <h2>Our Boat Detailing Services</h2>
      <div class="service-grid">
        <div class="service-card" v-for="svc in boatServices" :key="svc.name">
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
          Boat detailing bookings are not yet open, but we're working hard to bring
          this service to your marina. Check back soon or reach out to get on the
          waitlist and be first to know when it launches.
        </p>
        <span class="cs-badge">Launching Soon</span>
      </div>
    </section>

  </div>
</template>

<script setup>
import boatImage from '@/assets/boats.jpg';

const boatServices = [
  {
    name: 'Hull Wash & Scrub',
    icon: '⚓',
    gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    description:
      'A thorough wash of the entire hull surface, removing algae, dirt, bird droppings, and road grime picked up in transit. Leaves the hull clean and ready for the next step of treatment.',
  },
  {
    name: 'Waterline Stain Removal',
    icon: '🌊',
    gradient: 'linear-gradient(135deg, #0369a1, #38bdf8)',
    description:
      'Targeted treatment of the waterline strip to dissolve and remove mineral deposits, rust stains, scum lines, and algae buildup that form at the water\'s surface over time.',
  },
  {
    name: 'Gelcoat Oxidation Removal',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #6d28d9, #a78bfa)',
    description:
      'Multi-stage compounding and polishing to remove chalky, faded gelcoat oxidation and restore the original gloss and depth of your boat\'s finish — dramatically improving appearance.',
  },
  {
    name: 'Deck & Cockpit Cleaning',
    icon: '🧽',
    gradient: 'linear-gradient(135deg, #0e7490, #67e8f9)',
    description:
      'Deep cleaning of all deck surfaces, non-skid areas, and the cockpit — removing embedded dirt, salt residue, and staining while preserving the texture of non-skid surfaces.',
  },
  {
    name: 'Interior & Cabin Detail',
    icon: '🛥️',
    gradient: 'linear-gradient(135deg, #b45309, #fbbf24)',
    description:
      'Full interior clean covering upholstery, cushions, carpet, storage compartments, and hard surfaces. Leaves the cabin smelling fresh and looking spotless from bow to stern.',
  },
  {
    name: 'Wax & Protective Coating',
    icon: '🛡️',
    gradient: 'linear-gradient(135deg, #065f46, #34d399)',
    description:
      'Application of a marine-grade wax or sealant to the hull and topside surfaces, creating a protective barrier against UV rays, salt water, and environmental contaminants.',
  },
  {
    name: 'Metal & Chrome Polishing',
    icon: '🔩',
    gradient: 'linear-gradient(135deg, #374151, #9ca3af)',
    description:
      'Polish and restore cleats, rails, grab handles, exhausts, and other metal fittings. Removes oxidation and corrosion, leaving chrome and stainless steel gleaming.',
  },
  {
    name: 'Canvas & Cover Cleaning',
    icon: '⛵',
    gradient: 'linear-gradient(135deg, #1d4ed8, #60a5fa)',
    description:
      'Cleaning and treatment of bimini tops, covers, and canvas enclosures — removing mold, mildew, and grime, then applying a UV and water-repellent protectant to extend their life.',
  },
];
</script>

<style scoped>
.boat-detail {
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
  background: linear-gradient(to right, rgba(0, 30, 80, 0.72) 0%, rgba(0, 30, 80, 0.2) 100%);
  color: white;
}

.hero-overlay h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 14px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
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
  border-left: 5px solid #0369a1;
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
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
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
  background: linear-gradient(135deg, #0c1a3a, #1e3a8a);
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
  max-width: 540px;
  margin: 0 auto 28px;
  opacity: 0.85;
  line-height: 1.7;
}

.cs-badge {
  display: inline-block;
  background: #38bdf8;
  color: #0c1a3a;
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
