import React from "react";

export default function MaintenancePage(){
 return <main className="maintenance-page">
  <div className="maintenance-grid"/>
  <div className="maintenance-glow"/>
  <div className="maintenance-content">
   <div className="maintenance-brand">STYLE <span>EXPRESS</span> LIMO</div>
   <div className="maintenance-rule"><span>01</span><i/></div>
   <p className="maintenance-kicker">TEMPORARILY OFFLINE</p>
   <h1>We are<br/><em>refining</em> the ride.</h1>
   <p className="maintenance-copy">Our website is receiving a polished upgrade. We will be back shortly with an even smoother way to book your next journey.</p>
   <div className="maintenance-status"><span className="maintenance-dot"/>SYSTEM UPDATE IN PROGRESS</div>
  </div>
  <div className="maintenance-footer"><span>STYLE EXPRESS LIMO</span><span>CHAUFFEUR &amp; PERFORMANCE CARS</span><span>EST. 2024</span></div>
 </main>
}