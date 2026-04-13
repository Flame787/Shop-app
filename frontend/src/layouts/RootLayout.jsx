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
import LoginModal from "../components/LoginAccount/LoginModal";
import { useSelector } from "react-redux";

export default function RootLayout() {
  // keeping the state about which category was selected, because Rootlayout is wrapping the CategoriesBox-component:
  const [selectedCategory, setSelectedCategory] = useState(null);

  // used for resetting searchWord to "" when navigating between pages, so Outlet renders properly:
  const location = useLocation();

  // state for setting a searchWord:
  const [searchWord, setSearchWord] = useState("");

  // state for sorting (saving info on which sorting-criteria was selected):
  const [sortCriteria, setSortCriteria] = useState("default");

  const openLoginModal = useSelector((state) => state.auth.openLoginModal);

  useEffect(() => {
    // every time a route changes, we reset searchWord-state to "", so Outlet-pages can be rendered, instead of search-results
    // when a route changes, we also reset sortCriteria-state to "default", so that sortCriteria no longer apply on a new page: default view again
    setSearchWord("");
    setSortCriteria("default");
  }, [location]);

  // this useEffect is used just for logging if app is registering the sortCriteria-change correctly
  useEffect(() => {
    console.log("Sort criteria changed:", sortCriteria);
  }, [sortCriteria]);

  // fetching all products with useQuery:
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", sortCriteria], // now 'queryKey'-cache saves the 'sortCriteria' too, not just the fetched-products-list
    queryFn: async () => {
      console.log("Fetching with sort:", sortCriteria); // test if sortCriteria is passed to fetching-function
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/items`,
        { params: { sort: sortCriteria } } // adding the query-parameter to url, e.g. http://localhost:5000/api/items?sort=a-z
      );
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
        onSort={setSortCriteria} // passing the state-setter-function (setSortCriteria) in prop 'onSort' to the child-component Header.jsx
        sortCriteria={sortCriteria} // important to pass the sort-state-value too, not just the setter-function
      />
      {/* for search-state: getting the state-value from the child-component ProductsList, via Header-component - middleman (state lifted up) */}

      <main >
        {/* pushes footer down, even if it's not much content on the page */}

        {/* If there is a Searchword, then SearchItems-component renders (showing search-results), but Outlet (other pages) will not be shown.
But if SearchWord is empty, then Outlet renders. SearchWord is passed to Outlet, so that all pages have access to this value. 
Then any of the pages inherits what was written in the search-input, or can reset the search-input. */}
        {/* <SearchItems>-component is used to show RESULTS of the Search: it searches through ALL items, not just category-items.
        This component receives state-data (searchWord) and state-setter-function (onItemSelected) from parent (RootLayout.jsx).
        We also pass to <SearchItems> the sortCriteria-state in a prop, so we can sort just the filtered search-result-items through different criteria. */}
        {searchWord ? (
          <SearchItems
            searchWord={searchWord}
            sortCriteria={sortCriteria}
            onItemSelected={(id) => console.log("Selected:", id)}
          />
        ) : (
          <Outlet
            context={{ selectedCategory, searchWord, products, sortCriteria }} // passing all different states via context to Outlet-components
          />
        )}
        {/* using outlet-context from React Router and sending prop-value to all children pages of this wrapper */}
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
      {openLoginModal && <LoginModal />}
    </>
  );
}
