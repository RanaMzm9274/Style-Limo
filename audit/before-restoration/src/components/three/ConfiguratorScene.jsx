import React,{useEffect,useRef} from "react";
import * as THREE from "three";
import {Canvas,useFrame} from "@react-three/fiber";
import {ContactShadows,useGLTF,OrbitControls,Html,useProgress} from "@react-three/drei";

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
export function ConfiguratorScene({ car, color, progress, dragRotation }) {
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
