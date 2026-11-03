import React,{useState} from 'react';

export default function EnquiryForm({minimumNoticeDays=0,initialPickup=''}) {
 const [busy,setBusy]=useState(false),[status,setStatus]=useState(''),[sent,setSent]=useState(false);
 const earliest=new Date();earliest.setDate(earliest.getDate()+minimumNoticeDays);
 const minDate=`${earliest.getFullYear()}-${String(earliest.getMonth()+1).padStart(2,'0')}-${String(earliest.getDate()).padStart(2,'0')}`;
 async function submit(event){
  event.preventDefault();const form=event.currentTarget;setBusy(true);setStatus('');setSent(false);
  try{const response=await fetch('/api/public/booking-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({kind:'journey-enquiry',...Object.fromEntries(new FormData(form))})});const result=await response.json().catch(()=>({}));if(!response.ok)throw Error(result.error||'Unable to send your enquiry. Please try again.');setSent(true);setStatus('Thank you. Your enquiry has been sent to our booking team. Your booking will be confirmed separately.');form.reset();}catch(error){setStatus(error.message);}finally{setBusy(false);}
 }
 return <form className="journey-enquiry" onSubmit={submit}>
  <div className="enquiry-fields">
   <label>Pick-up location<input name="pickup" placeholder="Address, airport or postcode" defaultValue={initialPickup} required maxLength={300}/></label>
   <label>Destination<input name="destination" placeholder="Your destination" required maxLength={300}/></label>
   <label>Travel date<input name="date" type="date" min={minDate} required/></label>
   <label>Pick-up time (UK)<input name="time" type="time" required/></label>
   <label>Passengers (1–7)<input name="passengers" type="number" min="1" max="7" step="1" defaultValue="1" required/></label>
   <label>Journey type<select name="service" required>{['Airport Transfers','Private Chauffeur','Wedding Cars','Corporate Travel','Special Occasions'].map(service=><option key={service}>{service}</option>)}</select></label>
   <label className="enquiry-wide">Journey notes<textarea name="notes" rows="3" maxLength={4000} placeholder="Flight details, luggage, return journey or special requirements"/></label>
  </div>
  <fieldset><legend>Your contact details</legend><div className="enquiry-fields">
   <label>Your name<input name="name" autoComplete="name" placeholder="Full name" maxLength={150} required/></label>
   <label>Email address<input name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required/></label>
   <label>Phone number<input name="phone" type="tel" autoComplete="tel" placeholder="Include your country code" maxLength={50} required/></label>
  </div></fieldset>
  <div className="enquiry-notice">Your details are sent to our booking team. <details><summary>Privacy notice</summary><p>We use the details you provide to respond to your enquiry and arrange your journey.</p></details> Your booking is confirmed separately.</div>
  {status&&<p className="enquiry-status" role={sent?'status':'alert'}>{status}</p>}
  <button className="enquiry-submit" type="submit" disabled={busy}>{busy?'Sending…':'Send Enquiry →'}</button>
 </form>;
}
