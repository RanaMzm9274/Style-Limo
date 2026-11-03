import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { sortFleetRollsRoyceFirst, useFleet } from "../hooks/useFleet.js";
import PageHero from "./PageHero.jsx";
import ThreeDConfigurator from "../components/three/ThreeDConfigurator.jsx";

export default function FilteredFleetPage() {
  const { categories, vehicles: cars } = useFleet();
  const orderedCars = sortFleetRollsRoyceFirst(cars);
  const [filter, setFilter] = useState("ALL");
  useEffect(() => {
    if (filter !== "ALL" && !categories.includes(filter)) setFilter("ALL");
  }, [categories, filter]);
  const visible =
    filter === "ALL"
      ? orderedCars
      : orderedCars.filter((car) => car.categories.includes(filter));
  return (
    <>
      <PageHero
        index="01"
        kicker="THE FLEET"
        title="CHOOSE YOUR"
        accent="MACHINE."
        copy="A curated collection of performance, grand touring, SUV and chauffeur vehicles."
        image={orderedCars[0]?.image}
      />
      <section className="fleet-page">
        <div className="shell">
          <div className="filter-bar">
            {["ALL", ...categories].map((category) => (
              <button
                type="button"
                key={category}
                className={filter === category ? "on" : ""}
                aria-pressed={filter === category}
                onClick={() => setFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="car-grid">
            {visible.map((car, index) => (
              <article
                className={`car-card${car.id === "rolls-royce-phantom" ? " phantom-card" : ""}${car.id === "hummer-stretch-limo" ? " hummer-card" : ""}${car.hoverImage ? " has-hover-image" : ""}`}
                key={car.id}
              >
                <div className="car-card-img">
                  <img
                    src={car.image}
                    alt={`${car.brand} ${car.name}`}
                    loading="lazy"
                    decoding="async"
                  />
                  {car.hoverImage && (
                    <>
                      <img
                        className="car-card-img-alt"
                        src={car.hoverImage}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="car-card-img-label">DETAIL VIEW</span>
                    </>
                  )}
                  <div className="car-index">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="availability">
                    {car.available ? "AVAILABLE" : "UNAVAILABLE"}
                  </div>
                </div>
                <div className="car-card-title">
                  <div>
                    <small>{car.brand}</small>
                    <h3>{car.name}</h3>
                  </div>
                </div>
                <div className="mini-specs">
                  <span>{car.power}</span>
                  <span>{car.acceleration} 0—62</span>
                  <span>{car.topSpeed}</span>
                </div>
                {car.available ? (
                  <Link
                    to={`/booking?vehicle=${encodeURIComponent(`${car.brand} ${car.name}`)}`}
                  >
                    RESERVE THIS CAR <ArrowRight size={15} />
                  </Link>
                ) : (
                  <span className="car-unavailable">CURRENTLY UNAVAILABLE</span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <ThreeDConfigurator />
    </>
  );
}
