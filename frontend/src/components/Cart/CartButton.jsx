// CartButton is part of the Navbar, used for navigation to the Cart-page (on click):

// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import CartContext from "../../context-store/CartContext";

export default function CartButton() {
  const cartCtx = useContext(CartContext);

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);
  // reduce() - function that reduces an array to a single value
  // arguments of reduce()-function: 1st is a functions, 2nd is a starting value (0)
  // function which is 1st argument also gets 2 arguments

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
        Cart ({totalCartItems})
      </NavLink>
    </div>
  );
}
