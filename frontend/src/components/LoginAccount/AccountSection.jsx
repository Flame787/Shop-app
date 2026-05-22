import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axiosInstance from "../../util/axiosConfig";
import { toast } from "react-toastify";

export default function AccountSection() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const PASSWORD_PLACEHOLDER = "************";

  const [userData, setUserData] = useState({
    username: "",
    password: PASSWORD_PLACEHOLDER,
    confirmPassword: "",
    address: "",
    city: "",
    postal: "",
    country: "",
    phone: "",
    email: "",
  });

  const [originalUserData, setOriginalUserData] = useState({});

  const [editableFields, setEditableFields] = useState({
    email: false,
    username: false,
    password: false,
    address: false,
    city: false,
    postal: false,
    country: false,
    phone: false,
  });

  // Refs for input fields to focus them when Edit is clicked
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const addressRef = useRef(null);
  const cityRef = useRef(null);
  const postalRef = useRef(null);
  const countryRef = useRef(null);
  const phoneRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditField = (fieldName) => {
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    if (fieldName === "password" && userData.password === PASSWORD_PLACEHOLDER) {
      setUserData((prev) => ({
        ...prev,
        password: "",
      }));
    }
  };

  const handleCancelField = (fieldName) => {
    const resetValue =
      fieldName === "password" ? PASSWORD_PLACEHOLDER : originalUserData[fieldName];

    setUserData((prev) => ({
      ...prev,
      [fieldName]: resetValue,
      ...(fieldName === "password" ? { confirmPassword: "" } : {}),
    }));

    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

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

  // Focus input field when it's set to editable mode
  useEffect(() => {
    if (editableFields.email && emailRef.current) emailRef.current.focus();
    if (editableFields.username && usernameRef.current) usernameRef.current.focus();
    if (editableFields.password && passwordRef.current) passwordRef.current.focus();
    if (editableFields.address && addressRef.current) addressRef.current.focus();
    if (editableFields.city && cityRef.current) cityRef.current.focus();
    if (editableFields.postal && postalRef.current) postalRef.current.focus();
    if (editableFields.country && countryRef.current) countryRef.current.focus();
    if (editableFields.phone && phoneRef.current) phoneRef.current.focus();
  }, [editableFields]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate input data
    const errors = [];

    // Email validation (required)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      errors.push("Please enter a valid email address.");
    }

    // Postal code validation (only if filled - should be numeric)
    if (userData.postal && !/^\d+$/.test(userData.postal)) {
      errors.push("Postal code must contain only numbers.");
    }

    // Phone validation (optional: allow numbers, spaces, +, -, () only if filled)
    if (userData.phone && !/^[\d\s\+\-\(\)]+$/.test(userData.phone)) {
      errors.push("Phone number can only contain numbers, spaces, and symbols (+, -, (, )).");
    }
    // Password validation (optional when editing)
    if (editableFields.password) {
      if (!userData.password || userData.password === PASSWORD_PLACEHOLDER) {
        // Password is optional if not being edited
      } else {
        // Validate password strength
        const passwordError = validatePassword(userData.password);
        if (passwordError) {
          errors.push(passwordError);
        }
      }

      if (userData.password && userData.password !== PASSWORD_PLACEHOLDER && userData.password !== userData.confirmPassword) {
        errors.push(
          "Please make sure that your new password is typed correctly in both fields."
        );
      }
    }
    // Country validation (optional: only letters and spaces)
    if (userData.country && !/^[\p{L}\s]+$/u.test(userData.country)) {
      errors.push("Country can only contain letters and spaces.");
    }

    // Required fields validation (only Name and Email are required)
    if (!userData.username.trim()) {
      errors.push("Name is required.");
    }
    if (!userData.email.trim()) {
      errors.push("Email is required.");
    }

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    // Determine which fields have changed (for toast notifications only)
    const changedFields = {};
    Object.keys({
      username: "Name",
      email: "Email",
      password: "Password",
      address: "Address",
      city: "City",
      postal: "Postal code",
      country: "Country",
      phone: "Phone",
    }).forEach((field) => {
      if (userData[field] !== originalUserData[field]) {
        changedFields[field] = true;
      }
    });

    try {
      const requestBody = {
        name: userData.username,
        email: userData.email,
        phone: userData.phone,
        street: userData.address,
        city: userData.city,
        postal_code: userData.postal,
        country: userData.country,
      };

      if (
        editableFields.password &&
        userData.password &&
        userData.password !== PASSWORD_PLACEHOLDER
      ) {
        requestBody.password = userData.password;
      }

      const response = await axiosInstance.put(
        "/api/me",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = response.data.data;
      const updatedUserData = {
        ...userData,
        username: data.name || userData.username,
        email: data.email || userData.email,
        address: data.street || userData.address,
        city: data.city || userData.city,
        postal: data.postal_code || userData.postal,
        country: data.country || userData.country,
        phone: data.phone || userData.phone,
        password: PASSWORD_PLACEHOLDER,
        confirmPassword: "",
      };

      setUserData(updatedUserData);
      setOriginalUserData(updatedUserData); // Update original data to the new values

      setEditableFields({
        email: false,
        username: false,
        password: false,
        address: false,
        city: false,
        postal: false,
        country: false,
        phone: false,
      });

      // Show success toasts for changed fields
      const fieldLabels = {
        username: "Name",
        email: "Email",
        password: "Password",
        address: "Address",
        city: "City",
        postal: "Postal code",
        country: "Country",
        phone: "Phone",
      };

      Object.keys(changedFields).forEach((field) => {
        toast(
          <div>
            <span className="checkmark">✓</span>{" "}
            <span className="toast-itemname">{fieldLabels[field]}</span> updated successfully
          </div>
        );
      });
    } catch (error) {
      console.error("Error saving profile:", error);
      
      // Reset all editable fields even if there's an error
      setEditableFields({
        email: false,
        username: false,
        password: false,
        address: false,
        city: false,
        postal: false,
        country: false,
        phone: false,
      });
      
      toast.error("Unable to save changes. Please try again.");
    }
  };

  useEffect(() => {
    // Clear user data immediately when user logs out
    if (!isLoggedIn) {
      setUserData({
        username: "",
        password: PASSWORD_PLACEHOLDER,
        confirmPassword: "",
        address: "",
        city: "",
        postal: "",
        country: "",
        phone: "",
        email: "",
      });
      setOriginalUserData({});
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        const fullName = data.name || "";
        const [firstName, ...lastNameParts] = fullName.split(" ");

        const userDataObj = {
          username: fullName,
          password: PASSWORD_PLACEHOLDER,
          confirmPassword: "",
          fname: firstName || "",
          lname: lastNameParts.join(" ") || "",
          address: data.street || "",
          city: data.city || "",
          postal: data.postal_code || "",
          country: data.country || "",
          phone: data.phone || "",
          email: data.email || "",
        };

        setUserData(userDataObj);
        setOriginalUserData(userDataObj);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token, isLoggedIn]);

  return (
    <section className="account-section">
      <form onSubmit={handleSubmit}>
        <div className="div-center">
          <div className="input-div">
            <label htmlFor="email">Email address <span style={{ color: "red" }}>*</span></label>
            <input
              type="text"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              readOnly={!editableFields.email}
              ref={emailRef}
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => editableFields.email ? handleCancelField("email") : handleEditField("email")}
            style={editableFields.email ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.email ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="div-center ">
          <div className="input-div">
            <label htmlFor="password">Password <span style={{ color: "red" }}>*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              readOnly={!editableFields.password}
              ref={passwordRef}
              autoComplete="new-password"
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() =>
              editableFields.password
                ? handleCancelField("password")
                : handleEditField("password")
            }
            style={editableFields.password ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.password ? "Cancel" : "Edit"}
          </button>
          
        </div>

        {editableFields.password && (
            <> <div className="password-requirements"><small>
                Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.
              </small></div>
              
              <div className="input-div confirm-password-div" >
                <label htmlFor="confirmPassword">Confirm Password <span style={{ color: "red" }}>*</span></label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData.confirmPassword}
                  onChange={handleInputChange}
                  autoComplete="new-password"
                />
              </div>
              
            </>
          )}

        <div className="div-center">
          <div className="input-div">
            <label htmlFor="username">Full name </label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              readOnly={!editableFields.username}
              ref={usernameRef}
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => editableFields.username ? handleCancelField("username") : handleEditField("username")}
            style={editableFields.username ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.username ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="div-center">
          <div className="input-div">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={userData.address}
              onChange={handleInputChange}
              readOnly={!editableFields.address}
              ref={addressRef}
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => editableFields.address ? handleCancelField("address") : handleEditField("address")}
            style={editableFields.address ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.address ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="div-center">
          <div className="input-div">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={userData.city}
              onChange={handleInputChange}
              readOnly={!editableFields.city}
              autoComplete="off"
              ref={cityRef}
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => editableFields.city ? handleCancelField("city") : handleEditField("city")}
            style={editableFields.city ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.city ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="div-center">
          <div className="input-div">
            <label htmlFor="postal">Postal code</label>
            <input
              type="text"
              id="postal"
              name="postal"
              value={userData.postal}
              onChange={handleInputChange}
              readOnly={!editableFields.postal}
              autoComplete="off"
              ref={postalRef}
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => editableFields.postal ? handleCancelField("postal") : handleEditField("postal")}
            style={editableFields.postal ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.postal ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="div-center">
          <div className="input-div">
            <label htmlFor="country">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              value={userData.country}
              onChange={handleInputChange}
              readOnly={!editableFields.country}
              autoComplete="off"
              ref={countryRef}
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => editableFields.country ? handleCancelField("country") : handleEditField("country")}
            style={editableFields.country ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.country ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="div-center">
          <div className="input-div">
            <label htmlFor="phone">Phone number</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={userData.phone}
              onChange={handleInputChange}
              readOnly={!editableFields.phone}
              ref={phoneRef}
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => editableFields.phone ? handleCancelField("phone") : handleEditField("phone")}
            style={editableFields.phone ? { background: "#e6991d", color: "#fff" } : undefined}
          >
            {editableFields.phone ? "Cancel" : "Edit"}
          </button>
        </div>

        <div className="save-changes-div">
          <button className="link save-changes-button" type="submit">Save changes</button>
        </div>
      </form>

      <NavLink
        to="/"
        className={({ isActive }) =>
          isActive
            ? "link button-text home-button home2-button active-link"
            : "link button-text home-button home2-button"
        }
      >
        Home
      </NavLink>
    </section>
  );
}

/* Updated 1st customer in MySQL DB:

SELECT * FROM shop_app.customers;
UPDATE shop_app.customers
SET
   phone = '38591749382947',
   street = 'MyStreet 10',
   city = 'Zagreb',
   postal_code = '10000',
   country = 'Croatia'
WHERE customer_id = 1; 

// important to have 'WHERE' and customer_id, otherwise all customers in DB would be updated with this same data! 
*/

// jimmy@test.com
// current password: test1234

// AFTER MIGRATION TO NEW DATABASE:

// test@justtest.com
// Justtest123

// after killing additional servers in the background - new account:
// john@next.com
// John1234

/* Next steps:
+ instead of current browser alert pop-up when user info is successfully updated, implement Toast notification (a small message that appears at the bottom of the screen and disappears after a few seconds) to show success or error messages when user tries to save changes on the Account page
+ add alerts if user tries to enter invalid data (e.g. invalid email format, or postal code that contains letters instead of numbers, etc.)
+ change button Edit behavior depending if in Edit mode or not (if in Edit mode, button should say "Cancel", and when we click on Cancel, we should reset the input field value to the original value from DB, and set this field back to non-editable mode)
+ enable editing password as well (for now, password field is read-only, and Edit button for password is disabled, but we can enable it and allow user to change password if they want to)
+ currently, when app reloads in browser, or when user manually changes the URL and goes from Account page (localhost:3000/account) to localhost:3000, the user is automatically logged out, because we store the token only in Redux state, and when app reloads, Redux state is reset to initial state (where token is null). 
I want to change this, and use industry standard approach for storing the token, which is to store it in HttpOnly cookie (instead of localStorage or Redux state), so that when user reloads the page, the token is still stored in cookie and user remains logged in.
+ when user has logged out, Cart items should be cleared and not stay available in the Cart. Cart items should be related to the user session, and we should decide how long the session lasts. For example, it can last for 7 days and then user has to log in again. 
We can implement this by setting an expiration time for the HttpOnly cookie that stores the token, and when the cookie expires, the user is automatically logged out and Cart items are cleared.
+ on Account page, add required fields marks (e.g. asterisk *) for fields that are required (e.g. Name and Email), and use red color for font. 
+ handle Sign up form in a similar way (currently, we have only Login form, but we can also create a Signup form, similar to the Account page,where user can enter all their data, and when they submit the form, we send POST request to backend to create new user in DB)

- Sign up = Create new account. Sign in = Log in. 
- have both Login and Signup in header - check if already applies
- email at Loginmodal should not be case-sensitive (currently, if user tries to log in with email that has different case than the one stored in DB, login will fail, but we can change this and make email case-insensitive, so that user can log in even if they enter email with different case)
- email should be trimmed for whitespace at the beginning and end (currently, if user accidentally adds space at the beginning or end of email, login will fail, but we can trim the email before sending it to backend, so that login will succeed even if user adds extra spaces)
- apply same logic for Signup form
- Account form should also trim whitespace for all fields at the beginning and end (only keep whitespace in Full name, address, city)
- handle Eslint errors / warnings in LoginModal and AccountSection components 

- add the possibility to delete the account (add "Delete account" button, and when user clicks on it, show a confirmation dialog, and if user confirms, send DELETE request to backend to delete the user account from DB, and then log out the user and redirect to Home page)
- if user has forgotten the password, add the button "Forgot password?" to the Login Form, and when user clicks on it, show a form where they can enter their email address, and when they submit the form, send POST request to backend to generate a password reset token and 
send it to the user's email address, and then user can use that token to reset their password (this requires implementing additional backend API endpoints for password reset functionality)


Handling Orders:
- add DeliveryData (saves data automaticaaly into Account) and PaymentForm (to enter credit card data), and when user submits the order,  
 a loader should apply for a few sec - during which frontend sends all this data to backend to create new order in DB, 
 and then confirmation message appears /modal/Toast-notification?, and then ShowOrder - confirmation page with order details 
 (this requires implementing additional backend API endpoints for creating orders and saving delivery/payment data)
*/


/* 
Cart items are saved using **localStorage** with a 7-day expiration. Here's the complete process flow:

## How Cart Items Are Saved Now

### 1. **Initial Load (App Start)**
- When the app loads, `CartContext` calls `loadCartFromLocalStorage()`
- Checks if cart data exists in localStorage
- If found, checks if it's older than 7 days
- If expired → clears localStorage and starts with empty cart
- If valid → loads saved items into cart state

### 2. **Adding Items to Cart**
- User adds items via `addItem()` function
- Cart state updates immediately
- `useEffect` in `CartContext` automatically saves to localStorage:
  ```javascript
  useEffect(() => {
    saveCartToLocalStorage(cart.items);
  }, [cart.items]);
  ```

### 3. **Saving to localStorage**
- `saveCartToLocalStorage()` saves:
  ```javascript
  {
    items: [...cart items...],
    timestamp: Date.now()
  }
  ```
- Data persists even after browser close/refresh

### 4. **Cart Persistence Rules**
- **Persists for 7 days** regardless of login status
- **Clears only when:**
  - User explicitly clicks "Log out" (calls `clearCart()`)
  - Cart expires after 7 days of no activity
  - User manually clears browser data

### 5. **Login/Logout Behavior**
- **Login:** Cart items remain available (no clearing)
- **Logout:** Cart items stay saved for 7 days
- **Session expire:** Cart items stay saved for 7 days

### 6. **Data Structure in localStorage**
```javascript
localStorage.setItem("cart", JSON.stringify({
  items: [
    { id: 1, name: "Product", quantity: 2, price: 10.99 },
    // ... other items
  ],
  timestamp: 1640995200000  // current timestamp
}));
```

This ensures users don't lose their cart contents when logging in/out, and items persist across browser sessions for up to 7 days.
  */