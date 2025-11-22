// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
// instead Link, we can use NavLink - automatically applies classes to the link, based on its active and pending state

import CompanyTitle from "./CompanyTitle";
import SearchBox from "./SearchBox";
import LogInOutButton from "../LoginAccount/LogInOutButton";
import AccountButton from "../LoginAccount/AccountButton";
import CartButton from "../Cart/CartButton";
import CategoriesBox from "../Category/CategoriesBox";

export default function Header({ onSelectCategory, selectedCategory }) {
  // middleman, just passing the prop-value from CategoriesBox via setter (onSelectedCategory) to RootLayout wrapper - lifting the state up to parent
  return (
    <header id="header">
      <div className="header-box">
        <div className="header-top-left header-box-item">
          {/* <button>
            <Link className="link" to="/">Home</Link>
          </button> */}

          {/* <Link to="/" className="link home-button">
            Home
          </Link> */}

          <div>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "link home-button button-text active-link"
                  : "link home-button button-text"
              }
            >
              Home
            </NavLink>
          </div>

          <CompanyTitle className="header-box-item" />
        </div>

        <SearchBox />

        <nav className="login-account-navigation header-box-item">
          <ul className="button-list">
            <li>
              <LogInOutButton />
            </li>
            <li>
              {/* <Link className="link" to="/account"> */}
              <AccountButton />
              {/* </Link> */}
            </li>
            <li>
              {/* <Link className="link" to="/cart"> */}
              <CartButton />
              {/* </Link> */}
            </li>
          </ul>
        </nav>
      </div>

      <div className="header-box">{/* categories picker */}</div>
      <CategoriesBox
        onSelectCategory={onSelectCategory}
        selectedCategory={selectedCategory}
      />
      {/* passing the prop-value from CategoriesBox via setter (onSelectedCategory) to RootLayout wrapper - lifting the state up to the parent */}
    </header>
  );
}
