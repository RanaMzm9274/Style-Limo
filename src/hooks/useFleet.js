import { useEffect, useState } from "react";
import { cars as fallbackCars } from "../data/cars.js";

export const fallbackFleet = {
  categories: ["PERFORMANCE", "LUXURY", "SUV", "CHAUFFEUR", "WEDDING", "STRETCH LIMO"],
  vehicles: fallbackCars.map((car, index) => ({
    ...car,
    id: `fallback-${index}`,
    categories: ["LUXURY", "CHAUFFEUR"],
    variations: [],
    colors: [],
    model: car.name,
    engineCapacity: "—",
    topSpeed: car.speed,
    acceleration: car.zero,
    available: true,
  })),
};

// Canonical client fleet. Every public fleet surface consumes this normalized list.
const clientFleet = [
  {
    id: "ferrari-f430-limo",
    brand: "FERRARI",
    name: "Ferrari 360 Modena Stretch Limousine",
    categories: ["PERFORMANCE", "STRETCH LIMO"],
    variations: ["Show car", "Private hire"],
    colors: ["Rosso Corsa"],
    model: "/models/ferrari_f430_limo.glb",
    engineCapacity: "4.3L V8",
    power: "490 PS",
    topSpeed: "196 MPH",
    acceleration: "4.0 SEC",
    price: "495",
    image: "/images/fleet/ferrrari-360.png",
    available: true,
  },
  {
    id: "hummer-stretch-limo",
    brand: "HUMMER",
    name: "Hummer H2 LIMO",
    categories: ["STRETCH LIMO", "CHAUFFEUR"],
    variations: ["Party hire", "Group hire"],
    colors: ["White"],
    model: "Hummer H2 Stretch",
    engineCapacity: "6.0L V8",
    power: "325 PS",
    topSpeed: "100 MPH",
    acceleration: "10.0 SEC",
    price: "POA",
    image: "/images/fleet/hummer-h2.png",
    available: true,
  },
  {
    id: "land-rover-sport-limo",
    brand: "RANGE ROVER",
    name: "Rangerover Sport limo",
    categories: ["LUXURY", "SUV", "STRETCH LIMO", "CHAUFFEUR"],
    variations: ["Executive transfer", "Group hire"],
    colors: ["White"],
    model: "/models/land-rover.glb",
    engineCapacity: "5.0L V8",
    power: "510 PS",
    topSpeed: "140 MPH",
    acceleration: "5.8 SEC",
    price: "495",
    image: "/images/fleet/landrover.jpeg",
    available: true,
  },
  {
    id: "rolls-royce-cullinan-2025",
    brand: "ROLLS-ROYCE",
    name: "Rolls Royce Cullinan",
    categories: ["LUXURY", "SUV", "CHAUFFEUR"],
    variations: ["Red interior", "Executive transfer"],
    colors: ["White"],
    model: "/models/rolls-royce-cullinan.glb",
    engineCapacity: "6.75L V12",
    power: "563 PS",
    topSpeed: "155 MPH",
    acceleration: "5.2 SEC",
    price: "1,950",
    image: "/images/fleet/cullinnan1.png",
    interiorImage: "/images/fleet/cullinnan1.png",
    available: true,
  },
  {
    id: "rolls-royce-phantom-limo",
    brand: "ROLLS-ROYCE",
    name: "Rolls Royce Phantom Limo",
    categories: ["LUXURY", "CHAUFFEUR"],
    variations: ["Executive transfer", "Wedding hire"],
    colors: ["White"],
    model: "/models/rolls-phantom.glb",
    engineCapacity: "6.75L V12",
    power: "563 PS",
    topSpeed: "155 MPH",
    acceleration: "5.4 SEC",
    price: "2,250",
    image: "/images/fleet/phantom-limo.png",
    available: true,
  },
   {
    id: "rolls-royce-ghost",
    brand: "ROLLS-ROYCE",
    name: "Rolls Royce Ghost",
    categories: ["LUXURY", "CHAUFFEUR"],
    variations: ["Executive transfer", "Wedding hire"],
    colors: ["White"],
    model: "/models/rolls-phantom.glb",
    engineCapacity: "6.75L V12",
    power: "563 PS",
    topSpeed: "155 MPH",
    acceleration: "5.4 SEC",
    price: "2,250",
    image: "/images/fleet/Ghost1.png",
    available: true,
  },
  {
    id: "rolls-royce-drophead",
    brand: "ROLLS-ROYCE",
    name: "Rolls Royce Drophead Coupe",
    categories: ["LUXURY", "WEDDING"],
    variations: ["Convertible", "Wedding hire"],
    colors: ["White"],
    model: "Rolls-Royce Drophead Coupe",
    engineCapacity: "6.75L V12",
    power: "453 PS",
    topSpeed: "150 MPH",
    acceleration: "5.7 SEC",
    price: "POA",
    image: "/images/fleet/drophead-coupe.png",
    available: true,
  },
  {
    id: "rolls-royce-phantom",
    brand: "ROLLS-ROYCE",
    name: "Rolls Royce Phantom",
    categories: ["LUXURY", "WEDDING"],
    variations: ["Convertible", "Wedding hire"],
    colors: ["White"],
    model: "Rolls-Royce Drophead Coupe",
    engineCapacity: "6.75L V12",
    power: "453 PS",
    topSpeed: "150 MPH",
    acceleration: "5.7 SEC",
    price: "POA",
    image: "/images/fleet/phantom1.png",
    available: true,
  },
  {
    id: "vintage-wedding-tourer",
    brand: "VINTAGE CLASSICS",
    name: "VINTAGE CAR",
    categories: ["WEDDING", "CHAUFFEUR"],
    variations: ["Classic wedding car"],
    colors: ["Ivory"],
    model: "Vintage Wedding Car",
    engineCapacity: "Classic",
    power: "—",
    topSpeed: "—",
    acceleration: "—",
    price: "POA",
    image: "/images/fleet/vintage.jpeg",
    available: true,
  },
];

const normalize = (data) => ({
  categories: [...new Set([...data.categories, ...clientFleet.flatMap((car) => car.categories)])],
  vehicles: clientFleet,
});

let cached;
let pending;
const load = () => cached ? Promise.resolve(cached) : (pending ||= fetch("/api/public/fleet").then((response) => response.ok ? response.json() : Promise.reject()).then((data) => (cached = normalize(data))).finally(() => { pending = null; }));

export function useFleet() {
  const [fleet, setFleet] = useState(cached || normalize(fallbackFleet));
  useEffect(() => {
    let active = true;
    load().then((data) => active && setFleet(data)).catch(() => {});
    return () => { active = false; };
  }, []);
  return fleet;
}

export function refreshFleetCache(data) {
  cached = normalize(data);
}
