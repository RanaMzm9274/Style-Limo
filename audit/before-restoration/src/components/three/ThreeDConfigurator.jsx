import React,{useRef,useState} from "react";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {useGSAP} from "@gsap/react";
import {ArrowRight} from "lucide-react";
import {ConfiguratorScene} from "./ConfiguratorScene.jsx";
import {configuratorCars,paintColors} from "../../data/cars.js";

function ThreeDConfigurator() {
  const ref = useRef(),
    progress = useRef(0),
    dragRotation = useRef(0);
  const [active, setActive] = useState(0),
    [color, setColor] = useState(paintColors[0]),
    [pct, setPct] = useState(0);
  const car = configuratorCars[active];
  useGSAP(
    () => {
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
    },
    { scope: ref },
  );
  return (
    <section className="configurator" ref={ref}>
      <div className="configurator-grid" />
      <div className="shell config-inner">
        <div className="config-top">
          <div>
            <div className="section-no">05 ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â 3D CONFIGURATOR</div>
            <h2>
              MAKE IT
              <br />
              <i>YOURS.</i>
            </h2>
          </div>
          <div className="rotation-meter">
            <span>SCROLL TO ROTATE</span>
            <b>{pct}ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â°</b>
            <div>
              <i style={{ width: `${pct / 3.6}%` }} />
            </div>
          </div>
        </div>
        <div className="model-stage">
          <div className="canvas-wrap">
            <ConfiguratorScene
              car={car}
              color={color}
              progress={progress}
              dragRotation={dragRotation}
            />
            <div className="stage-ring" />
            <span className="drag-note">360ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â° VIEW ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã†â€™ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â· SCROLL / CLICK + DRAG</span>
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
                <span>0ÃƒÆ’Ã†â€™Ãƒâ€ Ã¢â‚¬â„¢ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬Ãƒâ€¦Ã‚Â¡ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â¢ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¡Ãƒâ€šÃ‚Â¬ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â62 MPH</span>
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
            <a href="#booking">
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

