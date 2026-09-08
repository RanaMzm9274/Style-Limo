import React from "react";
import {ArrowRight} from "lucide-react";
function ServicesGrid() {
  const services = [
    [
      "01",
      "PRIVATE CHAUFFEUR",
      "Door-to-door luxury travel with professional chauffeurs.",
      "EXECUTIVE",
    ],
    [
      "02",
      "SELF DRIVE",
      "Performance cars delivered ready for your own journey.",
      "PERFORMANCE",
    ],
    [
      "03",
      "AIRPORT TRANSFER",
      "Flight-monitored collection and effortless airport transfers.",
      "24 / 7",
    ],
    [
      "04",
      "WEDDINGS & EVENTS",
      "Statement vehicles and discreet chauffeur service for big moments.",
      "OCCASIONS",
    ],
    [
      "05",
      "CORPORATE",
      "Executive mobility for meetings, roadshows and VIP guests.",
      "BUSINESS",
    ],
    [
      "06",
      "LONG TERM HIRE",
      "Flexible premium vehicle hire for extended stays and projects.",
      "FLEXIBLE",
    ],
  ];
  return (
    <section className="service-grid-section" id="services">
      <div className="shell">
        <div className="grid-heading reveal-up">
          <div className="grid-heading-label">
            <div className="section-no">06 ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â WHAT WE DO</div>
            <div className="service-intro-mark">
              <span>DRIVE / PRIVÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â°</span>
              <i />
            </div>
            <p className="service-intro-note">
              One considered standard, applied to every mile.
            </p>
          </div>
          <div>
            <h2>
              ONE STANDARD.
              <br />
              <i>EVERY JOURNEY.</i>
            </h2>
            <p>
              From a single airport transfer to a weekend behind the wheel,
              every service is designed around time, privacy and detail.
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
                <span>ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â</span>
              </div>
              <div>
                <h3>{s[1]}</h3>
                <p>{s[2]}</p>
              </div>
              <a href="#booking">
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
