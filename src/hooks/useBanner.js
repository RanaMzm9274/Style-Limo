import { useEffect, useState } from "react";
import { configuratorCars } from "../data/cars.js";

export const defaultBanner = {
  eyebrow: "PRIVATE DRIVES. ICONIC ARRIVALS.",
  headingLine1: "Make an",
  headingLine2: "entrance.",
  taglineLine1: "Luxury vehicles. Thoughtful service.",
  taglineLine2: "Every journey, considered.",
  cars: configuratorCars,
};

export function useBanner() {
  const [banner, setBanner] = useState(defaultBanner);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/public/banner", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((nextBanner) => setBanner({
        ...nextBanner,
        eyebrow: "PRIVATE DRIVES. ICONIC ARRIVALS.",
        headingLine1: "Make an",
        headingLine2: "entrance.",
        taglineLine1: "Luxury vehicles. Thoughtful service.",
        taglineLine2: "Every journey, considered.",
        cars: nextBanner.cars.map((car, index) => index === 1 ? {
          ...car,
          id: "land-rover-sport-limo",
          brand: "LAND ROVER",
          name: "SPORT LIMO",
          model: "/models/land-rover.glb",
        } : index === 2 ? {
          ...car,
          id: "rolls-royce-cullinan-2025",
          brand: "ROLLS-ROYCE",
          name: "CULLINAN 2025",
          model: "/models/rolls-royce-cullinan.glb",
        } : index === 3 ? {
          ...car,
          id: "rolls-royce-phantom",
          brand: "ROLLS-ROYCE",
          name: "PHANTOM",
          model: "/models/rolls-phantom.glb",
        } : car),
      }))
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return banner;
}
