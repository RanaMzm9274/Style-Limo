import React, {useEffect, useRef, useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import gsap from 'gsap';
import {useGSAP} from '@gsap/react';
import map from './coverage-map.json';
const CoverageCar=React.lazy(()=>import('./CoverageCar.jsx'));

gsap.registerPlugin(useGSAP);
const locations = [
 ['Leeds',53.8008,-1.5491], ['Bradford',53.796,-1.7594],
 ['Wakefield',53.6833,-1.4977], ['Huddersfield',53.6458,-1.785],
 ['Halifax',53.7257,-1.863], ['Harrogate',53.9921,-1.5418],
 ['York',53.959,-1.0815], ['Wetherby',53.928,-1.386],
 ['Keighley',53.867,-1.906], ['Skipton',53.961,-2.017],
 ['Pontefract',53.691,-1.312], ['Castleford',53.725,-1.354],
 ['Garforth',53.792,-1.381], ['Tadcaster',53.885,-1.263],
 ['Manchester',53.4808,-2.2426], ['London',51.5074,-0.1278],
].map(([name,lat,lon],index)=>({name,lat,lon,index}));
const project = ({lat,lon}) => [(lon+8.8)*55,(59.5-lat)*90];
const detailProject = ({lat,lon}) => [85+(lon+2.10)*415,62+(54.04-lat)*725];

export default function Coverage() {
 const navigate=useNavigate();
 const selectLocation=p=>navigate(`/contact?location=${encodeURIComponent(p.name)}`);
 const root = useRef(null);
 const places = useRef(null);
 const list = useRef(null);
 const [selected,setSelected] = useState(locations[0]);
 const [filter,setFilter] = useState('All areas');
 const [arrival,setArrival] = useState(null);
 const visible = locations.filter(p=>filter==='All areas'||(filter==='Yorkshire'?p.index<14:p.index>=14));
 useGSAP(()=>{
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   gsap.from('.coverage-row',{opacity:0,x:15,stagger:.035,duration:.45});
  });
  return ()=>media.revert();
 },{scope:root,dependencies:[filter],revertOnUpdate:true});
 useGSAP(()=>{
  const media=gsap.matchMedia();
  media.add('(prefers-reduced-motion: no-preference)',()=>{
   const timeline=gsap.timeline({repeat:-1});
   locations.forEach((from,index)=>{
    const target=locations[(index+1)%locations.length];
    const lines=root.current.querySelectorAll(`[data-route="${index}"]`);
    const heads=root.current.querySelectorAll(`[data-head="${index}"]`);
    timeline.call(()=>setArrival(null))
     .set('.coverage-travel, .coverage-travel-head',{visibility:'hidden'})
     .set(lines,{visibility:'visible',strokeDashoffset:.22})
     .set(heads,{visibility:'visible',attr:{cx:(_,e)=>e.dataset.fromX,cy:(_,e)=>e.dataset.fromY}})
     .to(lines,{strokeDashoffset:-.78,autoRound:false,duration:1.8,ease:'none'})
     .to(heads,{attr:{cx:(_,e)=>e.dataset.toX,cy:(_,e)=>e.dataset.toY},duration:1.8,ease:'none'},'<')
     .set([...lines,...heads],{visibility:'hidden'})
     .call(()=>setArrival(target.index))
     .to({},{duration:3});
   });
  });
  return ()=>media.revert();
 },{scope:root});
 useEffect(()=>{
  const panel=places.current;
  const scrollLocations=event=>{
   if(event.ctrlKey || !event.deltaY) return;
   event.preventDefault();
   event.stopPropagation();
   const amount=event.deltaMode===1?event.deltaY*20:event.deltaMode===2?event.deltaY*list.current.clientHeight:event.deltaY;
   list.current.scrollTop+=amount;
  };
  panel.addEventListener('wheel',scrollLocations,{passive:false});
  return ()=>panel.removeEventListener('wheel',scrollLocations);
 },[]);
 const chooseFilter=(value)=>{setFilter(value);if(value==='Yorkshire'&&selected.index>=14)setSelected(locations[0]);if(value==='Further afield'&&selected.index<14)setSelected(locations[14]);};
 const marker=(p,detail=false)=>{
  const [x,y]= detail ? detailProject(p) : project(p);
  const active=selected.name===p.name;
  return <g key={p.name} className={`coverage-marker ${active?'is-selected':''}`} transform={`translate(${x} ${y})`} role="button" tabIndex={0} aria-label={`Enquire about ${p.name}`} aria-pressed={active} onClick={()=>selectLocation(p)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectLocation(p);}}}>
   <title>{p.name}</title><circle r={detail?13:11} className="coverage-hit"/>
   <circle r={detail?9:8} className={`coverage-pulse ${arrival===p.index?'is-arriving':''}`}/>
   <circle r={detail?9:8} className="coverage-node-ring"/>
   <circle r={detail?6:5} className="coverage-pin"/>
   {detail&&<text x={p.index===4||p.index===8||p.index===9?-13:13} y={p.index===11?-11:4} textAnchor={p.index===4||p.index===8||p.index===9?'end':'start'}>{p.name}</text>}
   {!detail&&(p.index>=14)&&<text x="13" y="4">{p.name}</text>}
  </g>;
 };
 const connections=(detail=false)=>locations.map((from,index)=>{
  const to=locations[(index+1)%locations.length];
  if(detail&&(from.index>=14||to.index>=14)) return null;
  const [x1,y1]=(detail?detailProject:project)(from);
  const [x2,y2]=(detail?detailProject:project)(to);
  const d=`M ${x1} ${y1} L ${x2} ${y2}`;
  return <g key={from.name} aria-hidden="true"><path className="coverage-connections" d={d}/><path className="coverage-travel" data-route={index} d={d} pathLength="1"/><circle className="coverage-travel-head" data-head={index} data-from-x={x1} data-from-y={y1} data-to-x={x2} data-to-y={y2} cx={x1} cy={y1} r={detail?3.5:3}/></g>;
 });
 return <section className="coverage" ref={root} aria-labelledby="coverage-title">
  <div className="shell">
   <div className="coverage-heading"><div><p className="coverage-eyebrow"><span/> STYLE EXPRESS LIMO <b>/</b> OUR COVERAGE</p><h2 id="coverage-title">Every destination.<br/><em>Exceptionally served.</em></h2></div><div className="coverage-intro"><p>From Yorkshire’s towns and cities to Manchester and London, discover exceptional chauffeur travel, wherever your journey takes you.</p><Link to="/contact">PLAN YOUR JOURNEY <span>↗</span></Link></div></div>
   <div className="coverage-panel">
    <div className="coverage-map">
     <div className="coverage-map-top"><span><i/> THE UK NETWORK</span><span>{selected.lat.toFixed(2)}° N · {Math.abs(selected.lon).toFixed(2)}° W</span></div>
     <div className="coverage-map-canvas">
      <React.Suspense fallback={null}><CoverageCar/></React.Suspense>
      <svg className="coverage-uk" viewBox="-30 -140 680 1020" aria-label="United Kingdom coverage map"><path className="coverage-land" d={map.path}/><rect className="coverage-region" x="367" y="481" width="70" height="53" rx="7"/>{connections()}{locations.map(p=>marker(p))}</svg>
      <div className="coverage-detail"><div className="coverage-detail-title">YORKSHIRE <span>14 LOCATIONS</span></div><svg viewBox="0 0 600 400" aria-label="Yorkshire locations detail">{connections(true)}{locations.slice(0,14).map(p=>marker(p,true))}</svg></div>
     </div>
     <div className="coverage-map-bottom"><div className="coverage-selected" aria-live="polite"><small>SELECTED DESTINATION</small><strong>{selected.name}</strong></div><div className="coverage-legend"><i/> SELECT A LOCATION TO EXPLORE</div><small className="coverage-map-note">MAP FOR ILLUSTRATION</small></div>
    </div>
    <div className="coverage-places" ref={places} data-lenis-prevent><div className="coverage-list-title"><h3>Places we serve</h3><span>{String(visible.length+(filter==='All areas'?1:0)).padStart(2,'0')} / 17</span></div><p>Select a location to enquire about your journey.</p>
     <div className="coverage-tabs" role="group" aria-label="Filter locations">{['All areas','Yorkshire','Further afield'].map(f=><button type="button" key={f} onClick={()=>chooseFilter(f)} aria-pressed={filter===f}>{f}</button>)}</div>
     <div className="coverage-list" ref={list} aria-label="Service locations">{visible.map(p=><button type="button" className={`coverage-row ${selected.name===p.name?'is-selected':''}`} key={p.name} aria-pressed={selected.name===p.name} onClick={()=>selectLocation(p)}><span className="coverage-index">{String(p.index+1).padStart(2,'0')}</span><strong>{p.name}</strong><small>{p.index<14?'Yorkshire':'City'}</small><span className="coverage-arrow">↗</span></button>)}{filter==='All areas'&&<button type="button" className="coverage-row" onClick={()=>navigate('/contact')}><span className="coverage-index">17</span><strong>Other</strong><small>Enquire</small><span className="coverage-arrow">↗</span></button>}</div>
     <Link className="coverage-enquire" to="/contact"><span><small>Going somewhere else?</small><strong>Enquire about your journey</strong></span><b>↗</b></Link>
    </div>
   </div>
   <div className="coverage-footer"><span>THE JOURNEY IS AS IMPORTANT AS THE DESTINATION</span><span>STYLE EXPRESS LIMO</span></div>
  </div>
 </section>;
}

