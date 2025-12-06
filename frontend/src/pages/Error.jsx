// import Header from "../components/reusable/Header";
// import Footer from "../components/reusable/Footer";
import { NavLink } from "react-router-dom";
// error element is not wrapped with RootLayout, so we need to add Header and Footer here

export default function Error() {
  return (
    <>
      {/* <Header /> */}
      <h3 className="div-center main-title2">An error occurred!</h3>

      <div className="div-center margin-bottom2">Could not find this page.</div>

      <div className="div-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "link div-center button-text home-button proceed-button active-link"
              : "link div-center button-text home-button proceed-button"
          }
        >
          Return home
        </NavLink>
      </div>

      {/* <Footer /> */}
    </>
  );
}
