// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function AccountButton() {
  return (
    // <div><button className="link">Create account / My account</button></div>

    // <Link to="/account" className="link account-button">
    //   Create account / My account
    // </Link>

    <NavLink
      to="/account"
      className={({ isActive }) =>
        isActive ? "link account-button active-link" : "link account-button"
      }
    >
      Create account / My account
    </NavLink>
  );
}
