import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {ArrowRight, Plus, CalendarDays, Check} from "lucide-react";
import {useBookingSettings} from "../../hooks/useBookingSettings.js";

export function QuickReservation() {
  const settings = useBookingSettings();
  const navigate = useNavigate();
  const earliest = new Date();
  earliest.setDate(earliest.getDate() + settings.minimumNoticeDays);
  const minDate = `${earliest.getFullYear()}-${String(earliest.getMonth()+1).padStart(2,"0")}-${String(earliest.getDate()).padStart(2,"0")}`;
  return <section className="quick-reservation" aria-labelledby="quick-reservation-title">
    <div className="shell">
      <div className="quick-reservation-top"><span><CalendarDays size={16}/> YOUR NEXT ARRIVAL</span><span>YOUR PLANS. OUR ATTENTION TO DETAIL.</span></div>
      <div className="quick-reservation-body">
        <div><h2 id="quick-reservation-title">MAKE IT <i>EFFORTLESS.</i></h2><p>A few details. A journey built around you.</p></div>
        <form onSubmit={event=>{event.preventDefault();navigate(`/booking?${new URLSearchParams(new FormData(event.currentTarget))}`)}}>
          <label>EXPERIENCE<select name="service" required>{settings.services.map(service=><option key={service}>{service}</option>)}</select></label>
          <label>TRAVEL DATE<input name="date" type="date" min={minDate} required/></label>
          <label>DURATION<select name="duration" required>{settings.durations.map(duration=><option key={duration}>{duration}</option>)}</select></label>
          <button type="submit">PLAN MY JOURNEY <ArrowRight size={18}/></button>
        </form>
      </div>
      <div className="quick-reservation-note"><Check size={14}/><span>No payment at this stage. Availability confirmed by our team.</span></div>
    </div>
  </section>;
}

const questions = [
  ["How do I request a booking?", "Choose your experience, travel date and duration, then select a vehicle and add your contact details on our reservation page. Our team will review your request and contact you with availability."],
  ["Is my booking confirmed when I send a request?", "Submitting a request starts the conversation. Your journey is confirmed separately with our team once availability and the arrangements have been agreed."],
  ["What should I share for an airport transfer?", "Have your airport, flight number, arrival or departure time, collection address and destination ready. Let our team know your passenger count and luggage requirements so they can help select a suitable vehicle."],
  ["How do I choose the right vehicle?", "Explore our fleet and select your preferred vehicle when requesting a reservation. Share the number of passengers, luggage and any special requirements with our team so suitability can be checked before confirmation."],
  ["Can I arrange travel for a wedding or business event?", "Yes. Our services include corporate travel, weddings and special occasions. Share your itinerary, timings and preferred vehicle with our team to discuss the arrangements."],
  ["Can I change my plans after sending an enquiry?", "Contact our team with your booking details and the changes you need. Revised arrangements depend on availability and the terms agreed for your booking."],
];

export function JourneyQuestions() {
  return <section className="journey-questions" aria-labelledby="journey-questions-title"><div className="shell journey-questions-grid">
    <div className="journey-questions-intro"><div className="section-no">BEFORE YOU SET OFF</div><h2 id="journey-questions-title">A LITTLE CLARITY.<br/><i>A BETTER JOURNEY.</i></h2><p>From choosing your vehicle to planning an airport arrival, start with the details that matter.</p><Link to="/booking">LET’S TALK ABOUT YOUR PLANS <ArrowRight size={18}/></Link><div className="journey-questions-mark" aria-hidden="true">SEL<span>CONSIDERED AT EVERY TURN.</span></div></div>
    <div className="journey-questions-list">{questions.map(([question,answer],index)=><details key={question}><summary><span className="question-index">0{index+1}</span><span>{question}</span><Plus size={18}/></summary><p>{answer}</p></details>)}</div>
  </div></section>;
}
