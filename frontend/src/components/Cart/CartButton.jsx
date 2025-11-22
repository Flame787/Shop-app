// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function CartButton() {
  return (
    // <Link to="/cart" className="link cart-button">
    //   Cart
    // </Link>
    <div>
      <NavLink
        to="/cart"
        className={({ isActive }) =>
          isActive
            ? "link cart-button button-text active-link"
            : "link button-text cart-button"
        }
      >
        Cart
      </NavLink>
    </div>
  );
}
