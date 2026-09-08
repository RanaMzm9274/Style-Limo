import React,{useEffect,useRef} from "react";
import {useGSAP} from "@gsap/react";
import {Routes,Route,useLocation} from "react-router-dom";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import SmoothScroll from "../components/layout/SmoothScroll.jsx";
import Cursor from "../components/layout/Cursor.jsx";
import Nav from "../components/layout/Nav.jsx";
import Footer from "../components/layout/Footer.jsx";
import HomePage from "../pages/HomePage.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import ServicesPage from "../pages/ServicesPage.jsx";
import FleetPage from "../pages/FleetPage.jsx";
import BookingPage from "../pages/BookingPage.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import FleetAdminPage from "../pages/FleetAdminPage.jsx";
import BookingSettingsAdminPage from "../pages/BookingSettingsAdminPage.jsx";
gsap.registerPlugin(ScrollTrigger,useGSAP);
function ScrollTop(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);ScrollTrigger.refresh()},[pathname]);return null}
export default function AppRoot(){
 const root=useRef(); const {pathname}=useLocation(); const isAdmin=pathname.startsWith("/admin");
 useGSAP(()=>{
  const mm=gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)",()=>{
   gsap.utils.toArray(".reveal-up,.ch-copy,.ch-photo,.destination-grid article,.service-card,.car-card,.review-grid").forEach(el=>{
    gsap.from(el,{y:45,autoAlpha:0,duration:.85,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 94%",once:true}});
   });
   if(root.current.querySelector(".numbers")) gsap.to(".numbers-marquee > div",{xPercent:-25,ease:"none",scrollTrigger:{trigger:".numbers",start:"top bottom",end:"bottom top",scrub:1}});
  });
  const refresh=()=>ScrollTrigger.refresh();
  const imgs=[...root.current.querySelectorAll("img")];
  imgs.forEach(img=>img.addEventListener("load",refresh,{once:true}));
  document.fonts.ready.then(refresh);
  const timer=setTimeout(refresh,150);
  return ()=>{clearTimeout(timer);imgs.forEach(img=>img.removeEventListener("load",refresh));mm.revert()};
 },{scope:root,dependencies:[pathname],revertOnUpdate:true});
 return <div ref={root}>{!isAdmin&&<><SmoothScroll/><Cursor/><ScrollTop/><Nav/></>}<Routes><Route path="/" element={<HomePage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/services" element={<ServicesPage/>}/><Route path="/fleet" element={<FleetPage/>}/><Route path="/booking" element={<BookingPage/>}/><Route path="/admin" element={<AdminPage/>}/><Route path="/admin/fleet" element={<FleetAdminPage/>}/><Route path="/admin/booking-settings" element={<BookingSettingsAdminPage/>}/><Route path="*" element={<section className="booking-success shell"><div><h1>PAGE NOT FOUND</h1><a href="/">RETURN HOME</a></div></section>}/></Routes>{!isAdmin&&<Footer/>}</div>
}
