import React,{useEffect,useRef,useState} from "react";
import * as THREE from "three";
import {Canvas,useFrame} from "@react-three/fiber";
import {ContactShadows,useGLTF,OrbitControls,Html,useProgress} from "@react-three/drei";
import {getRimAccent} from "../../utils/rimColors.js";

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
      if (o.material) o.material = Array.isArray(o.material) ? o.material.map(m=>m.clone()) : o.material.clone();
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
  useEffect(()=>()=>{model.traverse(o=>{if(o.isMesh){const materials=Array.isArray(o.material)?o.material:[o.material];materials.forEach(m=>m?.dispose())}})},[model]);
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
    if (car.id === "land-rover-sport-limo" || car.id === "rolls-royce-cullinan-2025") {
      const excludedExterior = /glass|window|windshield|tire|tyre|wheel|rim|brake|disc|caliper|light|lamp|chrome|interior|seat|leather|dashboard|dash|door[_ -]?panel|carpet|stitch|trim|rubber|carbon/i;
      model.traverse((o) => {
        if (!o.isMesh || !o.material) return;
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        const label = `${o.name || ""} ${materials.map((m) => m?.name || "").join(" ")}`;
        if (excludedExterior.test(label)) return;
        materials.forEach((material) => {
          if (!material?.color) return;
          if (car.id === "land-rover-sport-limo") {
            material.map = null;
            if (material.emissive) material.emissive.set("#000000");
            material.emissiveIntensity = 0;
          }
          if (car.id === "rolls-royce-cullinan-2025" && /^(carpaint|qimian)$/i.test(material.name || "")) {
            material.map = null;
          }
          material.color.set("#e8e5dd");
          material.metalness = Math.min(material.metalness ?? 0.2, 0.35);
          material.roughness = Math.max(material.roughness ?? 0.42, 0.3);
          material.needsUpdate = true;
        });
      });
    }
    if (car.id === "rolls-royce-cullinan-2025") {
      const frontLightHints = /head.?light|front.?light|light.?front|headlamp|farol.?front|^(light|light_nm2|dadengduge|lightbump)$/i;
      const rearLightHints = /tail.?light|rear.?light|back.?light|stop.?light|taillamp|farol.?rear|^(rearlight_emissive|brakelight_m)$/i;
      const grilleHints = /grill|grille|radiator|mesh.?front|^(zhongleng|ext_chrome|light_chrome)$/i;
      const blackStripHints = /black.?strip|dark.?strip|bumper.?strip|body.?strip|side.?strip|trim.?black|^(duge|dadengxunhei|black|ext_black)$/i;
      model.traverse((o) => {
        if (!o.isMesh || !o.material) return;
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        const label = `${o.name || ""} ${materials.map((m) => m?.name || "").join(" ")}`;
        const materialNames = materials.map((m) => m?.name || "").join(" ");
        let finish = null;
        if (frontLightHints.test(label) || frontLightHints.test(materialNames)) finish = { color: "#7c8288", emissive: "#34383d", intensity: 0.12, metalness: 0.18, roughness: 0.28 };
        else if (rearLightHints.test(label) || rearLightHints.test(materialNames)) finish = { color: "#d10f1b", emissive: "#7a0008", intensity: 0.5, metalness: 0.05, roughness: 0.22 };
        else if (grilleHints.test(label) || grilleHints.test(materialNames)) finish = { color: "#d7d9d8", emissive: "#000000", intensity: 0, metalness: 0.92, roughness: 0.12 };
        else if (blackStripHints.test(label) || blackStripHints.test(materialNames)) finish = { color: "#080808", emissive: "#000000", intensity: 0, metalness: 0.15, roughness: 0.32 };
        if (!finish) return;
        materials.forEach((material) => {
          if (!material?.color) return;
          if (grilleHints.test(material.name || "")) material.map = null;
          material.color.set(finish.color);
          material.metalness = finish.metalness;
          material.roughness = finish.roughness;
          if (material.emissive) {
            material.emissive.set(finish.emissive);
            material.emissiveIntensity = finish.intensity;
            if ((frontLightHints.test(material.name || "") || rearLightHints.test(material.name || "")) && material.map) {
              material.emissiveMap = material.map;
              material.toneMapped = false;
            }
          }
          material.needsUpdate = true;
        });
      });
    }
    if (car.id === "rolls-royce-cullinan-2025") {
      const interiorHints = /interior|seat|leather|dashboard|dash|door[_ -]?panel|carpet|stitch|trim/i;
      model.traverse((o) => {
        if (!o.isMesh || !o.material) return;
        const materials = Array.isArray(o.material) ? o.material : [o.material];
        materials.forEach((material) => {
          const label = `${o.name || ""} ${material?.name || ""}`;
          if (!material?.color || !interiorHints.test(label)) return;
          material.color.set("#8b1118");
          material.roughness = Math.max(material.roughness ?? 0.45, 0.38);
          material.needsUpdate = true;
        });
      });
    }
    const accent=getRimAccent(color);
    const rimHints=/rim|alloy|felge|jante|cerchione|roda[_\s-]*(metal|liga|crom)|wheel[_\s-]*(metal|alloy|rim)|wheels?\b/i;
    const rubberHints=/tire|tyre|pneu|rubber|borracha|brake|disc|rotor|caliper/i;
    model.traverse((o)=>{
      if(!o.isMesh||!o.material)return;
      const materials=Array.isArray(o.material)?o.material:[o.material];
      materials.forEach(material=>{
        const label=`${o.name||""} ${material?.name||""}`;
        if(!material?.color||!rimHints.test(label)||rubberHints.test(label))return;
        material.color.set(accent);
        material.metalness=Math.max(material.metalness||0,.72);
        material.roughness=Math.min(material.roughness??.3,.28);
        if(material.emissive){material.emissive.set(accent);material.emissiveIntensity=.055}
        material.needsUpdate=true;
        o.userData.styleExpressRimAccent=accent;
      });
    });
  }, [model, color, car.id]);
  useFrame(() => {
    if (group.current)
      group.current.rotation.y =
        progress.current * Math.PI * 2 + dragRotation.current;
  });
  return (
    <>
      <group ref={group} position={[0, -0.12, 0]}><primitive object={model} dispose={null} /></group>
      <ContactShadows key={car.id} position={[0,new THREE.Box3().setFromObject(model).min.y-.13,0]} opacity={.4} scale={11} blur={2.5} far={5} resolution={128} frames={1}/>
    </>
  );
}
export function ConfiguratorScene({ car, color, progress, dragRotation }) {
  const host=useRef();const [visible,setVisible]=useState(true);
  useEffect(()=>{const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));observer.observe(host.current);return()=>observer.disconnect()},[]);
  return (
    <div ref={host} style={{width:"100%",height:"100%"}}>
    <SceneBoundary resetKey={car.id}>
    <Canvas
      frameloop={visible?"always":"never"}
      fallback={<div className="scene-error">3D preview is unavailable on this device. Explore the collection below.</div>}
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
    </SceneBoundary>
    </div>
  );
}
class SceneBoundary extends React.Component {
 state={error:false};
 static getDerivedStateFromError(){return {error:true}}
 componentDidUpdate(previous){if(previous.resetKey!==this.props.resetKey && this.state.error)this.setState({error:false})}
 render(){return this.state.error?<div className="scene-error" role="status">This 3D preview could not load. Select another vehicle to continue.</div>:this.props.children}
}
