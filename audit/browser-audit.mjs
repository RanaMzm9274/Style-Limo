import { chromium } from 'file:///C:/Users/HOME/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';
import fs from 'node:fs';
const browser=await chromium.launch({executablePath:'C:/Users/HOME/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe',headless:true});
const results=[];
for(const width of [1440,390]) {
 const page=await browser.newPage({viewport:{width,height:900}});
 for(const route of ['/','/about','/services','/fleet','/booking']) {
  const errors=[],failed=[]; const onError=e=>errors.push(e.message); const onResponse=r=>{if(r.status()>=400)failed.push([r.status(),r.url()])};
  page.on('pageerror',onError);page.on('response',onResponse);
  await page.goto('http://localhost:5173'+route,{waitUntil:'networkidle'}).catch(e=>errors.push(e.message));
  await page.waitForTimeout(700);
  const sections=[];
  for(const el of await page.locator('section').all()) {await el.scrollIntoViewIfNeeded().catch(()=>{});await page.waitForTimeout(100);sections.push(await el.evaluate(e=>({class:e.className,height:Math.round(e.getBoundingClientRect().height),text:e.innerText.slice(0,130),opacity:getComputedStyle(e).opacity})));}
  await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(400);
  await page.screenshot({path:`audit/${width}-${route.replaceAll('/','')||'home'}.png`,fullPage:true});
  results.push({width,route,errors,failed,sections,...await page.evaluate(()=>({canvas:document.querySelectorAll('canvas').length,footers:document.querySelectorAll('footer').length,bodyWidth:document.body.scrollWidth,viewport:innerWidth,brokenImages:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),modelRequests:performance.getEntriesByType('resource').filter(r=>/glb|draco/.test(r.name)).map(r=>r.name)}))});
  page.off('pageerror',onError);page.off('response',onResponse);
 }
 await page.close();
}
fs.writeFileSync('audit/browser-results.json',JSON.stringify(results,null,2)); console.log(JSON.stringify(results,null,2));await browser.close();

