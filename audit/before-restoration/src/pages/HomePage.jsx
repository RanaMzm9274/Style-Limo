import React from "react";
import Footer from "../components/layout/Footer.jsx";
import ServicesGrid from "../components/sections/ServicesGrid.jsx";
import SelBanner from "../components/sections/SelBanner.jsx";
import {Manifesto,Experience,Fleet,CarListing,Numbers,Chauffeur,Journey,Destinations,Reviews,Booking, AboutSec} from "../components/sections/HomeSections.jsx";
function HomePage() {
  return (
    <>
      <main>
        <SelBanner />
        <Manifesto />
        <Experience />
          <ServicesGrid />
        <CarListing />
        <Fleet />
        <Numbers />
        <Chauffeur />
        <Journey />
        <Destinations />
        <Reviews />
        <Booking />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
