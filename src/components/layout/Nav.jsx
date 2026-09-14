import React,{useEffect,useState} from "react";
import {Link,useLocation} from "react-router-dom";
import {ArrowRight,Menu,X} from "lucide-react";

export default function Nav(){
  const[open,setOpen]=useState(false),[theme,setTheme]=useState(()=>localStorage.getItem("style-express-theme")||"dark"),location=useLocation();
  useEffect(()=>{document.documentElement.dataset.theme=theme;localStorage.setItem("style-express-theme",theme)},[theme]);
  useEffect(()=>setOpen(false),[location.pathname]);
  return <header className="nav"><div className="shell nav-in"><Link className="logo" to="/" aria-label="Style Express Limo home"><img src="/style-express-logo.png" alt="Style Express Limo" /></Link><nav className={open?"links open":"links"}><Link to="/about">About</Link><Link to="/services">Services</Link><Link to="/fleet">Fleet</Link><Link to="/booking">Booking</Link></nav><button className="theme-toggle" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>{theme==="dark"?"☼ LIGHT":"◐ DARK"}</button><Link to="/booking" className="book-top">BOOK A CAR <ArrowRight size={15}/></Link><button className="menu" aria-label={open?"Close menu":"Open menu"} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button></div></header>
}
