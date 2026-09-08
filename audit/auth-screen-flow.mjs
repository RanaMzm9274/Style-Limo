import {chromium} from "file:///C:/Users/HOME/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";
const base=process.env.TEST_BASE_URL||"http://localhost:5173";
const browser=await chromium.launch({executablePath:"C:/Users/HOME/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe",headless:true});
const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];page.on("pageerror",error=>errors.push(error.message));
await page.goto(`${base}/admin`,{waitUntil:"networkidle"});await page.getByRole("heading",{name:"Create your admin account"}).waitFor();
const password=page.getByLabel("Password",{exact:true});await password.fill("VisiblePassword123!");const before=await password.getAttribute("type");await page.getByRole("button",{name:"Show password",exact:true}).click();const after=await password.getAttribute("type");await page.screenshot({path:"audit/create-admin-screen.png",fullPage:true});
console.log(JSON.stringify({createScreen:true,passwordTypeBefore:before,passwordTypeAfter:after,errors}));await browser.close();
