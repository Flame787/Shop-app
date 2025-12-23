// import Header from "../components/reusable/Header";
// import Footer from "../components/reusable/Footer";

import { useSelector } from "react-redux";
import AccountSection from "../components/LoginAccount/AccountSection";
import LoginModal from "../components/LoginAccount/LoginModal";

export default function Account() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // this state is received from redux-store

  // state for opening/closing Login modal:
  // const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* <Header /> */}
      <h3 className="div-center main-title2">
        {isLoggedIn ? "Your account" : "Sign in to create an account"}
      </h3>
      <div className="div-center">
        {isLoggedIn ? <AccountSection /> : <LoginModal />}
      </div>

      {/* <Footer /> */}
    </>
  );
}
