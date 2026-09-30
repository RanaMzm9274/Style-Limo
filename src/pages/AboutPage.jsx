import React,{useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {ArrowRight,ArrowDown} from "lucide-react";
import {cars} from "../data/cars.js";
import PageHero from "./PageHero.jsx";
import {Numbers,Reviews,Journey} from "../components/sections/HomeSections.jsx";
export default function AboutPage() {
  return (
    <>
      <PageHero
        index="01"
        kicker="OUR STORY"
        title="BUILT FOR"
        accent="THE JOURNEY."
        copy="A modern luxury mobility company built around remarkable cars, meticulous service and the freedom to move differently."
        image={cars[2].image}
      />
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
              Whether you are travelling across town or across the country, the
              standard stays the same: exceptional vehicles, attentive service
              and obsessive attention to detail.
            </p>
          </div>
        </div>
      </section>
      <Numbers />
      <section className="values">
        <div className="shell">
          <div className="listing-head">
            <div>
              <div className="section-no">03 — OUR STANDARD</div>
              <h2>
                WHAT WE
                <br />
                <i>BELIEVE.</i>
              </h2>
            </div>
          </div>
          <div className="value-grid">
            {[
              ["01", "DETAIL", "The small things are the experience."],
              [
                "02",
                "DISCRETION",
                "Premium service without unnecessary noise.",
              ],
              ["03", "PERFORMANCE", "Vehicles and people chosen to deliver."],
              ["04", "TIME", "Punctuality is a non-negotiable."],
            ].map((v) => (
              <article key={v[0]}>
                <span>{v[0]}</span>
                <h3>{v[1]}</h3>
                <p>{v[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Reviews />
      
    </>
  );
}
