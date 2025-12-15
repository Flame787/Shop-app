import { useState } from "react";

export default function SearchBox({ onSearch }) {
  const [query, setQuery] = useState("");

  function handleChange(event) {
    setQuery(event.target.value);
  }

  // on button-click, we trigger search-event, which we got as prop from parent-component Header.jsx:
  function handleSearch() {
    onSearch(query);
    // sends event.target.value to the parent-component Header, and then to RootLayout, which can render SearchItems (= search-results)
    console.log("searchWord:", query);
  }

  // trigger 'handleSearch' function when Enter-key is pressed:
  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <>
      <div className="div-center flex-column search-box">
        <label className="all-text margin-bottom">Search for products:</label>
        <input
          className="input-search"
          placeholder="What are you looking for?"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        ></input>
        <button
          className="search-button link category-link"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </>
  );
}
