import fs from 'node:fs';import {parse} from '@babel/parser';
fs.cpSync('src','audit/before-restoration/src',{recursive:true});fs.copyFileSync('index.html','audit/before-restoration/index.html');
const source=fs.readFileSync('audit/previous-complete-App.jsx','utf8');const ast=parse(source,{sourceType:'module',plugins:['jsx']});
const get=name=>{const n=ast.program.body.find(n=>n.type==='FunctionDeclaration'&&n.id.name===name);if(!n)throw Error(name);return source.slice(n.start,n.end)};
const sections=['Manifesto','Experience','Fleet','CarListing','Numbers','Chauffeur','Journey','Destinations','Reviews','Booking'];
fs.writeFileSync('src/components/sections/HomeSections.jsx','import React,{useRef,useState} from "react";\nimport {Link,useNavigate} from "react-router-dom";\nimport {ArrowRight,ChevronLeft,ChevronRight} from "lucide-react";\nimport gsap from "gsap";\nimport {useGSAP} from "@gsap/react";\nimport {cars} from "../../data/cars.js";\n\n'+sections.map(n=>'export '+get(n)).join('\n\n'));
fs.writeFileSync('src/components/sections/SelBanner.jsx','import React,{useEffect,useRef,useState} from "react";\nimport {ArrowRight,ArrowDown} from "lucide-react";\nimport gsap from "gsap";\nimport {useGSAP} from "@gsap/react";\nimport {ConfiguratorScene} from "../three/ConfiguratorScene.jsx";\nimport {configuratorCars,paintColors} from "../../data/cars.js";\n\nexport default '+get('SelBanner'));
for(const [file,name] of [['AboutPage','AboutPage'],['ServicesPage','ServicesPage'],['FleetPage','FilteredFleetPage'],['BookingPage','BookingPage'],['PageHero','PageHero']]){
 const imports='import React,{useState} from "react";\nimport {Link,useSearchParams} from "react-router-dom";\nimport {ArrowRight,ArrowDown} from "lucide-react";\nimport {cars} from "../data/cars.js";\n'+(name==='PageHero'?'':'import PageHero from "./PageHero.jsx";\nimport ServicesGrid from "../components/sections/ServicesGrid.jsx";\nimport ThreeDConfigurator from "../components/three/ThreeDConfigurator.jsx";\nimport {Numbers,Reviews,Journey} from "../components/sections/HomeSections.jsx";\n');
 fs.writeFileSync('src/pages/'+file+'.jsx',imports+'export default '+get(name).replaceAll('<Footer />',''));
}
let home=fs.readFileSync('src/pages/HomePage.jsx','utf8').replace('      <Footer />','');fs.writeFileSync('src/pages/HomePage.jsx',home);
console.log('Restored full section and banner functions plus page source from complete snapshot.');
