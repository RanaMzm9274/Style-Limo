import React, { useEffect, useRef, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  useGLTF,
  OrbitControls,
  Html,
  useProgress,
} from "@react-three/drei";
gsap.registerPlugin(ScrollTrigger, useGSAP);

const cars = [
  {
    name: "911 GT3",
    brand: "PORSCHE",
    power: "510 PS",
    speed: "198 MPH",
    zero: "3.4 SEC",
    price: "495",
    tone: "#d7d7d2",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=88",
  },
  {
    name: "HURACÃN",
    brand: "LAMBORGHINI",
    power: "640 PS",
    speed: "202 MPH",
    zero: "2.9 SEC",
    price: "795",
    tone: "#d4ff38",
    image:
      "https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1800&q=88",
  },
  {
    name: "720S",
    brand: "McLAREN",
    power: "710 PS",
    speed: "212 MPH",
    zero: "2.8 SEC",
    price: "850",
    tone: "#ff6b22",
    image:
      "https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&w=1800&q=88",
  },
  {
    name: "CONTINENTAL GT",
    brand: "BENTLEY",
    power: "542 PS",
    speed: "198 MPH",
    zero: "3.9 SEC",
    price: "575",
    tone: "#a8a8a8",
    image:
      "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1800&q=88",
  },
  {
    name: "RANGE ROVER",
    brand: "AUTOBIOGRAPHY",
    power: "523 PS",
    speed: "155 MPH",
    zero: "4.4 SEC",
    price: "450",
    tone: "#9ba49a",
    image:
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1800&q=88",
  },
  {
    name: "S-CLASS",
    brand: "MERCEDES-MAYBACH",
    power: "496 PS",
    speed: "155 MPH",
    zero: "4.8 SEC",
    price: "POA",
    tone: "#e5e1d9",
    image:
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1800&q=88",
  },
];

function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);
  return null;
}
function Cursor() {
  const dot = useRef(),
    ring = useRef();
  useEffect(() => {
    if (matchMedia("(pointer:coarse)").matches) return;
    let x = 0,
      y = 0,
      rx = 0,
      ry = 0,
      raf;
    const move = (e) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px)`;
    };
    const loop = () => {
      rx += (x - rx) * 0.13;
      ry += (y - ry) * 0.13;
      if (ring.current)
        ring.current.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    addEventListener("mousemove", move);
    loop();
    return () => {
      removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div className="cursor-dot" ref={dot} />
      <div className="cursor-ring" ref={ring} />
    </>
  );
}
function Nav() {
  const [open, setOpen] = useState(false),
    [theme, setTheme] = useState(
      () => localStorage.getItem("drive-theme") || "light",
    );
  const location = useLocation();
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("drive-theme", theme);
  }, [theme]);
  useEffect(() => setOpen(false), [location.pathname]);
  return (
    <header className="nav">
      <div className="shell nav-in">
        <Link className="logo" to="/">
          DRIVE<span>/</span>PRIVÃ‰
        </Link>
        <nav className={open ? "links open" : "links"}>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/fleet">Fleet</Link>
          <Link to="/booking">Booking</Link>
        </nav>
        <button
          className="theme-toggle"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
        >
          {theme === "dark" ? "â˜¼ LIGHT" : "â— DARK"}
        </button>
        <Link to="/booking" className="book-top">
          BOOK A CAR <ArrowRight size={15} />
        </Link>
        <button className="menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
function Hero() {
  const ref = useRef();
  useGSAP(
    () => {
      gsap.from(".hero-word", {
        y: 130,
        opacity: 0,
        rotateX: -35,
        stagger: 0.1,
        duration: 1.25,
        ease: "power4.out",
      });
      gsap.from(".hero-car", {
        scale: 1.15,
        opacity: 0,
        duration: 1.6,
        ease: "power3.out",
        delay: 0.25,
      });
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        })
        .to(".hero-car", { scale: 1.12, y: 120, x: 80 }, 0)
        .to(".hero-copy", { y: -80, opacity: 0.2 }, 0)
        .to(".hero-title", { y: -130 }, 0);
    },
    { scope: ref },
  );
  return (
    <section className="hero" id="top" ref={ref}>
      <div className="hero-grid" />
      <div className="hero-glow" />
      <div className="shell hero-inner">
        <div className="eyebrow hero-copy">
          <span>01 / LONDON</span>
          <span>PREMIUM MOBILITY Â· 24/7</span>
        </div>
        <h1 className="hero-title">
          <span className="hero-word">DRIVE</span>
          <span className="hero-word outline">WITHOUT</span>
          <span className="hero-word">COMPROMISE.</span>
        </h1>
        <div className="hero-car">
          <img
            src={cars[0].image}
            width="1800"
            height="1100"
            fetchPriority="high"
            decoding="async"
          />
          <div className="car-shadow" />
        </div>
        <div className="hero-bottom hero-copy">
          <p>
            Chauffeur driven luxury.
            <br />
            Self-drive performance.
          </p>
          <a className="round-link" href="#fleet">
            <span>
              EXPLORE
              <br />
              THE FLEET
            </span>
            <ArrowRight />
          </a>
          <div className="scroll">
            SCROLL TO DISCOVER <ArrowDown size={16} />
          </div>
        </div>
      </div>
    </section>
  );
}
function Manifesto() {
  const ref = useRef();
  useGSAP(
    () => {
      gsap.from(".manifest-line", {
        y: 100,
        opacity: 0,
        stagger: 0.12,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 70%",
          end: "top 25%",
          scrub: 1,
        },
      });
      gsap.to(".ghost-word", {
        xPercent: -25,
        scrollTrigger: {
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: ref },
  );
  return (
    <section className="manifest" ref={ref}>
      <div className="ghost-word">PERFORMANCE</div>
      <div className="shell">
        <div className="section-no">02 â€” PHILOSOPHY</div>
        <h2>
          <span className="manifest-line">NOT JUST A RENTAL.</span>
          <span className="manifest-line muted">AN EXPERIENCE</span>
          <span className="manifest-line">ENGINEERED AROUND YOU.</span>
        </h2>
        <p>
          Exceptional machines. Impeccable service. Zero compromise between the
          moment you book and the moment you arrive.
        </p>
      </div>
    </section>
  );
}
function Experience() {
  const [mode, setMode] = useState("self");
  return (
    <section className={"experience " + mode} id="experience">
      <div
        className="exp-bg"
        style={{
          backgroundImage: `url(${mode === "self" ? cars[1].image : cars[5].image})`,
        }}
      />
      <div className="exp-shade" />
      <div className="shell exp-inner">
        <div className="section-no">03 â€” CHOOSE YOUR EXPERIENCE</div>
        <h2>
          HOW DO YOU
          <br />
          WANT TO <i>MOVE?</i>
        </h2>
        <div className="mode-tabs">
          <button
            onMouseEnter={() => setMode("chauffeur")}
            onClick={() => setMode("chauffeur")}
            className={mode === "chauffeur" ? "active" : ""}
          >
            <small>01</small>
            <b>CHAUFFEUR</b>
            <span>Arrive effortlessly.</span>
            <ArrowRight />
          </button>
          <button
            onMouseEnter={() => setMode("self")}
            onClick={() => setMode("self")}
            className={mode === "self" ? "active" : ""}
          >
            <small>02</small>
            <b>SELF DRIVE</b>
            <span>Take control.</span>
            <ArrowRight />
          </button>
        </div>
      </div>
    </section>
  );
}
function Fleet() {
  const [idx, setIdx] = useState(0);
  const c = cars[idx];
  const change = (d) => setIdx((i) => (i + d + cars.length) % cars.length);
  return (
    <section className="fleet" id="fleet">
      <div className="shell">
        <div className="fleet-head">
          <div>
            <div className="section-no">04 â€” THE COLLECTION</div>
            <h2>
              THE <i>MACHINES.</i>
            </h2>
          </div>
          <div className="fleet-nav">
            <span>
              0{idx + 1} / 0{cars.length}
            </span>
            <button onClick={() => change(-1)}>
              <ChevronLeft />
            </button>
            <button onClick={() => change(1)}>
              <ChevronRight />
            </button>
          </div>
        </div>
        <div className="fleet-stage" key={idx}>
          <div className="fleet-name">
            <small>{c.brand}</small>
            <strong>{c.name}</strong>
          </div>
          <img src={c.image} />
          <div className="fleet-specs">
            <div>
              <b>{c.power}</b>
              <span>POWER</span>
            </div>
            <div>
              <b>{c.speed}</b>
              <span>TOP SPEED</span>
            </div>
            <div>
              <b>{c.zero}</b>
              <span>0â€”62 MPH</span>
            </div>
          </div>
          <div className="fleet-price">
            <span>FROM</span>
            <b>{c.price === "POA" ? "POA" : `Â£${c.price}`}</b>
            <span>{c.price === "POA" ? "" : " / DAY"}</span>
            <button>
              VIEW CAR <ArrowRight />
            </button>
          </div>
        </div>
        <div className="fleet-strip">
          {cars.map((x, i) => (
            <button
              key={x.name}
              className={i === idx ? "on" : ""}
              onClick={() => setIdx(i)}
            >
              <span>0{i + 1}</span>
              {x.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

const configuratorCars = [
  {
    id: "gt3",
    brand: "PORSCHE",
    name: "911 GT3",
    power: "510 PS",
    zero: "3.4 SEC",
    speed: "198 MPH",
    price: "Â£495 / DAY",
    model: "/models/2022_porsche_911_gt3_992-optimized.glb",
    rot: [0, 0, 0],
  },
  {
    id: "huracan",
    brand: "LAMBORGHINI",
    name: "HURACÃN EVO",
    power: "640 PS",
    zero: "2.9 SEC",
    speed: "202 MPH",
    price: "Â£795 / DAY",
    model: "/models/2019_lamborghini_huracan_evo-optimized.glb",
    rot: [0, 0, 0],
  },
  {
    id: "gt",
    brand: "BENTLEY",
    name: "CONTINENTAL GT",
    power: "542 PS",
    zero: "3.9 SEC",
    speed: "198 MPH",
    price: "Â£575 / DAY",
    model: "/models/bentley-continental-gt.glb",
    rot: [0, Math.PI, 0],
  },
  {
    id: "rr",
    brand: "RANGE ROVER",
    name: "AUTOBIOGRAPHY",
    power: "523 PS",
    zero: "4.4 SEC",
    speed: "155 MPH",
    price: "Â£450 / DAY",
    model: "/models/2022_land_rover_range_rover.glb",
    rot: [0, 0, 0],
  },
];
const paintColors = [
  "#171717",
  "#e8e5dd",
  "#9d0d14",
  "#123f70",
  "#52624b",
  "#c5a66a",
];

function ModelLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="model-loader">
        <b>{Math.round(progress)}%</b>
        <span>LOADING MACHINE</span>
      </div>
    </Html>
  );
}
function ActualCar({ car, color, progress, dragRotation }) {
  const group = useRef();
  const { scene } = useGLTF(car.model, "/draco/");
  const model = React.useMemo(() => {
    const cloned = scene.clone(true);
    cloned.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      o.receiveShadow = true;
      if (o.material) o.material = o.material.clone();
    });
    // Normalize after applying the source model's corrective orientation. This fixes Bentley's offset/orientation.
    const wrapper = new THREE.Group();
    wrapper.add(cloned);
    cloned.rotation.set(...(car.rot || [0, 0, 0]));
    wrapper.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(wrapper),
      size = new THREE.Vector3(),
      center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    cloned.position.sub(wrapper.worldToLocal(center.clone()));
    const max = Math.max(size.x, size.y, size.z) || 1;
    wrapper.scale.setScalar(6.54 / max);
    return wrapper;
  }, [scene, car.id]);
  useEffect(() => {
    // Exact paint material mappings first. Range Rover's source uses Portuguese material names.
    const exact = {
      gt3: /Porsche_911GT3_2022Paint_Material/i,
      huracan: /PaintTNR/i,
      rr: /Carro_Pintura|Carro_Metal_Vermelho/i,
      gt: /Meshesmeshes1bumpfrontok0021Mtl/i,
    };
    const bodyHints =
      /body|paint|pintura|metal_vermelho|exterior|carrosserie|karosserie|hood|bonnet|door|fender|bumper|quarter|roof|boot/i;
    const exclude =
      /glass|vidro|window|wind|tire|tyre|pneu|wheel|roda|rim|brake|disc|caliper|light|farol|lamp|chrome|cromado|interior|interno|seat|carbon|rubber|plastico/i;
    let candidates = [];
    model.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      const n = `${o.name} ${o.material.name || ""}`;
      if (exact[car.id]?.test(n) || (!exclude.test(n) && bodyHints.test(n)))
        candidates.push(o);
    });
    // Bentley has generic material names; choose exterior panels by node/material naming and surface size.
    if (car.id === "gt")
      model.traverse((o) => {
        if (o.isMesh && o.material) {
          const n = `${o.name} ${o.material.name || ""}`;
          if (exact.gt.test(n) && !candidates.includes(o)) candidates.push(o);
        }
      });
    candidates.forEach((o) => {
      if (o.material.color) {
        if (car.id === "gt") {
          o.material.map = null;
          o.material.roughness = 0.24;
          o.material.metalness = 0.55;
        }
        o.material.color.set(color);
        o.material.metalness = Math.max(o.material.metalness || 0, 0.35);
        o.material.needsUpdate = true;
      }
    });
  }, [model, color, car.id]);
  useFrame(() => {
    if (group.current)
      group.current.rotation.y =
        progress.current * Math.PI * 2 + dragRotation.current;
  });
  return (
    <group ref={group} position={[0, -0.12, 0]}>
      <primitive object={model} />
    </group>
  );
}
function ConfiguratorScene({ car, color, progress, dragRotation }) {
  return (
    <Canvas
      camera={{ position: [5.2, 2.25, 5.2], fov: 35 }}
      dpr={[1, 1.05]}
      gl={{
        antialias: false,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.35,
      }}
    >
      <ambientLight intensity={1.15} />
      <hemisphereLight args={["#fffaf0", "#202820", 1.15]} />
      <directionalLight position={[5, 7, 4]} intensity={3.2} />
      <directionalLight position={[-5, 3, -3]} intensity={1.35} />
      <React.Suspense fallback={<ModelLoader />}>
        <ActualCar
          car={car}
          color={color}
          progress={progress}
          dragRotation={dragRotation}
        />
      </React.Suspense>
      <ContactShadows
        position={[0, -0.23, 0]}
        opacity={0.5}
        scale={11}
        blur={2.5}
        far={5}
        resolution={64}
        frames={1}
      />
      <OrbitControls
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI * 0.35}
        maxPolarAngle={Math.PI * 0.62}
      />
    </Canvas>
  );
}
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
            <div className="section-no">05 â€” 3D CONFIGURATOR</div>
            <h2>
              MAKE IT
              <br />
              <i>YOURS.</i>
            </h2>
          </div>
          <div className="rotation-meter">
            <span>SCROLL TO ROTATE</span>
            <b>{pct}Â°</b>
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
            <span className="drag-note">360Â° VIEW Â· SCROLL / CLICK + DRAG</span>
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
                <span>0â€”62 MPH</span>
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

function SelBanner() {
  const [active, setActive] = useState(0),
    [color, setColor] = useState(paintColors[0]);
  const [sceneReady, setSceneReady] = useState(false);
  const car = configuratorCars[active];
  const progress = useRef(0),
    dragRotation = useRef(0);
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
    <section className="sel-banner" id="top">
      <div className="sel-banner-glow" />
      <div className="shell sel-banner-top">
        <div className="sel-eyebrow">
          <span className="sel-dot" /> EXCEPTIONAL CARS. EXTRAORDINARY JOURNEYS.
        </div>
        <div className="sel-index">
          LONDON Ã‚Â· UNITED KINGDOM<span>EST. 2014</span>
        </div>
      </div>
      <div className="shell">
        <h1 className="sel-heading">
          <span>Beyond the</span>
          <span className="sel-outline">
            ordinary<span className="sel-period">.</span>
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
          <ConfiguratorScene
            car={car}
            color={color}
            progress={progress}
            dragRotation={dragRotation}
          />
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
            For the drive. For the arrival.
            <br />
            For the moments that stay with you.
          </p>
          <a href="#fleet" className="sel-button">
            EXPLORE THE COLLECTION <ArrowRight size={16} />
          </a>
        </div>
        <div className="sel-model-info">
          <small>THE SPOTLIGHT / 0{active + 1}</small>
          <h3>{car.name}</h3>
          <div className="sel-swatches">
            {paintColors.slice(0, 3).map((c) => (
              <button
                type="button"
                key={c}
                aria-label={"Select " + c}
                className={color === c ? "selected" : ""}
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
              setColor(paintColors[0]);
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

function ServicesGrid() {
  const services = [
    [
      "01",
      "PRIVATE CHAUFFEUR",
      "Door-to-door luxury travel with professional chauffeurs.",
      "EXECUTIVE",
    ],
    [
      "02",
      "SELF DRIVE",
      "Performance cars delivered ready for your own journey.",
      "PERFORMANCE",
    ],
    [
      "03",
      "AIRPORT TRANSFER",
      "Flight-monitored collection and effortless airport transfers.",
      "24 / 7",
    ],
    [
      "04",
      "WEDDINGS & EVENTS",
      "Statement vehicles and discreet chauffeur service for big moments.",
      "OCCASIONS",
    ],
    [
      "05",
      "CORPORATE",
      "Executive mobility for meetings, roadshows and VIP guests.",
      "BUSINESS",
    ],
    [
      "06",
      "LONG TERM HIRE",
      "Flexible premium vehicle hire for extended stays and projects.",
      "FLEXIBLE",
    ],
  ];
  return (
    <section className="service-grid-section" id="services">
      <div className="shell">
        <div className="grid-heading reveal-up">
          <div className="grid-heading-label">
            <div className="section-no">06 â€” WHAT WE DO</div>
            <div className="service-intro-mark">
              <span>DRIVE / PRIVÃ‰</span>
              <i />
            </div>
            <p className="service-intro-note">
              One considered standard, applied to every mile.
            </p>
          </div>
          <div>
            <h2>
              ONE STANDARD.
              <br />
              <i>EVERY JOURNEY.</i>
            </h2>
            <p>
              From a single airport transfer to a weekend behind the wheel,
              every service is designed around time, privacy and detail.
            </p>
          </div>
        </div>
        <div className="service-grid">
          {services.map((s, i) => (
            <article className={"service-card service-card-" + i} key={s[1]}>
              <div className="service-card-top">
                <span>{s[0]}</span>
                <small>{s[3]}</small>
              </div>
              <div className="service-icon">
                <span>â†—</span>
              </div>
              <div>
                <h3>{s[1]}</h3>
                <p>{s[2]}</p>
              </div>
              <a href="#booking">
                EXPLORE <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function CarListing() {
  return (
    <section className="car-listing">
      <div className="shell">
        <div className="listing-head reveal-up">
          <div>
            <div className="section-no">07 â€” AVAILABLE NOW</div>
            <h2>
              FIND YOUR
              <br />
              <i>NEXT DRIVE.</i>
            </h2>
          </div>
          <a href="#fleet">
            VIEW FULL FLEET <ArrowRight />
          </a>
        </div>
        <div className="car-grid">
          {cars.slice(0, 6).map((c, i) => (
            <article className="car-card" key={c.name}>
              <div className="car-card-img">
                <img src={c.image} />
                <div className="car-index">0{i + 1}</div>
                <div className="availability">AVAILABLE</div>
              </div>
              <div className="car-card-title">
                <div>
                  <small>{c.brand}</small>
                  <h3>{c.name}</h3>
                </div>
                <b>
                  {c.price === "POA" ? "POA" : `Â£${c.price}`}
                  <small>{c.price === "POA" ? "" : " / DAY"}</small>
                </b>
              </div>
              <div className="mini-specs">
                <span>{c.power}</span>
                <span>{c.zero} 0â€”62</span>
                <span>{c.speed}</span>
              </div>
              <a href="#booking">
                RESERVE THIS CAR <ArrowRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Numbers() {
  return (
    <section className="numbers">
      <div className="numbers-marquee">
        <div>
          PERFORMANCE Â· PRIVACY Â· PRECISION Â· PERFORMANCE Â· PRIVACY Â· PRECISION
          Â·
        </div>
      </div>
      <div className="shell number-grid">
        <article>
          <b>
            24<span>/7</span>
          </b>
          <p>Concierge & chauffeur support</p>
        </article>
        <article>
          <b>
            30<span>+</span>
          </b>
          <p>Premium & performance vehicles</p>
        </article>
        <article>
          <b>
            15<span>MIN</span>
          </b>
          <p>Average booking response</p>
        </article>
        <article>
          <b>
            100<span>%</span>
          </b>
          <p>Detail-led service</p>
        </article>
      </div>
    </section>
  );
}
function Destinations() {
  const items = [
    [
      "LONDON",
      "CITY",
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=85",
    ],
    [
      "COTSWOLDS",
      "ESCAPE",
      "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1200&q=85",
    ],
    [
      "GOODWOOD",
      "MOTORSPORT",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1200&q=85",
    ],
  ];
  return (
    <section className="destinations">
      <div className="shell">
        <div className="listing-head reveal-up">
          <div>
            <div className="section-no">10 â€” GO FURTHER</div>
            <h2>
              CURATED
              <br />
              <i>ESCAPES.</i>
            </h2>
          </div>
          <p>
            Cars are only half the story. Discover routes and destinations worth
            driving for.
          </p>
        </div>
        <div className="destination-grid">
          {items.map((x, i) => (
            <article key={x[0]}>
              <img src={x[2]} />
              <div className="destination-overlay">
                <small>
                  0{i + 1} / {x[1]}
                </small>
                <h3>{x[0]}</h3>
                <a>EXPLORE ROUTE â†—</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
function Reviews() {
  return (
    <section className="reviews">
      <div className="shell review-grid">
        <div>
          <div className="section-no">11 â€” CLIENT NOTES</div>
          <h2>
            THE EXPERIENCE,
            <br />
            <i>IN THEIR WORDS.</i>
          </h2>
        </div>
        <blockquote>
          <div className="quote-mark">â€œ</div>
          <p>
            From the first message to the final handover, everything felt
            effortless. The car arrived immaculate and exactly on time.
          </p>
          <footer>â€” PRIVATE CLIENT, LONDON</footer>
        </blockquote>
      </div>
    </section>
  );
}

function Chauffeur() {
  return (
    <section className="chauffeur" id="chauffeur">
      <div className="shell ch-grid">
        <div className="ch-copy">
          <div className="section-no dark">08 â€” CHAUFFEUR</div>
          <h2>
            DON'T
            <br />
            DRIVE.
            <br />
            <i>ARRIVE.</i>
          </h2>
          <p>
            Professional chauffeurs. Immaculate vehicles. Every detail handled â€”
            from airport runway to front door.
          </p>
          <a href="#booking">
            DISCOVER CHAUFFEUR <ArrowRight />
          </a>
        </div>
        <div className="ch-photo">
          <img src={cars[5].image} />
          <div className="ch-badge">
            <b>24/7</b>
            <span>
              PRIVATE
              <br />
              CHAUFFEUR
            </span>
          </div>
        </div>
      </div>
      <div className="shell services">
        {["AIRPORT TRANSFERS", "CORPORATE TRAVEL", "EVENTS & OCCASIONS"].map(
          (x, i) => (
            <a key={x}>
              <span>0{i + 1}</span>
              <b>{x}</b>
              <p>
                {i === 0
                  ? "Seamless airport collection with flight monitoring."
                  : i === 1
                    ? "Discreet, punctual executive travel on your schedule."
                    : "Make the entrance part of the occasion."}
              </p>
              <ArrowRight />
            </a>
          ),
        )}
      </div>
    </section>
  );
}
function Journey() {
  const ref = useRef();
  useGSAP(
    () => {
      gsap.to(".journey-track", {
        xPercent: -75,
        ease: "none",
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=2800",
          pin: true,
          scrub: 1,
        },
      });
    },
    { scope: ref },
  );
  const steps = [
    [
      "01",
      "SELECT",
      "Choose the machine or chauffeur experience that fits the moment.",
    ],
    [
      "02",
      "BOOK",
      "Reserve in minutes. Clear pricing, no unnecessary friction.",
    ],
    [
      "03",
      "DRIVE",
      "We prepare every detail. You simply take the wheel â€” or the back seat.",
    ],
    [
      "04",
      "RETURN",
      "A seamless handover completes the experience. Until next time.",
    ],
  ];
  return (
    <section className="journey" ref={ref}>
      <div className="journey-title">
        <span>09 â€” THE JOURNEY</span>
        <h2>
          FOUR STEPS.
          <br />
          <i>ZERO FRICTION.</i>
        </h2>
      </div>
      <div className="journey-track">
        {steps.map((s) => (
          <article key={s[0]}>
            <small>{s[0]}</small>
            <h3>{s[1]}</h3>
            <p>{s[2]}</p>
            <div className="road">
              <span>â†’</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function Booking() {
  return (
    <section className="booking" id="booking">
      <div className="shell booking-grid">
        <div>
          <div className="section-no">12 â€” RESERVE</div>
          <h2>
            READY
            <br />
            WHEN <i>YOU ARE.</i>
          </h2>
          <p>
            Tell us how you want to move. We'll take care of everything else.
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            <span>01 / SERVICE</span>
            <select>
              <option>Self Drive</option>
              <option>Chauffeur</option>
            </select>
          </label>
          <label>
            <span>02 / VEHICLE</span>
            <select>
              {cars.map((c) => (
                <option key={c.name}>
                  {c.brand} {c.name}
                </option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              <span>03 / DATE</span>
              <input type="date" />
            </label>
            <label>
              <span>04 / DURATION</span>
              <select>
                <option>1 Day</option>
                <option>2 Days</option>
                <option>Weekend</option>
                <option>1 Week</option>
              </select>
            </label>
          </div>
          <button className="reserve">
            REQUEST RESERVATION <ArrowRight />
          </button>
        </form>
      </div>
    </section>
  );
}
function Footer() {
  return (
    <footer>
      <div className="shell">
        <div className="footer-top">
          <h2>
            YOUR NEXT
            <br />
            JOURNEY <i>STARTS HERE.</i>
          </h2>
          <a href="#booking" className="round-link light">
            <span>
              BOOK YOUR
              <br />
              DRIVE
            </span>
            <ArrowRight />
          </a>
        </div>
        <div className="footer-bottom">
          <a className="logo">
            DRIVE<span>/</span>PRIVÃ‰
          </a>
          <div>FLEET Â· CHAUFFEUR Â· EXPERIENCES Â· CONTACT</div>
          <small>Â© 2026 DRIVE/PRIVÃ‰</small>
        </div>
      </div>
    </footer>
  );
}

function PageHero({ index, kicker, title, accent, copy, image }) {
  return (
    <section className="page-hero">
      <div
        className="page-hero-image"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="page-hero-shade" />
      <div className="shell page-hero-inner">
        <div className="section-no">
          {index} â€” {kicker}
        </div>
        <h1>
          {title}
          <br />
          <i>{accent}</i>
        </h1>
        <p>{copy}</p>
        <ArrowDown className="page-down" />
      </div>
    </section>
  );
}
function AboutPage() {
  return (
    <>
      <PageHero
        index="01"
        kicker="OUR STORY"
        title="BUILT FOR"
        accent="THE JOURNEY."
        copy="A modern luxury mobility company built around remarkable cars, meticulous service and the freedom to move differently."
        image={cars[2].image}
      />
      <section className="page-intro">
        <div className="shell split-copy">
          <div>
            <div className="section-no">02 â€” THE IDEA</div>
            <h2>
              MORE THAN
              <br />A <i>KEY HANDOVER.</i>
            </h2>
          </div>
          <div>
            <p>
              DRIVE/PRIVÃ‰ brings performance rental and chauffeur travel into
              one considered experience. Every touchpoint is designed to feel
              calm, precise and personal.
            </p>
            <p>
              Whether you take the wheel or the rear seat, the standard stays
              the same: exceptional vehicles, transparent service and obsessive
              attention to detail.
            </p>
          </div>
        </div>
      </section>
      <Numbers />
      <section className="values">
        <div className="shell">
          <div className="listing-head">
            <div>
              <div className="section-no">03 â€” OUR STANDARD</div>
              <h2>
                WHAT WE
                <br />
                <i>BELIEVE.</i>
              </h2>
            </div>
          </div>
          <div className="value-grid">
            {[
              ["01", "DETAIL", "The small things are the experience."],
              [
                "02",
                "DISCRETION",
                "Premium service without unnecessary noise.",
              ],
              ["03", "PERFORMANCE", "Vehicles and people chosen to deliver."],
              ["04", "TIME", "Punctuality is a non-negotiable."],
            ].map((v) => (
              <article>
                <span>{v[0]}</span>
                <h3>{v[1]}</h3>
                <p>{v[2]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <Reviews />
      <Footer />
    </>
  );
}
function ServicesPage() {
  return (
    <>
      <PageHero
        index="01"
        kicker="SERVICES"
        title="MOVE ON"
        accent="YOUR TERMS."
        copy="Self-drive performance, professional chauffeur travel and tailored mobility for the moments that matter."
        image={cars[5].image}
      />
      <ServicesGrid />
      <section className="service-detail">
        <div className="shell">
          {[
            [
              "01",
              "PRIVATE CHAUFFEUR",
              "Airport transfers, corporate travel and private events handled by professional chauffeurs with discreet door-to-door service.",
            ],
            [
              "02",
              "SELF DRIVE",
              "Choose from our curated performance fleet, reserve your dates and take control of the journey.",
            ],
            [
              "03",
              "BESPOKE MOBILITY",
              "Multi-car events, long-term hire and tailored itineraries designed around complex schedules.",
            ],
          ].map((s, i) => (
            <article>
              <div className="service-big-no">{s[0]}</div>
              <div>
                <h2>{s[1]}</h2>
                <p>{s[2]}</p>
                <Link to="/booking">
                  MAKE AN ENQUIRY <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
      <Journey />
      <Footer />
    </>
  );
}
function FleetPage() {
  const [filter, setFilter] = useState("ALL");
  const cats = ["ALL", "PERFORMANCE", "LUXURY", "SUV", "CHAUFFEUR"];
  const categories = {
    "911 GT3": ["PERFORMANCE"],
    "HURACÃƒÂN": ["PERFORMANCE"],
    "720S": ["PERFORMANCE"],
    "CONTINENTAL GT": ["LUXURY", "CHAUFFEUR"],
    "RANGE ROVER": ["SUV", "LUXURY"],
    "S-CLASS": ["LUXURY", "CHAUFFEUR"],
  };
  const filteredCars =
    filter === "ALL"
      ? cars
      : cars.filter((car) => categories[car.name]?.includes(filter));
  return (
    <>
      <PageHero
        index="01"
        kicker="THE FLEET"
        title="CHOOSE YOUR"
        accent="MACHINE."
        copy="A curated collection of performance, grand touring, SUV and chauffeur vehicles."
        image={cars[0].image}
      />
      <section className="fleet-page">
        <div className="shell">
          <div className="filter-bar">
            {cats.map((x) => (
              <button
                className={filter === x ? "on" : ""}
                onClick={() => setFilter(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="car-grid">
            {cars.map((c, i) => (
              <article className="car-card" key={c.name}>
                <div className="car-card-img">
                  <img src={c.image} />
                  <div className="car-index">0{i + 1}</div>
                  <div className="availability">AVAILABLE</div>
                </div>
                <div className="car-card-title">
                  <div>
                    <small>{c.brand}</small>
                    <h3>{c.name}</h3>
                  </div>
                  <b>
                    {c.price === "POA" ? "POA" : `Â£${c.price}`}
                    <small>{c.price === "POA" ? "" : " / DAY"}</small>
                  </b>
                </div>
                <div className="mini-specs">
                  <span>{c.power}</span>
                  <span>{c.zero} 0â€”62</span>
                  <span>{c.speed}</span>
                </div>
                <Link to="/booking">
                  RESERVE THIS CAR <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ThreeDConfigurator />
      <Footer />
    </>
  );
}
function FilteredFleetPage() {
  const [filter, setFilter] = useState("ALL");
  const groups = {
    PERFORMANCE: [0, 1, 2],
    LUXURY: [3, 4, 5],
    SUV: [4],
    CHAUFFEUR: [3, 5],
  };
  const visible =
    filter === "ALL" ? cars : cars.filter((_, i) => groups[filter].includes(i));
  return (
    <>
      <PageHero
        index="01"
        kicker="THE FLEET"
        title="CHOOSE YOUR"
        accent="MACHINE."
        copy="A curated collection of performance, grand touring, SUV and chauffeur vehicles."
        image={cars[0].image}
      />
      <section className="fleet-page">
        <div className="shell">
          <div className="filter-bar">
            {["ALL", "PERFORMANCE", "LUXURY", "SUV", "CHAUFFEUR"].map((x) => (
              <button
                type="button"
                key={x}
                className={filter === x ? "on" : ""}
                onClick={() => setFilter(x)}
              >
                {x}
              </button>
            ))}
          </div>
          <div className="car-grid">
            {visible.map((c, i) => (
              <article className="car-card" key={c.name}>
                <div className="car-card-img">
                  <img src={c.image} loading="lazy" decoding="async" />
                  <div className="car-index">0{i + 1}</div>
                  <div className="availability">AVAILABLE</div>
                </div>
                <div className="car-card-title">
                  <div>
                    <small>{c.brand}</small>
                    <h3>{c.name}</h3>
                  </div>
                  <b>
                    {c.price === "POA" ? "POA" : `Â£${c.price}`}
                    <small>{c.price === "POA" ? "" : " / DAY"}</small>
                  </b>
                </div>
                <div className="mini-specs">
                  <span>{c.power}</span>
                  <span>{c.zero} 0â€”62</span>
                  <span>{c.speed}</span>
                </div>
                <Link to="/booking">
                  RESERVE THIS CAR <ArrowRight size={15} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
      <ThreeDConfigurator />
      <Footer />
    </>
  );
}
function BookingPage() {
  const [step, setStep] = useState(1),
    [done, setDone] = useState(false);
  const [form, setForm] = useState({
    service: "Self Drive",
    vehicle: "Porsche 911 GT3",
    date: "",
    duration: "2 Days",
    name: "",
    email: "",
    phone: "",
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  if (done)
    return (
      <>
        <section className="booking-success">
          <div className="shell">
            <span>REQUEST RECEIVED</span>
            <h1>
              YOUR JOURNEY
              <br />
              <i>STARTS HERE.</i>
            </h1>
            <p>
              Thanks {form.name || "there"}. Our concierge team will review your
              request and contact you with availability.
            </p>
            <Link to="/">
              RETURN HOME <ArrowRight />
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  return (
    <>
      <section className="booking-page">
        <div className="shell booking-page-grid">
          <div className="booking-aside">
            <div className="section-no">01 â€” RESERVATION</div>
            <h1>
              BOOK
              <br />
              <i>YOUR DRIVE.</i>
            </h1>
            <p>
              Build your request in three quick steps. No payment is taken at
              this stage.
            </p>
            <div className="step-list">
              {["EXPERIENCE", "DATES", "YOUR DETAILS"].map((x, i) => (
                <div
                  className={
                    step === i + 1 ? "active" : step > i + 1 ? "done" : ""
                  }
                >
                  <span>0{i + 1}</span>
                  {x}
                </div>
              ))}
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 3) setStep(step + 1);
              else setDone(true);
            }}
            className="booking-wizard"
          >
            {step === 1 && (
              <div className="wizard-panel">
                <small>STEP 01</small>
                <h2>CHOOSE YOUR EXPERIENCE</h2>
                <label>
                  SERVICE
                  <select
                    value={form.service}
                    onChange={(e) => set("service", e.target.value)}
                  >
                    <option>Self Drive</option>
                    <option>Private Chauffeur</option>
                    <option>Airport Transfer</option>
                  </select>
                </label>
                <label>
                  VEHICLE
                  <select
                    value={form.vehicle}
                    onChange={(e) => set("vehicle", e.target.value)}
                  >
                    {cars.map((c) => (
                      <option>
                        {c.brand} {c.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
            {step === 2 && (
              <div className="wizard-panel">
                <small>STEP 02</small>
                <h2>WHEN ARE YOU MOVING?</h2>
                <label>
                  START DATE
                  <input
                    required
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                  />
                </label>
                <label>
                  DURATION
                  <select
                    value={form.duration}
                    onChange={(e) => set("duration", e.target.value)}
                  >
                    <option>1 Day</option>
                    <option>2 Days</option>
                    <option>Weekend</option>
                    <option>1 Week</option>
                    <option>Long Term</option>
                  </select>
                </label>
              </div>
            )}
            {step === 3 && (
              <div className="wizard-panel">
                <small>STEP 03</small>
                <h2>YOUR DETAILS</h2>
                <label>
                  FULL NAME
                  <input
                    required
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  EMAIL
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    placeholder="you@email.com"
                  />
                </label>
                <label>
                  PHONE
                  <input
                    required
                    value={form.phone}
                    onChange={(e) => set("phone", e.target.value)}
                    placeholder="+44"
                  />
                </label>
              </div>
            )}
            <div className="wizard-actions">
              {step > 1 && (
                <button
                  type="button"
                  className="back"
                  onClick={() => setStep(step - 1)}
                >
                  â† BACK
                </button>
              )}
              <button type="submit" className="next">
                {step === 3 ? "SEND REQUEST" : "CONTINUE"} <ArrowRight />
              </button>
            </div>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
function HomePage() {
  return (
    <>
      <main>
        <SelBanner />
        <Manifesto />
        <Experience />
        <Fleet />
        <ServicesGrid />
        <CarListing />
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
function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    ScrollTrigger.refresh();
  }, [pathname]);
  return null;
}

export default function App() {
  useEffect(() => {
    document.querySelectorAll("img:not(.hero-car img)").forEach((img) => {
      img.loading = "lazy";
      img.decoding = "async";
    });
  }, []);
  useGSAP(() => {
    gsap.utils
      .toArray(".reveal-up")
      .forEach((el) =>
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 86%" },
        }),
      );
  });
  return (
    <>
      <SmoothScroll />
      <Cursor />
      <ScrollTop />
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/fleet" element={<FilteredFleetPage />} />
        <Route path="/booking" element={<BookingPage />} />
      </Routes>
    </>
  );
}


