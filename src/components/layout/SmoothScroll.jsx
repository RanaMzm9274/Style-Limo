import {useEffect} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import Lenis from "lenis";
export default function SmoothScroll(){useEffect(()=>{const media=matchMedia("(prefers-reduced-motion: reduce)");let cleanup=()=>{};const setup=()=>{cleanup();if(media.matches)return;const lenis=new Lenis({duration:1.1,smoothWheel:true,anchors:true});lenis.on("scroll",ScrollTrigger.update);const tick=t=>lenis.raf(t*1000);gsap.ticker.add(tick);cleanup=()=>{gsap.ticker.remove(tick);lenis.destroy()}};setup();media.addEventListener("change",setup);return()=>{cleanup();media.removeEventListener("change",setup)}},[]);return null}
