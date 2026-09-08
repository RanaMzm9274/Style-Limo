import { chromium } from 'file:///C:/Users/HOME/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Users/HOME/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe',headless:true});
const page=await browser.newPage({viewport:{width:1200,height:800}});const errors=[];page.on('pageerror',e=>{errors.push(e.message);console.log(e.message)});page.on('console',m=>console.log(m.text()));page.on('response',r=>{if(r.status()>=400)console.log(r.status(),r.url())});
await page.route('**/src/main.jsx*',route=>route.fulfill({contentType:'text/javascript',body:`import React from '/node_modules/.vite/deps/react.js';import ReactDOM from '/node_modules/.vite/deps/react-dom_client.js';import {ConfiguratorScene} from '/src/components/three/ConfiguratorScene.jsx';import {configuratorCars} from '/src/data/cars.js';window.auditCars=configuratorCars;const root=ReactDOM.createRoot(document.getElementById('root'));window.showCar=(i)=>root.render(React.createElement('div',{style:{height:'740px',background:'#303530'}},React.createElement(ConfiguratorScene,{car:configuratorCars[i],color:'#9d0d14',progress:{current:0},dragRotation:{current:0}})));window.showCar(0);`}));
await page.goto(process.env.TEST_BASE_URL||'http://localhost:5173'); const results=[];
for(let i=0;i<4;i++){await page.waitForFunction(()=>!!window.showCar,{},{timeout:10000});await page.evaluate(i=>window.showCar(i),i);await page.waitForTimeout(3500);await page.screenshot({path:`audit/model-${i}.png`});results.push({i,errors:[...errors],loader:await page.locator('.model-loader').count(),canvas:await page.locator('canvas').count()});}
fs.writeFileSync('audit/model-results.json',JSON.stringify(results,null,2));console.log(results);await browser.close();



