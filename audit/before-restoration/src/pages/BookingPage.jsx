import React,{useState} from "react";
import {Link} from "react-router-dom";
import {ArrowRight} from "lucide-react";
import Footer from "../components/layout/Footer.jsx";
import {cars} from "../data/cars.js";
function BookingPage() {
  const [step, setStep] = useState(1),
    [done, setDone] = useState(false);
  const [form, setForm] = useState({
    service: "Self Drive",
    vehicle: "Porsche 911 GT3",
    date: "",
    duration: "2 Days",
    name: "",
    email: "",
    phone: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  if (done)
    return (
      <>
        <section className="booking-success">
          <div className="shell">
            <span>REQUEST RECEIVED</span>
            <h1>
              YOUR JOURNEY
              <br />
              <i>STARTS HERE.</i>
            </h1>
            <p>
              Thanks {form.name || "there"}. Our concierge team will review your
              request and contact you with availability.
            </p>
            <Link to="/">
              RETURN HOME <ArrowRight />
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  return (
    <>
      <section className="booking-page">
        <div className="shell booking-page-grid">
          <div className="booking-aside">
            <div className="section-no">01 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â¦ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â RESERVATION</div>
            <h1>
              BOOK
              <br />
              <i>YOUR DRIVE.</i>
            </h1>
            <p>
              Build your request in three quick steps. No payment is taken at
              this stage.
            </p>
            <div className="step-list">
              {["EXPERIENCE", "DATES", "YOUR DETAILS"].map((x, i) => (
                <div
                  className={
                    step === i + 1 ? "active" : step > i + 1 ? "done" : ""
                  }
                >
                  <span>0{i + 1}</span>
                  {x}
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 3) setStep(step + 1);
              else setDone(true);
            }}
            className="booking-wizard"
          >
            {step === 1 && (
              <div className="wizard-panel">
                <small>STEP 01</small>
                <h2>CHOOSE YOUR EXPERIENCE</h2>
                <label>
                  SERVICE
                  <select
                    value={form.service}
                    onChange={(e) => set("service", e.target.value)}
                  >
                    <option>Self Drive</option>
                    <option>Private Chauffeur</option>
                    <option>Airport Transfer</option>
                  </select>
                </label>
                <label>
                  VEHICLE
                  <select
                    value={form.vehicle}
                    onChange={(e) => set("vehicle", e.target.value)}
                  >
                    {cars.map((c) => (
                      <option>
                        {c.brand} {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="wizard-panel">
                <small>STEP 02</small>
                <h2>WHEN ARE YOU MOVING?</h2>
                <label>
                  START DATE
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </label>
                <label>
                  DURATION
                  <select
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  >
                    <option>1 Day</option>
                    <option>2 Days</option>
                    <option>Weekend</option>
                    <option>1 Week</option>
                    <option>Long Term</option>
                  </select>
                </label>
              </div>
            )}
            {step === 3 && (
              <div className="wizard-panel">
                <small>STEP 03</small>
                <h2>YOUR DETAILS</h2>
                <label>
                  FULL NAME
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  EMAIL
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@email.com"
                  />
                </label>
                <label>
                  PHONE
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+44"
                  />
                </label>
              </div>
            )}
            <div className="wizard-actions">
              {step > 1 && (
                <button
                  type="button"
                  className="back"
                  onClick={() => setStep(step - 1)}
                >
                  ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Â ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Â¦Ãƒâ€šÃ‚Â¡ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â BACK
                </button>
              )}
              <button type="submit" className="next">
                {step === 3 ? "SEND REQUEST" : "CONTINUE"} <ArrowRight />
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default BookingPage;

