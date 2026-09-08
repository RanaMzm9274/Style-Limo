import { useEffect, useState } from "react";
import { configuratorCars } from "../data/cars.js";

export const defaultBanner = {
  eyebrow: "EXCEPTIONAL CARS. EXTRAORDINARY JOURNEYS.",
  headingLine1: "Beyond the",
  headingLine2: "ordinary.",
  taglineLine1: "For the drive. For the arrival.",
  taglineLine2: "For the moments that stay with you.",
  cars: configuratorCars,
};

export function useBanner() {
  const [banner, setBanner] = useState(defaultBanner);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/public/banner", { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setBanner)
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return banner;
}
