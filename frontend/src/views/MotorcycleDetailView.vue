<template>
  <div class="moto-detail">

    <!-- Hero -->
    <section class="hero" :style="{ backgroundImage: `url(${motoImage})` }">
      <div class="hero-overlay">
        <h1>Motorcycle Detailing</h1>
        <p class="subtitle">
          Precision detailing built for bikes — from cruisers and sport bikes to
          choppers and touring machines. We come to you and treat every inch with care.
        </p>
      </div>
    </section>

    <!-- Description -->
    <section class="description">
      <div class="desc-inner">
        <h2>What Our Motorcycle Detailing Service Covers</h2>
        <p>
          Motorcycles are more than transportation — they're a passion. Every chrome piece,
          painted panel, and leather surface deserves careful attention that a standard car
          wash simply can't provide. Our motorcycle detailing service is tailored specifically
          for two-wheeled machines: delicate paintwork, tight engine bays, exposed chrome,
          spoked wheels, and leather seats all get the individual treatment they need.
          Our technicians arrive at your location with the right tools and products for
          motorcycles — no harsh chemicals, no risk of damage, just a spotless result.
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services">
      <h2>Our Motorcycle Detailing Services</h2>
      <div class="service-grid">
        <div class="service-card" v-for="svc in motoServices" :key="svc.name">
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

    <!-- Why Different -->
    <section class="why-different">
      <h2>Why Motorcycle Detailing Is Different</h2>
      <div class="diff-grid">
        <div class="diff-card" v-for="point in whyDifferent" :key="point.title">
          <span class="diff-icon">{{ point.icon }}</span>
          <h3>{{ point.title }}</h3>
          <p>{{ point.description }}</p>
        </div>
      </div>
    </section>

    <!-- Coming Soon -->
    <section class="coming-soon">
      <div class="cs-icon">🚧</div>
      <h2>Coming Soon</h2>
      <p>
        Motorcycle detailing bookings are not yet open. We're gearing up to bring
        this service to riders in your area — check back soon or contact us to
        join the waitlist and be the first to know when we launch.
      </p>
      <span class="cs-badge">Launching Soon</span>
    </section>

  </div>
</template>

<script setup>
import motoImage from '@/assets/motorcycle.jpg';

const motoServices = [
  {
    name: 'Full Bike Wash',
    icon: '🏍️',
    gradient: 'linear-gradient(135deg, #1c1c1c, #3f3f3f)',
    description:
      'A careful hand wash of the entire motorcycle using pH-neutral soap and soft microfiber mitts — safe for all paint types, plastics, and sensitive surfaces. No pressure washers that can force water into electrics.',
  },
  {
    name: 'Engine Bay Detailing',
    icon: '⚙️',
    gradient: 'linear-gradient(135deg, #7f1d1d, #ef4444)',
    description:
      'Careful degreasing and cleaning of the engine, frame, and surrounding components. We use targeted application to remove built-up grease and grime without exposing sensitive electrical parts to moisture.',
  },
  {
    name: 'Chrome & Metal Polishing',
    icon: '✨',
    gradient: 'linear-gradient(135deg, #374151, #9ca3af)',
    description:
      'Hand polishing of exhaust pipes, forks, handlebars, crash bars, and all chrome or stainless fittings — removing oxidation, water spots, and tarnish to restore that factory mirror finish.',
  },
  {
    name: 'Paint Correction & Wax',
    icon: '🎨',
    gradient: 'linear-gradient(135deg, #1e40af, #60a5fa)',
    description:
      'Light swirl removal and paint correction on tanks, fairings, and fenders, followed by a hand-applied carnauba wax or paint sealant for deep gloss and long-lasting protection against UV and road debris.',
  },
  {
    name: 'Wheel & Spoke Cleaning',
    icon: '🔧',
    gradient: 'linear-gradient(135deg, #065f46, #34d399)',
    description:
      'Detailed cleaning of wheels, rims, and spokes — removing brake dust, road tar, and grime from every spoke and cavity. Finished with a tire dressing for a clean, matte black tire look.',
  },
  {
    name: 'Leather & Seat Conditioning',
    icon: '🛞',
    gradient: 'linear-gradient(135deg, #78350f, #d97706)',
    description:
      'Cleaning and conditioning of leather or vinyl seats, saddlebags, and leather accessories. Restores suppleness, prevents cracking, and protects against UV fading and moisture damage.',
  },
  {
    name: 'Plastic & Fairing Restoration',
    icon: '🏁',
    gradient: 'linear-gradient(135deg, #4c1d95, #a78bfa)',
    description:
      'Treatment of faded, scuffed, or dull plastic fairings, windscreens, and body panels. We clean, restore color depth, and apply a UV protectant to keep plastics looking new.',
  },
  {
    name: 'Chain Cleaning & Lubrication',
    icon: '⛓️',
    gradient: 'linear-gradient(135deg, #1e3a5f, #3b82f6)',
    description:
      'Thorough cleaning of the drive chain to remove built-up grease, dirt, and old lubricant, followed by fresh lubrication — improving performance and extending chain and sprocket life.',
  },
];

const whyDifferent = [
  {
    icon: '💧',
    title: 'No Pressure Washing',
    description:
      'High-pressure water can force moisture into instrument clusters, bearings, and electrical connectors. We use low-pressure rinse techniques designed specifically for motorcycles.',
  },
  {
    icon: '🧴',
    title: 'Motorcycle-Safe Products',
    description:
      'We use products formulated for bikes — no harsh alkaline degreasers that strip chrome or damage anodized finishes, and no silicone sprays that make surfaces slippery.',
  },
  {
    icon: '🤲',
    title: 'Hand-Applied Everything',
    description:
      'Every product is applied by hand. Bikes have small, intricate surfaces that machines can\'t reach — spokes, frame tubes, engine fins — and hand application ensures nothing gets missed.',
  },
  {
    icon: '📍',
    title: 'We Come to You',
    description:
      'No need to trailer or ride a dirty bike to a shop. We show up at your home, garage, or storage unit with everything we need — fully mobile, fully equipped.',
  },
];
</script>

<style scoped>
.moto-detail {
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
  background: linear-gradient(to right, rgba(10, 10, 10, 0.75) 0%, rgba(10, 10, 10, 0.2) 100%);
  color: white;
}

.hero-overlay h1 {
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 14px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
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
  background: #fafafa;
  border-left: 5px solid #1c1c1c;
  border-radius: 10px;
  padding: 36px 40px;
}

.desc-inner h2 {
  font-size: 1.6rem;
  color: #1c1c1c;
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
  margin-bottom: 70px;
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
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.13);
}

.card-image {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  font-size: 3rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.25));
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

/* ── Why Different ── */
.why-different {
  margin-bottom: 60px;
}

.why-different h2 {
  font-size: 1.8rem;
  color: #222;
  text-align: center;
  margin-bottom: 32px;
}

.diff-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
}

.diff-card {
  background: #f9fafb;
  border-radius: 12px;
  padding: 28px 24px;
  text-align: center;
  border: 1px solid #e5e7eb;
}

.diff-icon {
  font-size: 2.2rem;
  display: block;
  margin-bottom: 12px;
}

.diff-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.diff-card p {
  color: #555;
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

/* ── Coming Soon ── */
.coming-soon {
  background: linear-gradient(135deg, #111827, #1f2937);
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
  background: #f59e0b;
  color: #111827;
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

  .service-grid,
  .diff-grid {
    grid-template-columns: 1fr;
  }
}
</style>
