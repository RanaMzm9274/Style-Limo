import React,{useRef,useState} from "react";
import {Link,useNavigate} from "react-router-dom";
import {ArrowRight,ChevronLeft,ChevronRight} from "lucide-react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {useFleet} from "../../hooks/useFleet.js";
import {useBookingSettings} from "../../hooks/useBookingSettings.js";

export function Manifesto() {
  const ref = useRef();
  useGSAP(
    () => {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".manifest-line", {
        y: 100,
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          end: "top 25%",
          scrub: 1,
        },
      });
      gsap.to(".ghost-word", {
        xPercent: -25,
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: ref },
  );
  return (
    <section className="manifest" ref={ref}>
      <div className="ghost-word">PERFORMANCE</div>
      <div className="shell">
        <div className="section-no">02 — PHILOSOPHY</div>
        <h2>
          <span className="manifest-line">NOT JUST A RENTAL.</span>
          <span className="manifest-line muted">AN EXPERIENCE</span>
          <span className="manifest-line">ENGINEERED AROUND YOU.</span>
        </h2>
        <p>
          Exceptional machines. Impeccable service. Zero compromise between the
          moment you book and the moment you arrive.
        </p>
      </div>
    </section>
  );
}

export function Experience() {
  const {vehicles:cars}=useFleet();
  const mode = "chauffeur";
  return (
    <section className={"experience " + mode} id="experience">
      <div
        className="exp-bg"
        style={{
          backgroundImage: `url(${(cars[5]||cars.at(-1))?.image})`,
        }}
      />
      <div className="exp-shade" />
      <div className="shell exp-inner">
        <div className="section-no">03 — CHOOSE YOUR EXPERIENCE</div>
        <h2>
          HOW DO YOU
          <br />
          WANT TO <i>MOVE?</i>
        </h2>
        <div className="mode-tabs">
          <button
            aria-pressed={mode === "chauffeur"}
            onClick={() => setMode("chauffeur")}
            className={mode === "chauffeur" ? "active" : ""}
          >
            <small>01</small>
            <b>CHAUFFEUR</b>
            <span>Arrive effortlessly.</span>
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}

export function Fleet() {
  const {vehicles}=useFleet();
  const chauffeurCars=vehicles.filter(car=>car.categories.includes("CHAUFFEUR"));
  const limoCars=chauffeurCars.length?chauffeurCars:vehicles;
  const [idx, setIdx] = useState(0);
  const c = limoCars[idx];
  const change = (d) => setIdx((i) => (i + d + limoCars.length) % limoCars.length);
  return (
    <section className="fleet" id="fleet">
      <div className="shell">
        <div className="fleet-head">
          <div>
            <div className="section-no">04 — THE COLLECTION</div>
            <h2>
              THE <i>MACHINES.</i>
            </h2>
          </div>
          <div className="fleet-nav">
            <span>
              0{idx + 1} / 0{limoCars.length}
            </span>
            <button aria-label="Previous vehicle" onClick={() => change(-1)}>
              <ChevronLeft />
            </button>
            <button aria-label="Next vehicle" onClick={() => change(1)}>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="fleet-stage" key={idx}>
          <div className="fleet-name">
            <small>{c.brand}</small>
            <strong>{c.name}</strong>
          </div>
          <img src={c.image} alt={`${c.brand} ${c.name}`} loading="lazy" decoding="async" />
          <div className="fleet-specs">
            <div>
              <b>{c.power}</b>
              <span>POWER</span>
            </div>
            <div>
              <b>{c.speed}</b>
              <span>TOP SPEED</span>
            </div>
            <div>
              <b>{c.zero}</b>
              <span>0—62 MPH</span>
            </div>
          </div>
          <Link className="fleet-view" to={`/booking?vehicle=${encodeURIComponent(c.brand+" "+c.name)}`}>VIEW CAR <ArrowRight /></Link>
        </div>
        <div className="fleet-strip">
          {limoCars.map((x, i) => (
            <button
              key={x.name}
              className={i === idx ? "on" : ""}
              onClick={() => setIdx(i)}
            >
              <span>0{i + 1}</span>
              {x.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CarListing() {
  const {vehicles:cars}=useFleet();
  return (
    <section className="car-listing">
      <div className="shell">
        <div className="listing-head reveal-up">
          <div>
            <div className="section-no">07 — AVAILABLE NOW</div>
            <h2>
              FIND YOUR
              <br />
              <i>NEXT DRIVE.</i>
            </h2>
          </div>
          <a href="#fleet">
            VIEW FULL FLEET <ArrowRight />
          </a>
        </div>
        <div className="car-grid">
          {cars.slice(0, 6).map((c, i) => (
            <article className="car-card" key={c.name}>
              <div className="car-card-img">
                <img src={c.image} alt={`${c.brand} ${c.name}`} loading="lazy" decoding="async" />
                <div className="car-index">0{i + 1}</div>
                <div className="availability">AVAILABLE</div>
              </div>
              <div className="car-card-title">
                <div>
                  <small>{c.brand}</small>
                  <h3>{c.name}</h3>
                </div>
              </div>
              <div className="mini-specs">
                <span>{c.power}</span>
                <span>{c.zero} 0—62</span>
                <span>{c.speed}</span>
              </div>
              <Link to={`/booking?vehicle=${encodeURIComponent(c.brand+" "+c.name)}`}>RESERVE THIS CAR <ArrowRight size={15} /></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Numbers() {
  return (
    <section className="numbers">
      <div className="numbers-marquee">
        <div>
          PERFORMANCE · PRIVACY · PRECISION · PERFORMANCE · PRIVACY · PRECISION
          ·
        </div>
      </div>
      <div className="shell number-grid">
        <article>
          <b>
            24<span>/7</span>
          </b>
          <p>Concierge & chauffeur support</p>
        </article>
        <article>
          <b>
            30<span>+</span>
          </b>
          <p>Premium & performance vehicles</p>
        </article>
        <article>
          <b>
            15<span>MIN</span>
          </b>
          <p>Average booking response</p>
        </article>
        <article>
          <b>
            100<span>%</span>
          </b>
          <p>Detail-led service</p>
        </article>
      </div>
    </section>
  );
}

export function Chauffeur() {
  const {vehicles:cars}=useFleet();
  return (
    <section className="chauffeur" id="chauffeur">
      <div className="shell ch-grid">
        <div className="ch-copy">
          <div className="section-no dark">08 — CHAUFFEUR</div>
          <h2>
            DON'T
            <br />
            DRIVE.
            <br />
            <i>ARRIVE.</i>
          </h2>
          <p>
            Professional chauffeurs. Immaculate vehicles. Every detail handled —
            from airport runway to front door.
          </p>
          <a href="#booking">
            DISCOVER CHAUFFEUR <ArrowRight />
          </a>
        </div>
        <div className="ch-photo">
          <img src={(cars.find(car=>car.categories.includes("CHAUFFEUR"))||cars[0])?.image} alt="Chauffeur vehicle" loading="lazy" />
          <div className="ch-badge">
            <b>24/7</b>
            <span>
              PRIVATE
              <br />
              CHAUFFEUR
            </span>
          </div>
        </div>
      </div>
      <div className="shell services">
        {["AIRPORT TRANSFERS", "CORPORATE TRAVEL", "EVENTS & OCCASIONS"].map(
          (x, i) => (
            <Link to="/booking?service=Chauffeur" key={x}>
              <span>0{i + 1}</span>
              <b>{x}</b>
              <p>
                {i === 0
                  ? "Seamless airport collection with flight monitoring."
                  : i === 1
                    ? "Discreet, punctual executive travel on your schedule."
                    : "Make the entrance part of the occasion."}
              </p>
              <ArrowRight />
            </Link>
          ),
        )}
      </div>
    </section>
  );
}

export function Journey() {
  const ref = useRef();
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.to(".journey-track", {
        xPercent: -75,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=2800",
          pin: true,
          scrub: 1,
        },
      });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );
  const steps = [
    [
      "01",
      "SELECT",
      "Choose the machine or chauffeur experience that fits the moment.",
    ],
    [
      "02",
      "BOOK",
      "Reserve in minutes. Clear communication, no unnecessary friction.",
    ],
    [
      "03",
      "DRIVE",
      "We prepare every detail. You simply take the wheel — or the back seat.",
    ],
    [
      "04",
      "RETURN",
      "A seamless handover completes the experience. Until next time.",
    ],
  ];
  return (
    <section className="journey" ref={ref}>
      <div className="journey-title">
        <span>09 — THE JOURNEY</span>
        <h2>
          FOUR STEPS.
          <br />
          <i>ZERO FRICTION.</i>
        </h2>
      </div>
      <div className="journey-track">
        {steps.map((s) => (
          <article key={s[0]}>
            <small>{s[0]}</small>
            <h3>{s[1]}</h3>
            <p>{s[2]}</p>
            <div className="road">
              <span>→</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Destinations() {
  const items = [
    [
      "LONDON",
      "CITY",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    ],
    [
      "COTSWOLDS",
      "ESCAPE",
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=85",
    ],
    [
      "GOODWOOD",
      "MOTORSPORT",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=85",
    ],
  ];
  return (
    <section className="destinations">
      <div className="shell">
        <div className="listing-head reveal-up">
          <div>
            <div className="section-no">10 — GO FURTHER</div>
            <h2>
              CURATED
              <br />
              <i>ESCAPES.</i>
            </h2>
          </div>
          <p>
            Cars are only half the story. Discover routes and destinations worth
            driving for.
          </p>
        </div>
        <div className="destination-grid">
          {items.map((x, i) => (
            <article key={x[0]}>
              <img src={x[2]} alt={x[0]} loading="lazy" />
              <div className="destination-overlay">
                <small>
                  0{i + 1} / {x[1]}
                </small>
                <h3>{x[0]}</h3>
                <Link to={`/booking?service=Chauffeur&destination=${encodeURIComponent(x[0])}`}>PLAN THIS JOURNEY ↗</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reviews() {
  return (
    <section className="reviews">
      <div className="shell review-grid">
        <div>
          <div className="section-no">11 — CLIENT NOTES</div>
          <h2>
            THE EXPERIENCE,
            <br />
            <i>IN THEIR WORDS.</i>
          </h2>
        </div>
        <blockquote>
          <div className="quote-mark">“</div>
          <p>
            From the first message to the final handover, everything felt
            effortless. The car arrived immaculate and exactly on time.
          </p>
          <footer>— PRIVATE CLIENT, LONDON</footer>
        </blockquote>
      </div>
    </section>
  );
}

export function Booking() {
  const {vehicles:cars}=useFleet();
  const settings=useBookingSettings();
  const navigate = useNavigate();
  return (
    <section className="booking" id="booking">
      <div className="shell booking-grid">
        <div>
          <div className="section-no">12 — RESERVE</div>
          <h2>
            READY
            <br />
            WHEN <i>YOU ARE.</i>
          </h2>
          <p>
            Tell us how you want to move. We'll take care of everything else.
          </p>
        </div>
        <form onSubmit={(e) => {e.preventDefault(); navigate("/booking?" + new URLSearchParams(new FormData(e.currentTarget)));}}>
          <label>
            <span>01 / SERVICE</span>
            <select name="service">{settings.services.map(service=><option key={service}>{service}</option>)}</select>
          </label>
          <label>
            <span>02 / VEHICLE</span>
            <select name="vehicle">
              {cars.filter(c=>c.available).map((c) => (
                <option key={c.name}>
                  {c.brand} {c.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              <span>03 / DATE</span>
              <input name="date" type="date" min={new Date(Date.now()+settings.minimumNoticeDays*86400000).toISOString().slice(0,10)} />
            </label>
            <label>
              <span>04 / DURATION</span>
              <select name="duration">{settings.durations.map(duration=><option key={duration}>{duration}</option>)}</select>
            </label>
          </div>
          <button className="reserve">
            REQUEST RESERVATION <ArrowRight />
          </button>
        </form>
      </div>
    </section>
  );
}
