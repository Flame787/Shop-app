import { NavLink } from "react-router-dom";

export default function Payment() {
  return (
    <section className="payment-section div-center">
      <p className="div-center">some content about Payment</p>
      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "link button-text home-button home2-button active-link"
            : "link button-text home-button home2-button"
        }
      >
        Home
      </NavLink>
    </section>
  );
}
