import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function AccountSection() {
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  const [userData, setUserData] = useState({
    username: "",
    password: "********",
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
    address: false,
    city: false,
    postal: false,
    country: false,
    phone: false,
  });

  // Refs for input fields to focus them when Edit is clicked
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
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
  };

  const handleCancelField = (fieldName) => {
    // Reset the field value to original data
    setUserData((prev) => ({
      ...prev,
      [fieldName]: originalUserData[fieldName],
    }));

    // Set field back to non-editable mode
    setEditableFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

  // Focus input field when it's set to editable mode
  useEffect(() => {
    if (editableFields.email && emailRef.current) emailRef.current.focus();
    if (editableFields.username && usernameRef.current) usernameRef.current.focus();
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
      const response = await axios.put(
        "http://localhost:5000/api/me",
        {
          name: userData.username,
          email: userData.email,
          phone: userData.phone,
          street: userData.address,
          city: userData.city,
          postal_code: userData.postal,
          country: userData.country,
        },
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
      };

      setUserData(updatedUserData);
      setOriginalUserData(updatedUserData); // Update original data to the new values

      setEditableFields({
        email: false,
        username: false,
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
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        const fullName = data.name || "";
        const [firstName, ...lastNameParts] = fullName.split(" ");

        const userDataObj = {
          username: fullName,
          password: "********",
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
  }, [token]);

  return (
    <section className="account-section">
      <form onSubmit={handleSubmit}>
        <div className="div-center">
          <div className="input-div">
            <label htmlFor="email">Email address</label>
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

        <div className="div-center">
          <div className="input-div">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              readOnly
            />
          </div>
          <button className="link change-button" type="button" disabled>
            Edit
          </button>
        </div>

        <div className="div-center">
          <div className="input-div">
            <label htmlFor="username">Name</label>
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

/* Next steps:
- instead of current browser alert pop-up when user info is successfully updated, implement Toast notification (a small message that appears at the bottom of the screen and disappears after a few seconds) to show success or error messages when user tries to save changes on the Account page
- add alerts if user tries to enter invalid data (e.g. invalid email format, or postal code that contains letters instead of numbers, etc.)
- change button Edit behavior depending if in Edit mode or not (if in Edit mode, button should say "Cancel", and when we click on Cancel, we should reset the input field value to the original value from DB, and set this field back to non-editable mode)
- enable editing password as well (for now, password field is read-only, and Edit button for password is disabled, but we can enable it and allow user to change password if they want to)
- handle Sign up form in a similar way (currently, we have only Login form, but we can also create a Signup form, similar to the Account page,where user can enter all their data, and when they submit the form, we send POST request to backend to create new user in DB)
- add the possibility to delete the account (add "Delete account" button, and when user clicks on it, show a confirmation dialog, and if user confirms, send DELETE request to backend to delete the user account from DB, and then log out the user and redirect to Home page)
 */