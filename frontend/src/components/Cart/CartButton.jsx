// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function CartButton() {
  return (
    // <Link to="/cart" className="link cart-button">
    //   Cart
    // </Link>

    <NavLink
      to="/cart"
      className={({ isActive }) =>
        isActive ? "link cart-button active-link" : "link cart-button"
      }
    >
      Cart
    </NavLink>
  );
}
