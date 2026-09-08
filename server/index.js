import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import multer from "multer";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {createStorage} from "./storage.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const dataDir = process.env.DRIVE_DATA_DIR ? path.resolve(process.env.DRIVE_DATA_DIR) : path.join(here, "data");
const publicUploadDir = process.env.DRIVE_UPLOAD_DIR ? path.resolve(process.env.DRIVE_UPLOAD_DIR) : path.join(root, "public", "uploads");
const uploadDir = path.join(publicUploadDir, "models");
const dbFile = path.join(dataDir, "db.json");
fs.mkdirSync(dataDir, { recursive: true });
fs.mkdirSync(uploadDir, { recursive: true });

const seedBanner = {
  eyebrow: "EXCEPTIONAL CARS. EXTRAORDINARY JOURNEYS.",
  headingLine1: "Beyond the",
  headingLine2: "ordinary.",
  taglineLine1: "For the drive. For the arrival.",
  taglineLine2: "For the moments that stay with you.",
  cars: [
    { id: "gt3", brand: "PORSCHE", name: "911 GT3", power: "510 PS", zero: "3.4 SEC", speed: "198 MPH", price: "£495 / DAY", model: "/models/2022_porsche_911_gt3_992-optimized.glb", rot: [0, 0, 0] },
    { id: "huracan", brand: "LAMBORGHINI", name: "HURACÁN EVO", power: "640 PS", zero: "2.9 SEC", speed: "202 MPH", price: "£795 / DAY", model: "/models/2019_lamborghini_huracan_evo-optimized.glb", rot: [0, 0, 0] },
    { id: "gt", brand: "BENTLEY", name: "CONTINENTAL GT", power: "542 PS", zero: "3.9 SEC", speed: "198 MPH", price: "£575 / DAY", model: "/models/bentley-continental-gt.glb", rot: [0, Math.PI, 0] },
    { id: "rr", brand: "RANGE ROVER", name: "AUTOBIOGRAPHY", power: "523 PS", zero: "4.4 SEC", speed: "155 MPH", price: "£450 / DAY", model: "/models/2022_land_rover_range_rover.glb", rot: [0, 0, 0] },
  ],
};
const seedFleet = {
  categories: ["PERFORMANCE", "LUXURY", "SUV", "CHAUFFEUR"],
  vehicles: [
    { id:"911-gt3", name:"911 GT3", brand:"PORSCHE", categories:["PERFORMANCE"], variations:["Standard"], colors:["Black","White","Red"], model:"2022", engineCapacity:"4.0L", power:"510 PS", topSpeed:"198 MPH", acceleration:"3.4 SEC", price:"495", image:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1800&q=88", available:true },
    { id:"huracan", name:"HURACÁN", brand:"LAMBORGHINI", categories:["PERFORMANCE"], variations:["EVO"], colors:["Black","White","Red"], model:"EVO", engineCapacity:"5.2L V10", power:"640 PS", topSpeed:"202 MPH", acceleration:"2.9 SEC", price:"795", image:"https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1800&q=88", available:true },
    { id:"720s", name:"720S", brand:"McLAREN", categories:["PERFORMANCE"], variations:["Coupe"], colors:["Black","Orange"], model:"720S", engineCapacity:"4.0L V8", power:"710 PS", topSpeed:"212 MPH", acceleration:"2.8 SEC", price:"850", image:"https://static.europeluxurycars.com/wp-content/uploads/2023/12/mclaren-720s-1-1200x798.jpg", available:true },
    { id:"continental-gt", name:"CONTINENTAL GT", brand:"BENTLEY", categories:["LUXURY","CHAUFFEUR"], variations:["GT"], colors:["Black","Silver"], model:"Continental GT", engineCapacity:"4.0L V8", power:"542 PS", topSpeed:"198 MPH", acceleration:"3.9 SEC", price:"575", image:"https://response.jp/imgs/p/mSBHZs93KjT34JZkZm4W_4RJWEBBQkNERUZH/1465910.jpg", available:true },
    { id:"range-rover", name:"RANGE ROVER", brand:"AUTOBIOGRAPHY", categories:["LUXURY","SUV","CHAUFFEUR"], variations:["LWB"], colors:["Black","Green"], model:"Autobiography LWB", engineCapacity:"4.4L V8", power:"523 PS", topSpeed:"155 MPH", acceleration:"4.4 SEC", price:"450", image:"https://belgravesoflondon.com/wp-content/uploads/2021/05/executive-chauffeur-range-rover-lwb4.jpeg", available:true },
    { id:"s-class", name:"S-CLASS", brand:"MERCEDES-MAYBACH", categories:["LUXURY","CHAUFFEUR"], variations:["S 580"], colors:["Black","Silver"], model:"S-Class", engineCapacity:"4.0L V8", power:"496 PS", topSpeed:"155 MPH", acceleration:"4.8 SEC", price:"POA", image:"https://images.ctfassets.net/3kdhxn53hlo9/4kWW5hgARXRMtCyvEU7zNu/0cccd834c5cae763579e95796a45d608/AS106842__1_.webp", available:true }
  ]
};
const seedBookingSettings={kicker:"01 — RESERVATION",titleLine1:"BOOK",titleLine2:"YOUR DRIVE.",intro:"Build your request in three quick steps. No payment is taken at this stage.",services:["Self Drive","Private Chauffeur","Airport Transfer"],durations:["1 Day","2 Days","Weekend","1 Week","Long Term"],minimumNoticeDays:0,confirmationKicker:"REQUEST RECEIVED",confirmationTitleLine1:"YOUR JOURNEY",confirmationTitleLine2:"STARTS HERE.",confirmationMessage:"Our concierge team will review your request and contact you with availability."};
const store=await createStorage({dbFile,migrationFile:path.join(root,"database","migrations","001_admin_portal.sql"),defaults:{banner:seedBanner,fleet:seedFleet,booking_settings:seedBookingSettings}});

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use("/uploads", express.static(publicUploadDir, { fallthrough: false }));

const attempts = new Map();
const rateLimit = (req, res, next) => {
  const key = req.ip;
  const now = Date.now();
  const recent = (attempts.get(key) || []).filter((time) => now - time < 15 * 60_000);
  if (recent.length >= 10) return res.status(429).json({ error: "Too many attempts. Try again in 15 minutes." });
  recent.push(now); attempts.set(key, recent); next();
};
const tokenHash = (token) => crypto.createHash("sha256").update(token).digest("hex");
const setSession = async (req,res,userId) => {
  const token = crypto.randomBytes(32).toString("hex");
  await store.createSession({tokenHash:tokenHash(token),userId,expiresAt:new Date(Date.now()+7*864e5).toISOString(),ip:req.ip,userAgent:req.get("user-agent")});
  res.cookie("style_express_admin", token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production", maxAge: 7 * 864e5, path: "/" });
};
const requireAdmin = async (req, res, next) => {
  const token = req.cookies.style_express_admin;
  const user = token&&await store.findUserBySession(tokenHash(token));
  if (!user) return res.status(401).json({ error: "Authentication required." });
  req.user = user; next();
};

app.get("/api/public/banner", async(_req, res) => res.json(await store.getContent("banner")));
app.get("/api/public/fleet", async(_req, res) => res.json(await store.getContent("fleet")));
app.get("/api/public/booking-settings",async(_req,res)=>res.json(await store.getContent("booking_settings")));
app.get("/api/auth/status", async(req, res) => {
  const token = req.cookies.style_express_admin;
  const user = token&&await store.findUserBySession(tokenHash(token));
  res.json({ authenticated: Boolean(user), needsSetup: (await store.userCount()) === 0, user: user ? { email: user.email,role:user.role } : null,storage:store.mode });
});
app.post("/api/auth/setup", rateLimit, async (req, res) => {
  if (await store.userCount()) return res.status(409).json({ error: "Admin account already exists." });
  const email = String(req.body.email || "").trim().toLowerCase();
  const password = String(req.body.password || "");
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: "Enter a valid email address." });
  if (password.length < 10) return res.status(400).json({ error: "Password must contain at least 10 characters." });
  const user=await store.createUser({email,passwordHash:await bcrypt.hash(password,12)});await setSession(req,res,user.id);res.status(201).json({email:user.email});
});
app.post("/api/auth/login", rateLimit, async (req, res) => {
  const email = String(req.body.email || "").trim().toLowerCase();
  const user = await store.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(String(req.body.password || ""), user.passwordHash))) return res.status(401).json({ error: "Email or password is incorrect." });
  attempts.delete(req.ip); await setSession(req,res,user.id); res.json({ email: user.email });
});
app.post("/api/auth/logout", requireAdmin, async(req, res) => {
  await store.deleteSession(tokenHash(req.cookies.style_express_admin));res.clearCookie("style_express_admin", { path: "/" }); res.status(204).end();
});
app.get("/api/admin/banner", requireAdmin, async(req, res) => res.json(await store.getContent("banner")));
app.get("/api/admin/booking-settings",requireAdmin,async(req,res)=>res.json(await store.getContent("booking_settings")));
app.get("/api/admin/fleet", requireAdmin, async(req, res) => res.json(await store.getContent("fleet")));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomBytes(5).toString("hex")}${path.extname(file.originalname).toLowerCase()}`),
});
const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(file.originalname.toLowerCase().endsWith(".glb") ? null : new Error("Only .glb files are allowed."), file.originalname.toLowerCase().endsWith(".glb")) });
app.put("/api/admin/banner", requireAdmin, upload.any(), async(req, res) => {
  let payload;
  try { payload = JSON.parse(req.body.banner); } catch { return res.status(400).json({ error: "Invalid banner data." }); }
  const required = ["eyebrow", "headingLine1", "headingLine2", "taglineLine1", "taglineLine2"];
  if (required.some((key) => !String(payload[key] || "").trim())) return res.status(400).json({ error: "All banner text fields are required." });
  if (!Array.isArray(payload.cars) || payload.cars.length < 1 || payload.cars.length > 8) return res.status(400).json({ error: "Banner must have 1 to 8 cars." });
  const files = new Map((req.files || []).map((file) => [file.fieldname, file]));
  payload.cars = payload.cars.map((car, index) => ({ ...car, id: String(car.id), brand: String(car.brand).trim(), name: String(car.name).trim(), model: files.get(`model_${index}`) ? `/uploads/models/${files.get(`model_${index}`).filename}` : String(car.model), rot: Array.isArray(car.rot) ? car.rot : [0, 0, 0] }));
  if (payload.cars.some((car) => !car.id || !car.brand || !car.name || !car.model)) return res.status(400).json({ error: "Every car needs a brand, name and GLB model." });
  for(const file of req.files||[])await store.recordMedia({kind:"glb",publicUrl:`/uploads/models/${file.filename}`,originalName:file.originalname,mimeType:file.mimetype||"model/gltf-binary",sizeBytes:file.size,uploadedBy:req.user.id});
  res.json(await store.setContent("banner",payload,req.user.id,req.ip));
});
app.put("/api/admin/booking-settings",requireAdmin,async(req,res)=>{const input=req.body||{};const textKeys=["kicker","titleLine1","titleLine2","intro","confirmationKicker","confirmationTitleLine1","confirmationTitleLine2","confirmationMessage"];const settings={...seedBookingSettings,...Object.fromEntries(textKeys.map(key=>[key,String(input[key]||"").trim()])),services:Array.isArray(input.services)?input.services.map(value=>String(value).trim()).filter(Boolean):[],durations:Array.isArray(input.durations)?input.durations.map(value=>String(value).trim()).filter(Boolean):[],minimumNoticeDays:Math.max(0,Math.min(365,Number(input.minimumNoticeDays)||0))};if(textKeys.some(key=>!settings[key]))return res.status(400).json({error:"All booking text fields are required."});if(!settings.services.length||settings.services.length>20)return res.status(400).json({error:"Add between 1 and 20 services."});if(!settings.durations.length||settings.durations.length>20)return res.status(400).json({error:"Add between 1 and 20 durations."});res.json(await store.setContent("booking_settings",settings,req.user.id,req.ip))});
const imageUpload = multer({ storage: multer.diskStorage({ destination: (_req,_file,cb)=>{const dir=path.join(publicUploadDir,"fleet");fs.mkdirSync(dir,{recursive:true});cb(null,dir)}, filename:(_req,file,cb)=>cb(null,`${Date.now()}-${crypto.randomBytes(5).toString("hex")}${path.extname(file.originalname).toLowerCase()}`) }), limits:{fileSize:15*1024*1024}, fileFilter:(_req,file,cb)=>{const ok=/^image\/(jpeg|png|webp|avif)$/.test(file.mimetype);cb(ok?null:new Error("Only JPG, PNG, WebP or AVIF images are allowed."),ok)} });
app.put("/api/admin/fleet", requireAdmin, imageUpload.any(), async(req,res)=>{
  let payload;
  try{payload=JSON.parse(req.body.fleet)}catch{return res.status(400).json({error:"Invalid fleet data."})}
  const categories=[...new Set((payload.categories||[]).map(value=>String(value).trim().toUpperCase()).filter(Boolean))];
  if(!categories.length||categories.length>20)return res.status(400).json({error:"Add between 1 and 20 categories."});
  if(!Array.isArray(payload.vehicles)||!payload.vehicles.length||payload.vehicles.length>100)return res.status(400).json({error:"Fleet must contain between 1 and 100 vehicles."});
  const files=new Map((req.files||[]).map(file=>[file.fieldname,file]));
  const vehicles=payload.vehicles.map((vehicle,index)=>{const uploaded=files.get(`image_${index}`);return {...vehicle,id:String(vehicle.id||crypto.randomUUID()),name:String(vehicle.name||"").trim(),brand:String(vehicle.brand||"").trim(),categories:(vehicle.categories||[]).filter(category=>categories.includes(category)),variations:(vehicle.variations||[]).map(String).map(value=>value.trim()).filter(Boolean),colors:(vehicle.colors||[]).map(String).map(value=>value.trim()).filter(Boolean),model:String(vehicle.model||"").trim(),engineCapacity:String(vehicle.engineCapacity||"").trim(),power:String(vehicle.power||"").trim(),topSpeed:String(vehicle.topSpeed||"").trim(),acceleration:String(vehicle.acceleration||"").trim(),price:String(vehicle.price||"").trim(),image:uploaded?`/uploads/fleet/${uploaded.filename}`:String(vehicle.image||"").trim(),available:vehicle.available!==false}});
  if(vehicles.some(vehicle=>!vehicle.name||!vehicle.brand||!vehicle.model||!vehicle.engineCapacity||!vehicle.topSpeed||!vehicle.acceleration||!vehicle.price||!vehicle.image||!vehicle.categories.length))return res.status(400).json({error:"Complete all required vehicle fields and select a category."});
  for(const file of req.files||[])await store.recordMedia({kind:"fleet_image",publicUrl:`/uploads/fleet/${file.filename}`,originalName:file.originalname,mimeType:file.mimetype,sizeBytes:file.size,uploadedBy:req.user.id});
  res.json(await store.setContent("fleet",{categories,vehicles},req.user.id,req.ip));
});

app.use((error, _req, res, _next) => res.status(error instanceof multer.MulterError ? 400 : 500).json({ error: error.message || "Server error." }));
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(root, "dist")));
  app.get("/{*splat}", (_req, res) => res.sendFile(path.join(root, "dist", "index.html")));
}
const port = Number(process.env.PORT || 4000);
app.listen(port, () => console.log(`Style Express Limo API running at http://localhost:${port}`));
