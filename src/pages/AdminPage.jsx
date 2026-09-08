import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, CalendarCog, CarFront, Check, Eye, EyeOff, LogOut, Save, ShieldCheck, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const request = async (url, options) => {
  const response = await fetch(url, options);
  const body = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body?.error || "Something went wrong.");
  return body;
};

function AuthScreen({ needsSetup, onAuthenticated }) {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (needsSetup && form.password !== form.confirm) return setError("Passwords do not match.");
    setBusy(true);
    try {
      await request(needsSetup ? "/api/auth/setup" : "/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      onAuthenticated();
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <main className="admin-auth">
    <Link to="/" className="admin-back"><ArrowLeft size={16}/> BACK TO WEBSITE</Link>
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="auth-mark"><ShieldCheck size={22}/></div>
      <p className="admin-kicker">STYLE EXPRESS LIMO CONTROL ROOM</p>
      <h1 id="auth-title">{needsSetup ? "Create your admin account" : "Welcome back"}</h1>
      <p className="auth-lead">{needsSetup ? "Secure the control room before publishing your first update." : "Sign in to manage the website experience."}</p>
      <form onSubmit={submit}>
        <label>Email address<input type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
        <label>Password<div className="password-field"><input type={showPassword?"text":"password"} autoComplete={needsSetup?"new-password":"current-password"} minLength={needsSetup?10:1} required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/><button type="button" aria-label={showPassword?"Hide password":"Show password"} aria-pressed={showPassword} onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>
        {needsSetup && <label>Confirm password<div className="password-field"><input type={showPassword?"text":"password"} autoComplete="new-password" minLength="10" required value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})}/><button type="button" aria-label={showPassword?"Hide password confirmation":"Show password confirmation"} aria-pressed={showPassword} onClick={()=>setShowPassword(value=>!value)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>}
        {error && <div className="form-error" role="alert">{error}</div>}
        <button className="admin-primary" disabled={busy}>{busy ? "PLEASE WAIT…" : needsSetup ? "CREATE ADMIN" : "SIGN IN"}</button>
      </form>
    </section>
  </main>;
}

function BannerEditor({ initial, userEmail, onLogout }) {
  const [banner, setBanner] = useState(initial);
  const [files, setFiles] = useState({});
  const [status, setStatus] = useState({ type: "", text: "" });
  const [busy, setBusy] = useState(false);
  const fileInputs = useRef([]);
  const update = (key, value) => setBanner(current => ({ ...current, [key]: value }));
  const updateCar = (index, key, value) => setBanner(current => ({ ...current, cars: current.cars.map((car, i) => i === index ? { ...car, [key]: value } : car) }));
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setStatus({type:"",text:""});
    const data = new FormData(); data.append("banner", JSON.stringify(banner));
    Object.entries(files).forEach(([index, file]) => data.append(`model_${index}`, file));
    try {
      const saved = await request("/api/admin/banner", { method: "PUT", body: data });
      setBanner(saved); setFiles({}); fileInputs.current.forEach(input => { if (input) input.value = ""; });
      setStatus({ type: "success", text: "Banner published successfully." });
    } catch (err) { setStatus({ type: "error", text: err.message }); } finally { setBusy(false); }
  };
  return <div className="admin-app">
    <aside className="admin-sidebar">
      <Link to="/" className="admin-logo">STYLE <span>EXPRESS</span> LIMO</Link>
      <nav aria-label="Admin sections"><Link className="active" to="/admin"><CarFront size={18}/> Homepage banner</Link><Link to="/admin/fleet"><CarFront size={18}/> Fleet catalog</Link><Link to="/admin/booking-settings"><CalendarCog size={18}/> Booking details</Link></nav>
      <div className="admin-user"><span>{userEmail}</span><button onClick={onLogout}><LogOut size={16}/> SIGN OUT</button></div>
    </aside>
    <main className="admin-main">
      <header className="admin-header"><div><p className="admin-kicker">CONTENT / HOMEPAGE</p><h1>Banner management</h1><p>Update the live headline, tagline, car names and GLB models.</p></div><Link to="/" target="_blank">VIEW WEBSITE ↗</Link></header>
      <form onSubmit={submit} className="admin-form">
        <section className="admin-card"><div className="admin-card-head"><span>01</span><div><h2>Banner copy</h2><p>Text changes appear on the first homepage viewport.</p></div></div><div className="admin-fields">
          <label className="wide">Eyebrow<input required maxLength="90" value={banner.eyebrow} onChange={e=>update("eyebrow",e.target.value)}/></label>
          <label>Headline — first line<input required maxLength="40" value={banner.headingLine1} onChange={e=>update("headingLine1",e.target.value)}/></label>
          <label>Headline — second line<input required maxLength="40" value={banner.headingLine2} onChange={e=>update("headingLine2",e.target.value)}/></label>
          <label>Tagline — first line<input required maxLength="70" value={banner.taglineLine1} onChange={e=>update("taglineLine1",e.target.value)}/></label>
          <label>Tagline — second line<input required maxLength="70" value={banner.taglineLine2} onChange={e=>update("taglineLine2",e.target.value)}/></label>
        </div></section>
        <section className="admin-card"><div className="admin-card-head"><span>02</span><div><h2>Spotlight vehicles</h2><p>Replace a GLB or rename any car in the homepage selector.</p></div></div><div className="admin-cars">
          {banner.cars.map((car,index)=><article className="admin-car" key={car.id}><div className="admin-car-no">0{index+1}</div><div className="admin-car-fields"><label>Brand<input required maxLength="35" value={car.brand} onChange={e=>updateCar(index,"brand",e.target.value)}/></label><label>Car name<input required maxLength="45" value={car.name} onChange={e=>updateCar(index,"name",e.target.value)}/></label><label className="model-path">Current GLB<span>{files[index]?.name || car.model}</span></label></div><label className="upload-control"><input ref={el=>fileInputs.current[index]=el} type="file" accept=".glb,model/gltf-binary" onChange={e=>setFiles(current=>({...current,[index]:e.target.files[0]}))}/><Upload size={17}/>{files[index] ? "GLB SELECTED" : "REPLACE GLB"}</label></article>)}
        </div></section>
        <div className="admin-savebar"><div>{status.text && <span className={status.type} role="status">{status.type==="success"&&<Check size={15}/>} {status.text}</span>}</div><button className="admin-primary" disabled={busy}><Save size={17}/>{busy ? "PUBLISHING…" : "PUBLISH CHANGES"}</button></div>
      </form>
    </main>
  </div>;
}

export default function AdminPage() {
  const [state, setState] = useState({ loading: true, authenticated: false, needsSetup: false, user: null, banner: null });
  const navigate = useNavigate();
  const load = async () => {
    try {
      const auth = await request("/api/auth/status");
      const banner = auth.authenticated ? await request("/api/admin/banner") : null;
      setState({ loading:false, ...auth, banner });
    } catch { setState(current=>({...current,loading:false})); }
  };
  useEffect(()=>{ load(); },[]);
  const logout = async () => { await request("/api/auth/logout",{method:"POST"}); navigate("/admin",{replace:true}); setState(current=>({...current,authenticated:false,user:null,banner:null})); };
  if(state.loading) return <main className="admin-loading" role="status">OPENING CONTROL ROOM…</main>;
  if(!state.authenticated) return <AuthScreen needsSetup={state.needsSetup} onAuthenticated={load}/>;
  return <BannerEditor initial={state.banner} userEmail={state.user.email} onLogout={logout}/>;
}
