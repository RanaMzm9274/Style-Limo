import { chromium } from "file:///C:/Users/HOME/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs";

const base = process.env.TEST_BASE_URL || "http://localhost:5173";
const browser = await chromium.launch({ executablePath: "C:/Users/HOME/AppData/Local/ms-playwright/chromium-1217/chrome-win64/chrome.exe", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
await page.goto(`${base}/admin`, { waitUntil: "networkidle" });
if (await page.getByRole("heading", { name: "Create your admin account" }).count()) {
  await page.getByLabel("Email address").fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("SecurePass123!");
  await page.getByLabel("Confirm password").fill("SecurePass123!");
  await page.getByRole("button", { name: "CREATE ADMIN" }).click();
} else if (await page.getByRole("heading", { name: "Welcome back" }).count()) {
  await page.getByLabel("Email address").fill("admin@example.com");
  await page.getByLabel("Password", { exact: true }).fill("SecurePass123!");
  await page.getByRole("button", { name: "SIGN IN" }).click();
}
await page.getByRole("heading", { name: "Banner management" }).waitFor();
await page.getByLabel("Headline — first line").fill("Test headline");
await page.locator('.upload-control input[type="file"]').first().setInputFiles("public/models/2022_porsche_911_gt3_992-optimized.glb");
await page.getByRole("button", { name: "PUBLISH CHANGES" }).click();
await page.getByText("Banner published successfully.").waitFor();
const saved = await page.evaluate(() => fetch("/api/admin/banner").then(response => response.json()));
if (!saved.cars[0].model.startsWith("/uploads/models/")) throw new Error("Uploaded model path was not saved.");
const modelResponse = await page.evaluate(path => fetch(path).then(response => ({ status: response.status, size: Number(response.headers.get("content-length")) })), saved.cars[0].model);
if (modelResponse.status !== 200 || modelResponse.size < 1_000_000) throw new Error("Uploaded GLB is not being served correctly.");
await page.goto(base, { waitUntil: "networkidle" });
await page.getByRole("heading", { level: 1 }).getByText("Test headline").waitFor();
await page.waitForTimeout(2500);
const requestedUploadedModel = await page.evaluate(path => performance.getEntriesByType("resource").some(entry => entry.name.includes(path)), saved.cars[0].model);
console.log(JSON.stringify({ adminLoaded: true, publishSucceeded: true, homepageUpdated: true, uploadedModel: saved.cars[0].model, uploadedBytes: modelResponse.size, uploadedModelRequestedByHomepage: requestedUploadedModel, errors }));
await browser.close();
