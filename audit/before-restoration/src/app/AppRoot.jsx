import React,{useEffect} from "react";
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
gsap.registerPlugin(ScrollTrigger);
function ScrollTop(){const {pathname}=useLocation();useEffect(()=>{window.scrollTo(0,0);ScrollTrigger.refresh()},[pathname]);return null}
export default function AppRoot(){return <><SmoothScroll/><Cursor/><ScrollTop/><Nav/><Routes><Route path="/" element={<HomePage/>}/><Route path="/about" element={<AboutPage/>}/><Route path="/services" element={<ServicesPage/>}/><Route path="/fleet" element={<FleetPage/>}/><Route path="/booking" element={<BookingPage/>}/></Routes><Footer/></>}
