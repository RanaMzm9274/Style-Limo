import React from "react";
import {ArrowRight} from "lucide-react";
function ServicesGrid() {
  const services = [
    [
      "01",
      "AIRPORT TRANSFERS",
      "Flight-monitored collection with a calm, punctual arrival.",
      "ARRIVALS",
    ],
    [
      "02",
      "CORPORATE TRAVEL",
      "Executive movement for meetings, roadshows and VIP guests.",
      "BUSINESS",
    ],
    [
      "03",
      "WEDDINGS & EVENTS",
      "Statement vehicles and discreet support for important occasions.",
      "OCCASIONS",
    ],
    [
      "04",
      "VEHICLE DELIVERY",
      "Your chosen car delivered prepared and ready wherever you need it.",
      "DOOR TO DOOR",
    ],
    [
      "05",
      "LONG TERM HIRE",
      "Flexible premium vehicle hire for extended stays and projects.",
      "FLEXIBLE",
    ],
    [
      "06",
      "CONCIERGE SUPPORT",
      "A responsive point of contact before, during and after every journey.",
      "24 / 7",
    ],
  ];
  return (
    <section className="service-grid-section" id="services">
      <div className="shell">
        <div className="grid-heading reveal-up">
          <div className="grid-heading-label">
            <div className="section-no">06 — WHAT WE DO</div>
            <div className="service-intro-copy">
              <span className="service-intro-kicker">THE STYLE EXPRESS LIMO STANDARD</span>
              <p>
                From airport arrivals to important occasions, choose the
                support that fits the way you need to move.
              </p>
            </div>
            <div className="service-intro-mark">
              <span>STYLE EXPRESS LIMO</span>
              <i />
            </div>
            <div className="service-intro-note-wrap">
              <p className="service-intro-note">Considered support for every kind of journey.</p>
              <div className="service-intro-stats" aria-label="Service highlights">
                <span><b>24/7</b>CONCIERGE</span>
                <span><b>30+</b>VEHICLES</span>
                <span><b>15 MIN</b>RESPONSE</span>
              </div>
            </div>
          </div>
          <div>
            <h2>
              MADE FOR
              <br />
              <i>THE MOMENT.</i>
            </h2>
            <p>
              Select the support around your day. We handle the details so the
              journey feels effortless from the first mile.
            </p>
          </div>
        </div>
        <div className="service-grid">
          {services.map((s, i) => (
            <article className={"service-card service-card-" + i} key={s[1]}>
              <div className="service-card-top">
                <span>{s[0]}</span>
                <small>{s[3]}</small>
              </div>
              <div className="service-icon">
                <span>↗</span>
              </div>
              <div>
                <h3>{s[1]}</h3>
                <p>{s[2]}</p>
              </div>
              <a href="/booking">
                EXPLORE <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesGrid;
