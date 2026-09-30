import React from "react";
import {Link} from "react-router-dom";
import {ArrowRight} from "lucide-react";
import {cars} from "../data/cars.js";
import PageHero from "./PageHero.jsx";
import ServicesGrid from "../components/sections/ServicesGrid.jsx";
import {Numbers,Reviews,Journey} from "../components/sections/HomeSections.jsx";
export default function ServicesPage() {
  return (
    <>
      <PageHero
        index="01"
        kicker="SERVICES"
        title="MOVE ON"
        accent="YOUR TERMS."
        copy="Professional chauffeur travel and tailored mobility for the moments that matter."
        image={cars[5].image}
      />
      <ServicesGrid />
      <section className="service-detail">
        <div className="shell">
          {[
            [
              "01",
              "CHAUFFEUR TRAVEL",
              "A discreet, door-to-door service for airport arrivals, meetings and days when the journey matters as much as the destination.",
            ],
            [
              "02",
              "PERFORMANCE HIRE",
              "Choose your vehicle and route. Every journey is prepared around your dates and preferences with a professional chauffeur.",
            ],
            [
              "03",
              "BESPOKE PROGRAMMES",
              "For events, extended stays and complex itineraries, we coordinate vehicles, drivers and timing through one dedicated contact.",
            ],
          ].map((s, i) => (
            <article key={s[0]}>
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
      <section className="service-process">
        <div className="shell">
          <div className="service-section-head">
            <div className="section-no">07 — HOW IT WORKS</div>
            <h2>BUILT AROUND<br /><i>YOUR TIME.</i></h2>
            <p>One point of contact, carefully selected vehicles and a clear plan from collection to return.</p>
          </div>
          <div className="process-grid">
            {[
              ["01", "TELL US THE PLAN", "Share your dates, route and preferences. We will shape the right vehicle and service around them."],
              ["02", "WE CURATE THE DETAIL", "Your vehicle is prepared, your itinerary confirmed and every handover arranged before you arrive."],
              ["03", "MOVE WITH CONFIDENCE", "Enjoy the journey with responsive support throughout, whenever you need it."],
            ].map(([no, title, copy]) => <article key={no}><span>{no}</span><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
        </div>
      </section>
      <section className="service-promise">
        <div className="shell service-promise-inner">
          <div><div className="section-no">08 — THE PROMISE</div><h2>QUIETLY<br /><i>EXCEPTIONAL.</i></h2></div>
          <div className="promise-list">
            {["A real person available when it matters.", "Vehicles prepared to an exacting standard.", "Clear communication, no surprises."].map((item, i) => <div key={item}><span>0{i + 1}</span><p>{item}</p></div>)}
          </div>
        </div>
      </section>
      <Journey />
      
    </>
  );
}
