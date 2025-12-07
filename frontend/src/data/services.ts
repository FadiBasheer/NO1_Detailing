import interiorImg from "@/assets/services/interior.jpg";
import exteriorImg from "@/assets/services/exterior.jpg";
import bothImg from "@/assets/services/both.jpg";

import engineCleaningImg from "@/assets/services/engine-cleaning.jpg";
import polishingImg from "@/assets/services/polishing.jpg";
import moldCleaningImg from "@/assets/services/mold-cleaning.jpg";

// Prices per vehicle category. Adjust numbers here any time — one place, affects everything.
export const servicePricing: Record<string, { Exterior: number; Interior: number; Both: number }> = {
  "Sedan/Coupe":    { Exterior: 50,  Interior: 50,  Both: 90  },
  "Small SUV":      { Exterior: 55,  Interior: 55,  Both: 100 },
  "Mid-size SUV":   { Exterior: 55,  Interior: 55,  Both: 100 },
  "SUV 7 seats":    { Exterior: 60,  Interior: 60,  Both: 110 },
  "Mini Van":       { Exterior: 60,  Interior: 60,  Both: 110 },
  "Small Truck":    { Exterior: 60,  Interior: 55,  Both: 105 },
  "Big Truck":      { Exterior: 70,  Interior: 65,  Both: 125 },
  "Commercial Van": { Exterior: 75,  Interior: 75,  Both: 140 },
  "Motorcycle":     { Exterior: 40,  Interior: 35,  Both: 70  },
  "RV/Trailer":     { Exterior: 120, Interior: 120, Both: 220 },
  "Boats":          { Exterior: 100, Interior: 100, Both: 185 },
};

export const services = {
  Exterior: {
    name: "Exterior",
    duration: 45,
    description: "Complete exterior wash, wax, and tire shine.",
    image: exteriorImg
  },
  Interior: {
    name: "Interior",
    duration: 60,
    description: "Deep cleaning of the car’s interior, including seats, carpets, and dashboard.",
    image: interiorImg
  },
  Both: {
    name: "Both",
    duration: 90,
    description: "Full interior and exterior detailing.",
    image: bothImg
  }
};

export const addons = {
  "Engine Cleaning": {
    name: "Engine Cleaning",
    duration: 30,
    price: 40,
    description: "Degreasing and detailed cleaning of the engine bay.",
    image: engineCleaningImg
  },
  "Polishing": {
    name: "Polishing",
    duration: 45,
    price: 60,
    description: "Paint correction and polishing for a showroom finish.",
    image: polishingImg
  },
  "Mold Cleaning": {
    name: "Mold Cleaning",
    duration: 60,
    price: 75,
    description: "Removes mold and disinfects affected areas.",
    image: moldCleaningImg
  }
};