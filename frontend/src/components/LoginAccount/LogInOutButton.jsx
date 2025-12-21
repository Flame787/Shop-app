// Log in / Log out button

import { useSelector, useDispatch } from "react-redux";
import { logout, openModal } from "../../redux-store/authSlice";

export default function LogInOutButton() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);   // this state is received from redux-store

  return (
    <div>
      <button className="link login-button button-text" onClick={() => isLoggedIn ? dispatch(logout()) : dispatch(openModal())}>
        {isLoggedIn ? "Log out" : "Log in"}
      </button>
    </div>
  );
}
