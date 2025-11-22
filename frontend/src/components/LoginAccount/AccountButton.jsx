// Sign up (Create account) / My Account button

// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function AccountButton() {
  return (
    // <div><button className="link">Create account / My account</button></div>

    // <Link to="/account" className="link account-button">
    //   Create account / My account
    // </Link>
<div>
    <NavLink
      to="/account"
      className={({ isActive }) =>
        isActive ? "link account-button button-text active-link" : "link account-button button-text"
      }
    >
      Sign up
    </NavLink></div>
  );
}
