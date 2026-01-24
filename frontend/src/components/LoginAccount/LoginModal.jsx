import { useDispatch } from "react-redux";
import { login, closeModal } from "../../redux-store/authSlice";
import Modal from "../reusable/Modal";
import axios from "axios";

export default function LoginModal() {
  const dispatch = useDispatch();

  async function handleSubmit(e) {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    // later, we will call real backend here (axios POST):
    // dispatch(
    //   login({
    //     role: "user",
    //     user: { username: "myname" },
    //     token: "dummy-token",
    //   })
    // );

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        {
          email: username,
          password: password,
        },
        {
          withCredentials: true, // važno za slanje httpOnly refresh cookie-a
        },
      );

      const { accessToken, user } = response.data;

      // Spremi korisnika u Redux
      dispatch(
        login({
          role: user.role,
          user: { id: user.id, email: user.email },
          token: accessToken,
        }),
      );

      dispatch(closeModal());
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  }

  return (
    <Modal open={true} onClose={() => dispatch(closeModal())}>
      <form onSubmit={handleSubmit}>
        {/* Never use GET to send sensitive data! (will be visible in the URL). When using POST, data is not shown in URL. */}
        <h3>Log in</h3>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password" />
          {/* If the name attribute is omitted, the value of the input field will not be sent at all. */}
        </div>
        <button>Log in</button>
      </form>
    </Modal>
  );
}
