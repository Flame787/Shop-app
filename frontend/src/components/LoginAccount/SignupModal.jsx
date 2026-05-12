import { useState } from "react";
import { useDispatch } from "react-redux";
import { login, closeModal } from "../../redux-store/authSlice";
import Modal from "../reusable/Modal";
import axiosInstance from "../../util/axiosConfig";

export default function SignupModal() {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");

  // Password validation function
  function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (password.length < minLength) {
      return "Password must be at least 8 characters long.";
    }
    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumbers) {
      return "Password must contain at least one number.";
    }
    return "";
  }

  // what happens when the Signup-form is submitted - we try to POST (send) entered email & password to backend:
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage("");

    const username = e.target.username.value;
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;

    // Validate password strength
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrorMessage(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        "/api/signup",
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
      console.error("Signup failed:", error);
      setErrorMessage(error.response?.data?.message || "Signup failed. Please try again.");
    }
  }

  return (
    <Modal open={true} onClose={() => dispatch(closeModal())} className="signup-modal">
      <form onSubmit={handleSubmit}>
        {/* Never use GET to send sensitive data! (will be visible in the URL). Use POST instead - when using POST, data is not shown in URL. */}
        <h3>Sign up</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="input-div">
          <label htmlFor="username">Email</label>
          <input type="text" id="username" name="username" />
        </div>
        <div className="input-div">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" />
          <small className="password-requirements">
            Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
          </small>
          {/* If the name attribute is omitted, the value of the input field will not be sent at all. */}
        </div>
        <div className="input-div">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" />
          {/* If the name attribute is omitted, the value of the input field will not be sent at all. */}
        </div>
        <button className="signup-modal-button">Sign up</button>
      </form>
    </Modal>
  );
}


/* 
The password validation - typical shop app standards: at least 8 characters, with at least one uppercase letter, 
one lowercase letter, and one number. Special characters are allowed but not required.
*/