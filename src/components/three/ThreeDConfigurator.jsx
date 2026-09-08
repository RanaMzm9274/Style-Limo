import React,{useRef,useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {ArrowRight} from "lucide-react";
const ConfiguratorScene=React.lazy(()=>import("./ConfiguratorScene.jsx").then(m=>({default:m.ConfiguratorScene})));
import {configuratorCars,paintColors} from "../../data/cars.js";

function ThreeDConfigurator() {
  const ref = useRef(),
    progress = useRef(0),
    dragRotation = useRef(0);
  const [active, setActive] = useState(0),
    [color, setColor] = useState(paintColors[0]),
    [pct, setPct] = useState(0);
  const car = configuratorCars[active];
  const drag=useRef(null);
  useGSAP(
    () => {
      const mm=gsap.matchMedia();
      mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)",()=>{
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top top",
        end: "+=2400",
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          progress.current = self.progress;
          setPct(Math.round(self.progress * 360));
        },
      });
      return () => st.kill();
      });
      return ()=>mm.revert();
    },
    { scope: ref },
  );
  return (
    <section className="configurator" ref={ref}>
      <div className="configurator-grid" />
      <div className="shell config-inner">
        <div className="config-top">
          <div>
            <div className="section-no">05 — 3D CONFIGURATOR</div>
            <h2>
              MAKE IT
              <br />
              <i>YOURS.</i>
            </h2>
          </div>
          <div className="rotation-meter">
            <span>SCROLL TO ROTATE</span>
            <b>{pct}°</b>
            <div>
              <i style={{ width: `${pct / 3.6}%` }} />
            </div>
          </div>
        </div>
        <div className="model-stage">
          <div className="canvas-wrap" onPointerDown={e=>{drag.current={x:e.clientX,r:dragRotation.current};e.currentTarget.setPointerCapture(e.pointerId)}} onPointerMove={e=>{if(drag.current)dragRotation.current=drag.current.r+(e.clientX-drag.current.x)*.012}} onPointerUp={()=>drag.current=null} onPointerCancel={()=>drag.current=null}>
            <React.Suspense fallback={<div className="scene-placeholder" role="status">Loading 3D preview...</div>}>
            <ConfiguratorScene
              car={car}
              color={color}
              progress={progress}
              dragRotation={dragRotation}
            /></React.Suspense>
            <div className="stage-ring" />
            <span className="drag-note">360° VIEW · SCROLL / CLICK + DRAG</span>
          </div>
          <aside className="config-panel">
            <div className="selected-name">
              <small>{car.brand}</small>
              <strong>{car.name}</strong>
            </div>
            <div className="config-specs">
              <div>
                <b>{car.power}</b>
                <span>POWER</span>
              </div>
              <div>
                <b>{car.zero}</b>
                <span>0—62 MPH</span>
              </div>
              <div>
                <b>{car.speed}</b>
                <span>TOP SPEED</span>
              </div>
            </div>
            <div className="paint">
              <span>PAINT / SELECT COLOUR</span>
              <div>
                {paintColors.map((c) => (
                  <button
                    type="button"
                    key={c}
                    aria-label={"Select " + c}
                    className={color === c ? "selected" : ""}
                    style={{ background: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
            <div className="config-price">
              <span>FROM</span>
              <b>{car.price}</b>
            </div>
            <a href={`/booking?vehicle=${encodeURIComponent(car.brand+" "+car.name)}`}>
              CONFIGURE & RESERVE <ArrowRight />
            </a>
          </aside>
        </div>
        <div className="model-selector">
          {configuratorCars.map((c, i) => (
            <button
              type="button"
              className={i === active ? "active" : ""}
              onClick={() => {
                setActive(i);
                setColor(paintColors[0]);
              }}
              key={c.id}
            >
              <span>0{i + 1}</span>
              <div>
                <small>{c.brand}</small>
                <b>{c.name}</b>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ThreeDConfigurator;

