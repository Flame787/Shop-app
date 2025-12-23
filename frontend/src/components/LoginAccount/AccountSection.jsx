import { useSelector } from "react-redux";

export default function AccountSection() {
  const user = useSelector((state) => state.auth.user);

  return (
    <>
      <form action="" method="post">
        <h3>Your account</h3>
        <div>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="text" id="password" name="password" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="fname">First name</label>
          <input type="text" id="fname" name="fname" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="lname">Last name</label>
          <input type="text" id="lname" name="lname" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="city">City</label>
          <input type="text" id="city" name="city" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="postal">Postal code</label>
          <input type="text" id="postal" name="postal" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input type="text" id="country" name="country" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="phone">Phone number</label>
          <input type="text" id="phone" name="phone" />
          <button>Change</button>
        </div>
        <div>
          <label htmlFor="email">Email address</label>
          <input type="text" id="email" name="email" />
          <button>Change</button>
        </div>
        <button>Log in</button>
      </form>
      <button>Home</button>
    </>
  );
}
