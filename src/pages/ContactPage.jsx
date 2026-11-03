import React from 'react';
import {useSearchParams} from 'react-router-dom';
import EnquiryForm from '../components/sections/EnquiryForm.jsx';
import {useBookingSettings} from '../hooks/useBookingSettings.js';

export default function ContactPage() {
 const [params]=useSearchParams();
 const location=(params.get('location')||'').trim().slice(0,300);
 const settings=useBookingSettings();
 return <main className="booking contact-page">
  <div className="shell booking-grid">
   <div><div className="section-no">CONTACT US</div><h1>PLAN YOUR<br/><i>JOURNEY.</i></h1><p>{location?`Arrange your chauffeur journey from ${location}.`:'Tell us how you want to move. We’ll take care of everything else.'}</p><p>Share your journey details and our booking team will get in touch.</p></div>
   <EnquiryForm key={location} initialPickup={location} minimumNoticeDays={settings.minimumNoticeDays}/>
  </div>
 </main>;
}
