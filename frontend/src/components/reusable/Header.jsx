import { useEffect } from "react";
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
  // Header-komponent is just a middleman, passing the prop-value from CategoriesBox via setter (onSelectedCategory) to RootLayout wrapper 
  // -> lifting the state up to parent-component

  useEffect(() => {
    let lastScrollTop = 0;
    const navbar = document.querySelector(".navbar");

    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollTop > lastScrollTop) {
        // Scroll down - hide navbar:
        navbar.classList.add("navbar-hidden");
      } else {
        // Scroll up - show navbar:
        navbar.classList.remove("navbar-hidden");
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup:
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // [] - effect starts only when component mounts

  return (
    <header id="header">
      <div className="header-box navbar">
        <div className="header-box-item header-top-left">
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
        <div className="header-top-center">
          <CompanyTitle className="header-box-item company-title1" />
        </div>

        <div className="header-box-item header-top-right categories-buttons div-center">
          <LogInOutButton />

          <AccountButton />

          <CartButton />
        </div>
      </div>

      {/* this company-image is showing only on small resolutions, below navbar, instead of big company image in navbar centre: */}
      <div className="header-top-center-small">
        <CompanyTitle className="header-box-item company-title2" />
      </div>

      <SearchBox />

      {/* <div className="header-box"></div> */}
      <CategoriesBox
        onSelectCategory={onSelectCategory}
        selectedCategory={selectedCategory}
      />
      {/* passing the prop-value from CategoriesBox via setter (onSelectedCategory) to RootLayout wrapper - lifting the state up to the parent */}
    </header>
  );
}
