import React from "react";
import { ArrowRight } from "lucide-react";
import { cars } from "../../data/cars.js";

const Block = ({ name, children, copy }) => (
  <section className={name}>
    <div className="shell">
      {children || (
        <>
          <h2>{name.toUpperCase()}</h2>
          {copy && <p className="section-copy">{copy}</p>}
          <a className="section-action" href="#booking">
            EXPLORE THE EXPERIENCE <ArrowRight size={15} />
          </a>
        </>
      )}
    </div>
  </section>
);

export const Manifesto = () => (
  <Block name="manifest">
    <h2>
      NOT JUST A RENTAL.
      <br />
      <i>AN EXPERIENCE</i>
      <br />
      ENGINEERED AROUND YOU.
    </h2>
  </Block>
);
export const Experience = () => (
  <Block name="experience">
    <h2>
      HOW DO YOU
      <br />
      WANT TO <i>MOVE?</i>
    </h2>
    <div className="mode-tabs">
      <button className="active">
        <small>01</small>
        <b>CHAUFFEUR</b>
        <span>Arrive effortlessly.</span>
        <ArrowRight />
      </button>
      <button>
        <small>02</small>
        <b>SELF DRIVE</b>
        <span>Take control.</span>
        <ArrowRight />
      </button>
    </div>
  </Block>
);
export const Fleet = () => (
  <Block name="fleet">
    <h2>
      THE <i>MACHINES.</i>
    </h2>
    <div className="fleet-preview-grid">
      {cars.slice(0, 3).map((car) => (
        <article key={car.name}>
          <img src={car.image} loading="lazy" />
          <small>{car.brand}</small>
          <h3>{car.name}</h3>
        </article>
      ))}
    </div>
  </Block>
);
export const CarListing = () => (
  <Block name="car-listing">
    <h2>
      FIND YOUR <i>NEXT DRIVE.</i>
    </h2>
    <div className="fleet-preview-grid">
      {cars.slice(3).map((car) => (
        <article key={car.name}>
          <img src={car.image} loading="lazy" />
          <small>{car.brand}</small>
          <h3>{car.name}</h3>
        </article>
      ))}
    </div>
  </Block>
);
export const Numbers = () => (
  <Block name="numbers">
    <div className="number-grid">
      <article>
        <b>
          24<span>/7</span>
        </b>
        <p>Concierge support</p>
      </article>
      <article>
        <b>
          30<span>+</span>
        </b>
        <p>Premium vehicles</p>
      </article>
      <article>
        <b>
          15<span> MIN</span>
        </b>
        <p>Average response</p>
      </article>
    </div>
  </Block>
);
export const Chauffeur = () => (
  <Block name="chauffeur">
    <h2>
      DON'T DRIVE.
      <br />
      <i>ARRIVE.</i>
    </h2>
    <p className="section-copy">
      Professional chauffeurs, immaculate vehicles and every detail handled from
      runway to front door.
    </p>
  </Block>
);
export const Journey = () => (
  <Block name="journey">
    <h2>
      FOUR STEPS.
      <br />
      <i>ZERO FRICTION.</i>
    </h2>
    <div className="journey-mini">
      <span>01 SELECT</span>
      <span>02 BOOK</span>
      <span>03 DRIVE</span>
      <span>04 RETURN</span>
    </div>
  </Block>
);
export const Destinations = () => (
  <Block name="destinations">
    <h2>
      CURATED <i>ESCAPES.</i>
    </h2>
    <p className="section-copy">Routes and destinations worth driving for.</p>
  </Block>
);
export const Reviews = () => (
  <Block name="reviews">
    <h2>
      THE EXPERIENCE,
      <br />
      <i>IN THEIR WORDS.</i>
    </h2>
    <blockquote>
      “Everything felt effortless. The car arrived immaculate and exactly on
      time.”
    </blockquote>
  </Block>
);
export const Booking = () => (
  <Block name="booking">
    <h2>
      READY WHEN <i>YOU ARE.</i>
    </h2>
    <p className="section-copy">
      Tell us how you want to move. We’ll take care of everything else.
    </p>
    <a className="section-action" href="/booking">
      REQUEST A RESERVATION <ArrowRight size={15} />
    </a>
  </Block>
);
