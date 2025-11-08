import { Link } from "react-router-dom";

import CompanyTitle from "./CompanyTitle";
import SearchBox from "./SearchBox";
import LogInOutButton from "../LoginAccount/LogInOutButton";
import AccountButton from "../LoginAccount/AccountButton";
import CartButton from "../Cart/CartButton";
import CategoriesBox from "../Category/CategoriesBox";

export default function Header() {
  return (
    <header id="header">
      <div className="header-box">
        <div className="header-top-left header-box-item">
          <button>
            <Link to="/">Home</Link>
          </button>

          <CompanyTitle className="header-box-item" />
        </div>

        <SearchBox />

        <nav className="login-account-navigation header-box-item">
          <ul className="button-list">
            <li>
              <LogInOutButton />
            </li>
            <li>
              <Link to="/account">
                <AccountButton />
              </Link>
            </li>
            <li>
              <Link to="/cart">
                <CartButton />
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="header-box">{/* categories picker */}</div>
      <CategoriesBox />
    </header>
  );
}
