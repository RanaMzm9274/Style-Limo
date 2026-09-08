import {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Lenis from "lenis";
export default function SmoothScroll(){useEffect(()=>{const lenis=new Lenis({duration:1.1,smoothWheel:true});lenis.on("scroll",ScrollTrigger.update);const tick=t=>lenis.raf(t*1000);gsap.ticker.add(tick);return()=>{gsap.ticker.remove(tick);lenis.destroy()}},[]);return null}
