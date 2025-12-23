import { useDispatch } from "react-redux";
import { login } from "../../redux-store/authSlice";
import Modal from "../reusable/Modal";

export default function LoginModal() {
const dispatch = useDispatch();

  function handleSubmit(e) {
    e.preventDefault();

    // later, we will call real backend here (axios POST):
    dispatch(
      login({
        role: "user",
        user: { username: "myname" },
        token: "dummy-token",
      })
    );
  }

  return <Modal  open={true}>
    <form onSubmit={handleSubmit}>
      {/* Never use GET to send sensitive data! (will be visible in the URL). When using POST, data is not shown in URL. */}
      <h3>Log in</h3>
      <div>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username"/>
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="text" id="password" name="password"/>
        {/* If the name attribute is omitted, the value of the input field will not be sent at all. */}
      </div>
      <button>Log in</button>
    </form>
  </Modal>;
}
