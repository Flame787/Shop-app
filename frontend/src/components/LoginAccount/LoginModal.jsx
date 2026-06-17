import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, closeModal } from "../../redux-store/authSlice";
import Modal from "../reusable/Modal";
import axiosInstance from "../../util/axiosConfig";

export default function LoginModal() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  // Password validation function
  // function validatePassword(password) {
  //   const minLength = 8;
  //   const hasUpperCase = /[A-Z]/.test(password);
  //   const hasLowerCase = /[a-z]/.test(password);
  //   const hasNumbers = /\d/.test(password);

  //   if (password.length < minLength) {
  //     return "Password must be at least 8 characters long.";
  //   }
  //   if (!hasUpperCase) {
  //     return "Password must contain at least one uppercase letter.";
  //   }
  //   if (!hasLowerCase) {
  //     return "Password must contain at least one lowercase letter.";
  //   }
  //   if (!hasNumbers) {
  //     return "Password must contain at least one number.";
  //   }
  //   return "";
  // }

  // what happens when the Login-form is submitted - we try to POST (send) entered email & password to backend:
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const username = e.target.username.value;
    const password = e.target.password.value;

    // Validate password strength
    // const passwordError = validatePassword(password);
    // if (passwordError) {
    //   setErrorMessage(passwordError);
    //   return;
    // }

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
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  }

  return (
    <Modal open={true} onClose={() => dispatch(closeModal())} className="login-modal">
      <form onSubmit={handleSubmit}>
        {/* Never use GET to send sensitive data! (will be visible in the URL). Use POST instead - when using POST, data is not shown in URL. */}
        <h3>Log in</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {/* error message comes from backend (routes/auth.js) */}
        <div className="input-div">
          <label htmlFor="username">Email</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="input-div">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
          {/* <small className="password-requirements">
            Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
          </small> */}
          {/* If the name attribute is omitted, the value of the input field will not be sent at all. */}
        </div>
        <button className="login-modal-button">Log in</button>
        
      </form>
    </Modal>
  );
}


// jimmy@test.com
// current password: test1234

// mike123@test.com
// MikeMike123

// tinaTurner@test.com 
// 123456abcA

// doris.dragovic@gmail.com
// Doris123

/* 
- Password validation enforcing 8+ characters with uppercase, lowercase, and number
- Error message state instead of alerts for better UX
- Info message displaying password requirements
- Detailed error messages when validation fails
 */