// Sign up (Create account) / My Account button

// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { openSignupModal } from "../../redux-store/authSlice";

export default function AccountButton() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();

  const handleClick = (e) => {
    if (!isLoggedIn) {
      e.preventDefault();
      dispatch(openSignupModal());
    }
  };

  return (
    // <div><button className="link">Create account / My account</button></div>

    // <Link to="/account" className="link account-button">
    //   Create account / My account
    // </Link>
    <div>
      <NavLink
        to="/account"
        className={({ isActive }) =>
          isActive
            ? "link account-button button-text active-link"
            : "link account-button button-text"
        }
        onClick={handleClick}
      >
        {isLoggedIn ? "Account" : "Sign up"}
      </NavLink>
    </div>
  );
}
