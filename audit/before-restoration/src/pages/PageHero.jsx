import {ArrowDown} from "lucide-react";
function PageHero({ index, kicker, title, accent, copy, image }) {
  return (
    <section className="page-hero">
      <div
        className="page-hero-image"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="page-hero-shade" />
      <div className="shell page-hero-inner">
        <div className="section-no">
          {index} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â {kicker}
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

export default PageHero;

