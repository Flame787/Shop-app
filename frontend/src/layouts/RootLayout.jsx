import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Toastify - for instant notifications (setting up here in RootLayout component, so nofitications can be used in any child-component)
import SearchItems from "../components/Category/SearchItems";

export default function RootLayout() {
  // keeping the state about which category was selected, because Rootlayout is wrapping the CategoriesBox-component:
  const [selectedCategory, setSelectedCategory] = useState(null);

  // used for resetting searchWord to "" when navigating between pages, so Outlet renders properly:
  const location = useLocation();

  // state for setting a searchWord:
  const [searchWord, setSearchWord] = useState("");

  useEffect(() => {
    // every time a route changes, we reset searchWord to "", so Outlet-pages can be rendered instead of search-results:
    setSearchWord("");
  }, [location]);

  // fetching all products with useQuery:
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/items`);
      return res.data.data;
    },
  });
  if (isLoading) return <div className="loader"></div>;

  return (
    <>
      <Header
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        onSearch={setSearchWord}
      />
      {/* getting the value from it's child-component ProductsList, via Header-component - middleman (state lifted up) */}

      <main style={{ minHeight: "80vh" }}>
        {/* pushes footer down, even if it's not much content on the page */}

        {/* If there is a Searchword, then SearchItems-component renders (showing search-results), but Outlet (other pages) will not be shown.
But if searchWord is empty, then Outlet renders. searchWord is passed to Outlet, so that all pages haveaccess to this value. 
Then any of the pages inherits what was written in the input, or can reset the input. */}
        {/* SearchItems-component is used to show RESULTS of the Search: it gets data (searchWord) and function (onItemSelected) from parent (RootLayout.jsx) */}
        {searchWord ? (
          <SearchItems
            searchWord={searchWord}
            onItemSelected={(id) => console.log("Selected:", id)}
          />
        ) : (
          <Outlet context={{ selectedCategory, searchWord, products }} />
        )}
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
