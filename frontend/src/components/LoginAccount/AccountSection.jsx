import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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

  const [editableFields, setEditableFields] = useState({
    email: false,
    username: false,
    address: false,
    city: false,
    postal: false,
    country: false,
    phone: false,
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setUserData((prev) => ({
        ...prev,
        username: data.name || prev.username,
        email: data.email || prev.email,
        address: data.street || prev.address,
        city: data.city || prev.city,
        postal: data.postal_code || prev.postal,
        country: data.country || prev.country,
        phone: data.phone || prev.phone,
      }));
      setEditableFields({
        email: false,
        username: false,
        address: false,
        city: false,
        postal: false,
        country: false,
        phone: false,
      });
      alert("Changes saved successfully.");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Unable to save changes. Please try again.");
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

        setUserData({
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
        });
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
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => handleEditField("email")}
          >
            Edit
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
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => handleEditField("username")}
          >
            Edit
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
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => handleEditField("address")}
          >
            Edit
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
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => handleEditField("city")}
          >
            Edit
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
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => handleEditField("postal")}
          >
            Edit
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
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => handleEditField("country")}
          >
            Edit
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
            />
          </div>
          <button
            className="link change-button"
            type="button"
            onClick={() => handleEditField("phone")}
          >
            Edit
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
