import React from "react";
import ServicesGrid from "../components/sections/ServicesGrid.jsx";
import SelBanner from "../components/sections/SelBanner.jsx";
import {Manifesto,Experience,Fleet,CarListing,Numbers,Chauffeur,Journey,Destinations,Reviews,Booking} from "../components/sections/HomeSections.jsx";
function HomePage() {
  return (
    <>
      <main>
        <SelBanner />
        <section className="page-intro">
          <div className="shell split-copy">
            <div>
              <div className="section-no">02 — THE IDEA</div>
              <h2>
                MORE THAN
                <br />A <i>KEY HANDOVER.</i>
              </h2>
            </div>
            <div>
              <p>
                STYLE EXPRESS LIMO brings performance rental and chauffeur travel into
                one considered experience. Every touchpoint is designed to feel
                calm, precise and personal.
              </p>
              <p>
                Whether you take the wheel or the rear seat, the standard stays
                the same: exceptional vehicles, transparent service and obsessive
                attention to detail.
              </p>
            </div>
          </div>
        </section>
        <Manifesto />
        <ServicesGrid />
        <CarListing />
        <Fleet />
        <Experience />
        <Numbers />
        <Chauffeur />
        <Journey />
        <Destinations />
        <Reviews />
        <Booking />
      </main>

    </>
  );
}

export default HomePage;
