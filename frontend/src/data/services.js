export const services = {
  Interior: {
    name: "Interior",
    duration: 60,
    price: 100,
    description: "Deep cleaning of the car’s interior, including seats, carpets, and dashboard.",
    image: '/src/assets/services/interior.jpg'
  },
  Exterior: {
    name: "Exterior",
    duration: 45,
    price: 80,
    description: "Complete exterior wash, wax, and tire shine.",
    image: '/src/assets/services/exterior.jpg'
  },
  Both: {
    name: "Both",
    duration: 90,
    price: 160,
    description: "Full interior and exterior detailing.",
    image: '/src/assets/services/both.jpg'
  }
};

export const addons = {
  "Engine Cleaning": {
    duration: 30,
    price: 40,
    description: "Degreasing and detailed cleaning of the engine bay.",
    image: '/src/assets/addons/engine-cleaning.jpg'
  },
  "Polishing": {
    duration: 45,
    price: 60,
    description: "Paint correction and polishing for a showroom finish.",
    image: '/src/assets/addons/polishing.jpg'
  },
  "Mold Cleaning": {
    duration: 60,
    price: 75,
    description: "Removes mold and disinfects affected areas.",
    image: '/src/assets/addons/mold-cleaning.jpg'
  }
};