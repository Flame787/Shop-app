import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Toastify - for instant notifications (setting up here in RootLayout component, so nofitications can be used in any child-component)

export default function RootLayout() {
  // keeping the state about which category was selected, because Rootlayout is wrapping the CategoriesBox-component:
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <Header
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
      />
      {/* getting the value from it's child-component ProductsList, via Header-component - middleman (state lifted up) */}

      <main style={{ minHeight: "80vh" }}>
        {/* pushes footer down, even if it's not much content on the page */}
        <Outlet context={{ selectedCategory }} />
        {/* using outlet context from React router and sending prop-value to all children pages of this wrapper */}
      </main>

      <Footer />

      {/* Global toast container */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}
