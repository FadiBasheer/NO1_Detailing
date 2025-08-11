import interiorImg from "@/assets/services/interior.jpg";
import exteriorImg from "@/assets/services/exterior.jpg";
import bothImg from "@/assets/services/both.jpg";

import engineCleaningImg from "@/assets/addons/engine-cleaning.jpg";
import polishingImg from "@/assets/addons/polishing.jpg";
import moldCleaningImg from "@/assets/addons/mold-cleaning.jpg";



export const services = {
  Interior: {
    name: "Interior",
    duration: 60,
    price: 100,
    description: "Deep cleaning of the car’s interior, including seats, carpets, and dashboard.",
    image: interiorImg
  },
  Exterior: {
    name: "Exterior",
    duration: 45,
    price: 80,
    description: "Complete exterior wash, wax, and tire shine.",
    image: exteriorImg
  },
  Both: {
    name: "Both",
    duration: 90,
    price: 160,
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