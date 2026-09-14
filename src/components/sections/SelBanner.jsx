import React,{useEffect,useRef,useState} from "react";
import {ArrowRight,ArrowDown} from "lucide-react";
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
const ConfiguratorScene=React.lazy(()=>import("../three/ConfiguratorScene.jsx").then(m=>({default:m.ConfiguratorScene})));
import {paintColors} from "../../data/cars.js";
import {useBanner} from "../../hooks/useBanner.js";

export default function SelBanner() {
  const bannerData = useBanner();
  const configuratorCars = bannerData.cars;
  const banner = useRef();
  useGSAP(() => {
    const mm=gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".sel-heading > span",{y:75,opacity:0,stagger:.12,duration:1.1,ease:"power4.out"});
      gsap.from(".sel-banner-top,.sel-banner-bottom,.sel-model-selector",{y:18,opacity:0,duration:.8,delay:.35});
      gsap.to(".sel-heading",{y:-65,scrollTrigger:{trigger:banner.current,start:"top top",end:"bottom top",scrub:1}});
    });
    return ()=>mm.revert();
  }, {scope:banner});
  const [active, setActive] = useState(0),
    [color, setColor] = useState(paintColors[0]);
  const [sceneReady, setSceneReady] = useState(false);
  const car = configuratorCars[active];
  const isSingleColorCar = car?.id === "F430" || car?.id === "land-rover-sport-limo" || car?.id === "rolls-royce-cullinan-2025" || car?.id === "rolls-royce-phantom";
  const visiblePaintColors = car?.id === "land-rover-sport-limo" || car?.id === "rolls-royce-cullinan-2025" || car?.id === "rolls-royce-phantom"
    ? [paintColors[1]]
    : isSingleColorCar ? paintColors.slice(0, 1) : paintColors.slice(0, 3);
  const selectedColor = car?.id === "land-rover-sport-limo" || car?.id === "rolls-royce-cullinan-2025" || car?.id === "rolls-royce-phantom" ? paintColors[1] : color;
  const progress = useRef(0),
    dragRotation = useRef(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let frame;
    let previous = performance.now();
    const rotate = (now) => {
      const delta = Math.min(now - previous, 50);
      previous = now;
      // One calm full rotation every 28 seconds, like a showroom display.
      progress.current = (progress.current + delta / 28000) % 1;
      frame = requestAnimationFrame(rotate);
    };
    frame = requestAnimationFrame(rotate);
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    const start = () => setSceneReady(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1800 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 900);
    return () => clearTimeout(id);
  }, []);
  const drag = useRef({ active: false, x: 0, rotation: 0 });
  const startDrag = (e) => {
    drag.current = {
      active: true,
      x: e.clientX,
      rotation: dragRotation.current,
    };
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };
  const moveDrag = (e) => {
    if (!drag.current.active) return;
    dragRotation.current =
      drag.current.rotation + (e.clientX - drag.current.x) * 0.012;
  };
  const stopDrag = () => {
    drag.current.active = false;
  };
  return (
    <section className="sel-banner" id="top" ref={banner}>
      <div className="sel-banner-glow" />
      <div className="shell sel-banner-top">
        <div className="sel-eyebrow">
          <span className="sel-dot" /> {bannerData.eyebrow}
        </div>
        <div className="sel-index">
          LONDON · UNITED KINGDOM<span>EST. 2014</span>
        </div>
      </div>
      <div className="shell">
        <h1 className="sel-heading">
          <span>{bannerData.headingLine1}</span>
          <span className="sel-outline">
            {bannerData.headingLine2}
          </span>
        </h1>
      </div>
      <div
        className="sel-scene"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onPointerLeave={stopDrag}
      >
        {sceneReady ? (
          <React.Suspense fallback={<div className="scene-placeholder" role="status">Loading 3D preview...</div>}>
            <ConfiguratorScene
            car={car}
              color={selectedColor}
            progress={progress}
            dragRotation={dragRotation}
          /></React.Suspense>
        ) : (
          <div
            className="scene-placeholder"
            aria-label="3D vehicle viewer loading"
          />
        )}
      </div>
      <div className="sel-caption">
        <span />
        THE ART OF ARRIVING.
      </div>
      <div className="shell sel-banner-bottom">
        <div>
          <p>
            {bannerData.taglineLine1}
            <br />
            {bannerData.taglineLine2}
          </p>
          <a href="#fleet" className="sel-button">
            EXPLORE THE COLLECTION <ArrowRight size={16} />
          </a>
        </div>
        <div className="sel-model-info">
          <small>THE SPOTLIGHT / 0{active + 1}</small>
          <h3>{car.name}</h3>
          <div className="sel-swatches">
            {visiblePaintColors.map((c) => (
              <button
                type="button"
                key={c}
                aria-label={"Select " + c}
                className={selectedColor === c ? "selected" : ""}
                style={{ "--swatch": c }}
                onClick={() => setColor(c)}
              />
            ))}
            <span>DRAG TO EXPLORE</span>
          </div>
        </div>
        <a href="#experience" className="sel-scroll">
          <ArrowDown size={16} /> SCROLL TO DISCOVER
        </a>
      </div>
      <div className="shell sel-model-selector">
        {configuratorCars.map((c, i) => (
          <button
            type="button"
            key={c.id}
            aria-pressed={active === i}
            className={active === i ? "active" : ""}
            onClick={() => {
              setActive(i);
              setColor(c.id === "land-rover-sport-limo" || c.id === "rolls-royce-cullinan-2025" || c.id === "rolls-royce-phantom" ? paintColors[1] : paintColors[0]);
            }}
          >
            <span>0{i + 1}</span>
            <div>
              <small>{c.brand}</small>
              <b>{c.name}</b>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
