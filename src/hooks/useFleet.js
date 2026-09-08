import { useEffect, useState } from "react";
import { cars as fallbackCars } from "../data/cars.js";

export const fallbackFleet={categories:["PERFORMANCE","LUXURY","SUV","CHAUFFEUR"],vehicles:fallbackCars.map((car,index)=>({...car,id:`fallback-${index}`,categories:index<3?["PERFORMANCE"]:index===4?["LUXURY","SUV","CHAUFFEUR"]:["LUXURY","CHAUFFEUR"],variations:[],colors:[],model:car.name,engineCapacity:"—",topSpeed:car.speed,acceleration:car.zero,available:true}))};
let cached;let pending;
const normalize=data=>({...data,vehicles:data.vehicles.map(car=>({...car,speed:car.topSpeed||car.speed,zero:car.acceleration||car.zero,topSpeed:car.topSpeed||car.speed,acceleration:car.acceleration||car.zero}))});
const load=()=>cached?Promise.resolve(cached):(pending||=(fetch("/api/public/fleet").then(response=>response.ok?response.json():Promise.reject()).then(data=>(cached=normalize(data))).finally(()=>pending=null)));
export function useFleet(){const[fleet,setFleet]=useState(cached||fallbackFleet);useEffect(()=>{let active=true;load().then(data=>active&&setFleet(data)).catch(()=>{});return()=>{active=false}},[]);return fleet}
export function refreshFleetCache(data){cached=normalize(data)}
