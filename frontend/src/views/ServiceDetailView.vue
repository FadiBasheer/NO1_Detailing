<template>
  <div class="service-detail">
    <section class="hero">
      <h1>{{ service.title }}</h1>
      <p class="subtitle">{{ service.subtitle }}</p>
      <router-link to="/vehicles" class="btn-book">Book Now</router-link>
    </section>

    <section class="packages">
      <h2>Our Packages</h2>
      <div class="package-grid">
        <div class="package-card" v-for="pkg in packages" :key="pkg.name">
          <h3>{{ pkg.name }}</h3>
          <div class="price">${{ pkg.price }}</div>
          <div class="duration">{{ pkg.duration }} min</div>
          <p>{{ pkg.description }}</p>
          <router-link to="/vehicles" class="btn-book-sm">Book Now</router-link>
        </div>
      </div>
    </section>

    <section class="addons">
      <h2>Add-On Services</h2>
      <div class="addon-grid">
        <div class="addon-card" v-for="addon in addons" :key="addon.name">
          <h4>{{ addon.name }}</h4>
          <span class="addon-price">${{ addon.price }}</span>
          <p>{{ addon.description }}</p>
        </div>
      </div>
    </section>

    <section class="cta">
      <h2>Ready to get started?</h2>
      <p>We come to you — at home, the office, or wherever works.</p>
      <router-link to="/vehicles" class="btn-book">Book Your Detail</router-link>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const type = computed(() => route.params.type);

const serviceMap = {
  car: {
    title: 'Car Detailing',
    subtitle: 'Professional detailing for sedans, SUVs, trucks, and more — we come to you.',
  },
  rv: {
    title: 'RV Detailing',
    subtitle: 'Specialized detailing for motorhomes, travel trailers, and camper vans.',
  },
  boat: {
    title: 'Boat Detailing',
    subtitle: 'Keep your boat looking showroom-ready — hull, deck, and interior.',
  },
  motorcycle: {
    title: 'Motorcycle Detailing',
    subtitle: 'Careful, thorough detailing tailored for motorcycles and scooters.',
  },
};

const service = computed(() => serviceMap[type.value] ?? serviceMap.car);

const packages = [
  {
    name: 'Interior',
    price: 100,
    duration: 60,
    description: 'Deep cleaning of the interior, including seats, carpets, and dashboard.',
  },
  {
    name: 'Exterior',
    price: 80,
    duration: 45,
    description: 'Complete exterior wash, wax, and tire shine.',
  },
  {
    name: 'Full Package',
    price: 160,
    duration: 90,
    description: 'Full interior and exterior detailing — the best value.',
  },
];

const addons = [
  { name: 'Engine Cleaning', price: 40, description: 'Degrease and clean the engine bay.' },
  { name: 'Polishing', price: 60, description: 'Remove light scratches and restore paint shine.' },
  { name: 'Mold Removal', price: 75, description: 'Eliminate mold and odors from the interior.' },
];
</script>

<style scoped>
.service-detail {
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, #007BFF11, #007BFF22);
  border-radius: 12px;
  margin-bottom: 60px;
}

.hero h1 {
  font-size: 2.5rem;
  color: #007BFF;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 28px;
}

.btn-book {
  background-color: #007BFF;
  color: white;
  padding: 14px 32px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  display: inline-block;
}

.btn-book:hover {
  background-color: #0056b3;
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 28px;
  color: #222;
  text-align: center;
}

.package-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 60px;
}

.package-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s;
}

.package-card:hover {
  transform: translateY(-4px);
}

.package-card h3 {
  font-size: 1.3rem;
  margin-bottom: 10px;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #007BFF;
  margin-bottom: 4px;
}

.duration {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.package-card p {
  color: #555;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.btn-book-sm {
  background-color: #007BFF;
  color: white;
  padding: 10px 22px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.9rem;
}

.btn-book-sm:hover {
  background-color: #0056b3;
}

.addon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
}

.addon-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.addon-card h4 {
  font-size: 1rem;
  margin-bottom: 6px;
}

.addon-price {
  font-weight: bold;
  color: #007BFF;
  font-size: 1.1rem;
  display: block;
  margin-bottom: 8px;
}

.addon-card p {
  color: #666;
  font-size: 0.9rem;
}

.cta {
  text-align: center;
  background: #007BFF;
  color: white;
  padding: 50px 20px;
  border-radius: 12px;
}

.cta h2 {
  color: white;
  margin-bottom: 10px;
}

.cta p {
  margin-bottom: 24px;
  font-size: 1.05rem;
  opacity: 0.9;
}

.cta .btn-book {
  background: white;
  color: #007BFF;
}

.cta .btn-book:hover {
  background: #e8f0fe;
}
</style>
