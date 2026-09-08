import React from "react";
import {ArrowRight} from "lucide-react";
import PageHero from "./PageHero.jsx";
import Footer from "../components/layout/Footer.jsx";
import ServicesGrid from "../components/sections/ServicesGrid.jsx";
import {Journey} from "../components/sections/HomeSections.jsx";
function ServicesPage() {
  return (
    <>
      <PageHero
        index="01"
        kicker="SERVICES"
        title="MOVE ON"
        accent="YOUR TERMS."
        copy="Self-drive performance, professional chauffeur travel and tailored mobility for the moments that matter."
        image={cars[5].image}
      />
      <ServicesGrid />
      <section className="service-detail">
        <div className="shell">
          {[
            [
              "01",
              "PRIVATE CHAUFFEUR",
              "Airport transfers, corporate travel and private events handled by professional chauffeurs with discreet door-to-door service.",
            ],
            [
              "02",
              "SELF DRIVE",
              "Choose from our curated performance fleet, reserve your dates and take control of the journey.",
            ],
            [
              "03",
              "BESPOKE MOBILITY",
              "Multi-car events, long-term hire and tailored itineraries designed around complex schedules.",
            ],
          ].map((s, i) => (
            <article>
              <div className="service-big-no">{s[0]}</div>
              <div>
                <h2>{s[1]}</h2>
                <p>{s[2]}</p>
                <Link to="/booking">
                  MAKE AN ENQUIRY <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Journey />
      <Footer />
    </>
  );
}

export default ServicesPage;
