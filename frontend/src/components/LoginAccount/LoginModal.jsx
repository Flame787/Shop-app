import { useDispatch } from "react-redux";
import { login, closeModal } from "../../redux-store/authSlice";
import Modal from "../reusable/Modal";
import axiosInstance from "../../util/axiosConfig";

export default function LoginModal() {
  const dispatch = useDispatch();

  // what happens when the Login-form is submitted - we try to POST (send) entered email & password to backend:
  async function handleSubmit(e) {
    e.preventDefault();

    const username = e.target.username.value;
    const password = e.target.password.value;

    // before we call real backend here (axios POST):
    // dispatch(
    //   login({
    //     role: "user",
    //     user: { username: "myname" },
    //     token: "dummy-token",
    //   })
    // );

    try {
      const response = await axiosInstance.post(
        "/api/login",
        {
          email: username,   // under "email", we pass the username, which is entered in the username-input field of the form
          password: password,  // under "password", we pass the password, which is entered in the password-input field of the form
        },
      );

      const { accessToken, user } = response.data;  // backend sends back accessToken (JWT) and user-data (id, email, role) if this user already exists in DB

      // Save user to Redux:
      dispatch(
        login({
          role: user.role,
          user: { id: user.id, email: user.email },
          token: accessToken,   // we only save the accessToken (JWT) in Redux (in frontend), but not the refreshToken, 
          // because refreshToken is httpOnly and cannot be accessed by frontend (for security reasons)
        }),
      );

      dispatch(closeModal());
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    }
  }

  return (
    <Modal open={true} onClose={() => dispatch(closeModal())} className="login-modal">
      <form onSubmit={handleSubmit}>
        {/* Never use GET to send sensitive data! (will be visible in the URL). Use POST instead - when using POST, data is not shown in URL. */}
        <h3>Log in</h3>
        <div className="input-div">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="input-div">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
          {/* If the name attribute is omitted, the value of the input field will not be sent at all. */}
        </div>
        <button className="login-modal-button">Log in</button>
      </form>
    </Modal>
  );
}
