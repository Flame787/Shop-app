// import { Link } from "react-router-dom";
// Link enables smooth navigation to other parts of the SPA without rerendering full page. "Back <-" button also works nicely.

export default function Home() {
  const images = [
    "/images/promotion/super-office1.png",
    "/images/promotion/super-office2.png",
    "/images/promotion/super-office3.png",
    "/images/promotion/super-office4.png",
    "/images/promotion/super-office5.png",
    "/images/promotion/super-office6.png",
    "/images/promotion/super-office7.png",
  ];

  const allImages = [...images, ...images]; // original + duplicates (for infinite scroll)

  return (
    <>
      {/* <h3 className="div-center main-title2">Home page</h3> */}

      <div className="div-center">
        <img
          className="img-promotion"
          src="/images/promotion/SmartSpace.png"
          alt="Promotion"
        />
      </div>

      {/* automatic infinite scroll picture animation */}

      <div className="img-slider">
        <div className="img-track">
          {allImages.map((src, index) => (
            <img
              key={index}
              src={src}
              className="img-animation"
              alt={`office-${index}`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
