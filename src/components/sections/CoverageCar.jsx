import React,{useEffect,useRef} from 'react';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader.js';

const models=['rolls-phantom.glb','rolls-royce-cullinan.glb','bentley-continental-gt.glb','2022_land_rover_range_rover.glb'];

export default function CoverageCar(){
 const host=useRef(null);
 useEffect(()=>{
  const element=host.current,parent=element.parentElement;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  let renderer;
  try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});}catch{return;}
  renderer.setSize(76,76);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  element.appendChild(renderer.domElement);
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);
  camera.position.set(0,8,0);camera.up.set(0,0,-1);camera.lookAt(0,0,0);
  scene.add(new THREE.HemisphereLight(0xffffff,0xaaa080,3));
  const light=new THREE.DirectionalLight(0xffffff,4);light.position.set(3,8,4);scene.add(light);
  const pivot=new THREE.Group();scene.add(pivot);
  const draco=new DRACOLoader();draco.setDecoderPath('/draco/');
  const loader=new GLTFLoader();loader.setDRACOLoader(draco);
  let disposed=false,frame,visible=false,lastRoute=null,current=null;
  const loaded=[];
  const dispose=model=>model.traverse(o=>{if(o.isMesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material]){for(const value of Object.values(m))if(value?.isTexture)value.dispose();m.dispose();}}});
  async function load(){
   for(const file of models){
    if(disposed)break;
    try{
     const gltf=await loader.loadAsync(`/models/${file}`),model=gltf.scene;
     if(disposed){dispose(model);break;}
     const box=new THREE.Box3().setFromObject(model),size=box.getSize(new THREE.Vector3()),center=box.getCenter(new THREE.Vector3());
     model.position.sub(center);
     const normalized=new THREE.Group();normalized.add(model);
     normalized.scale.setScalar(3.3/Math.max(size.x,size.y,size.z));
     // Put the vehicle's long axis along the direction of travel.
     if(size.z>size.x)normalized.rotation.y=Math.PI/2;
     normalized.userData.name=file;loaded.push(normalized);
    }catch(error){console.warn('Coverage vehicle could not load:',file);}
   }
  }
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;});observer.observe(parent);
  function tick(){
   frame=requestAnimationFrame(tick);
   if(!visible||!loaded.length){element.style.visibility='hidden';return;}
   const heads=[...parent.querySelectorAll('.coverage-travel-head')].filter(e=>getComputedStyle(e).visibility==='visible');
   const head=heads.find(e=>e.closest('.coverage-detail'))||heads[0];
   if(!head){element.style.visibility='hidden';return;}
   const route=head.dataset.head;
   if(route!==lastRoute||!current){
    const choices=loaded.filter(m=>m!==current);const next=choices[Math.floor(Math.random()*choices.length)]||loaded[0];
    if(current)pivot.remove(current);current=next;pivot.add(current);lastRoute=route;element.dataset.model=current.userData.name;
   }
   const matrix=head.getScreenCTM();if(!matrix)return;
   const point=new DOMPoint(head.cx.baseVal.value,head.cy.baseVal.value).matrixTransform(matrix);
   const start=new DOMPoint(+head.dataset.fromX,+head.dataset.fromY).matrixTransform(matrix);
   const end=new DOMPoint(+head.dataset.toX,+head.dataset.toY).matrixTransform(matrix);
   const bounds=parent.getBoundingClientRect();
   element.style.transform=`translate(${point.x-bounds.left-38}px,${point.y-bounds.top-38}px)`;
   pivot.rotation.y=-Math.atan2(end.y-start.y,end.x-start.x);
   element.style.visibility='visible';parent.classList.add('coverage-car-ready');renderer.render(scene,camera);
  }
  load();tick();
  return()=>{disposed=true;cancelAnimationFrame(frame);observer.disconnect();parent.classList.remove('coverage-car-ready');loaded.forEach(dispose);draco.dispose();renderer.dispose();renderer.domElement.remove();};
 },[]);
 return <div ref={host} className="coverage-car" aria-hidden="true"/>;
}
