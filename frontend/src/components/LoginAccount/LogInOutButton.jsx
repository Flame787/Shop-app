// Log in / Log out button

import { useSelector, useDispatch } from "react-redux";
import { logout, openLoginModal } from "../../redux-store/authSlice";
import axiosInstance from "../../util/axiosConfig";

export default function LogInOutButton() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);   // this state is received from redux-store

  const handleLogout = async () => {
    try {
      // Call logout API to clear the HttpOnly cookie on backend
      await axiosInstance.post("/api/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always dispatch logout to clear Redux state, even if API call fails
      // Cart persists for 7 days regardless of login state
      dispatch(logout());
    }
  };

  return (
    <div>
      <button className="link login-button button-text" onClick={() => isLoggedIn ? handleLogout() : dispatch(openLoginModal())}>
        {isLoggedIn ? "Log out" : "Log in"}
      </button>
    </div>
  );
}
