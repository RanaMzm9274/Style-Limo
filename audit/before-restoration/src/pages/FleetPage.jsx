import React,{useState} from "react";
import {Link} from "react-router-dom";
import {ArrowRight} from "lucide-react";
import PageHero from "./PageHero.jsx";
import Footer from "../components/layout/Footer.jsx";
import ThreeDConfigurator from "../components/three/ThreeDConfigurator.jsx";
import {cars} from "../data/cars.js";

function FilteredFleetPage() {
  const [filter, setFilter] = useState("ALL");
  const groups = {
    PERFORMANCE: [0, 1, 2],
    LUXURY: [3, 4, 5],
    SUV: [4],
    CHAUFFEUR: [3, 5],
  };
  const visible =
    filter === "ALL" ? cars : cars.filter((_, i) => groups[filter].includes(i));
  return (
    <>
      <PageHero
        index="01"
        kicker="THE FLEET"
        title="CHOOSE YOUR"
        accent="MACHINE."
        copy="A curated collection of performance, grand touring, SUV and chauffeur vehicles."
        image={cars[0].image}
      />
      <section className="fleet-page">
        <div className="shell">
          <div className="filter-bar">
            {["ALL", "PERFORMANCE", "LUXURY", "SUV", "CHAUFFEUR"].map((x) => (
              <button
                type="button"
                key={x}
                className={filter === x ? "on" : ""}
                onClick={() => setFilter(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="car-grid">
            {visible.map((c, i) => (
              <article className="car-card" key={c.name}>
                <div className="car-card-img">
                  <img src={c.image} loading="lazy" decoding="async" />
                  <div className="car-index">0{i + 1}</div>
                  <div className="availability">AVAILABLE</div>
                </div>
                <div className="car-card-title">
                  <div>
                    <small>{c.brand}</small>
                    <h3>{c.name}</h3>
                  </div>
                  <b>
                    {c.price === "POA" ? "POA" : `ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â£${c.price}`}
                    <small>{c.price === "POA" ? "" : " / DAY"}</small>
                  </b>
                </div>
                <div className="mini-specs">
                  <span>{c.power}</span>
                  <span>{c.zero} 0ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â62</span>
                  <span>{c.speed}</span>
                </div>
                <Link to="/booking">
                  RESERVE THIS CAR <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ThreeDConfigurator />
      <Footer />
    </>
  );
}

export default FilteredFleetPage;

