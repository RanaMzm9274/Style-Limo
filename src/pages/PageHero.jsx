import React,{useState} from "react";
import {Link,useSearchParams} from "react-router-dom";
import {ArrowRight,ArrowDown} from "lucide-react";
import {cars} from "../data/cars.js";
export default function PageHero({ index, kicker, title, accent, copy, image }) {
  return (
    <section className="page-hero">
      <div
        className="page-hero-image"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="page-hero-shade" />
      <div className="shell page-hero-inner">
        <div className="section-no">
          {index} — {kicker}
        </div>
        <h1>
          {title}
          <br />
          <i>{accent}</i>
        </h1>
        <p>{copy}</p>
        <ArrowDown className="page-down" />
      </div>
    </section>
  );
}