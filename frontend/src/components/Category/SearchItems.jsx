// SearchItems-component = used to show RESULTS of the Search: it gets data (searchWord) and function onItemSelected from parent (RootLayout.jsx)
// Fetching for results-data is happening here:

import axios from "axios";
// import { useOutletContext } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ItemCard from "../Product/ItemCard";

export default function SearchItems({ searchWord, onItemSelected }) {
  //   const { searchWord } = useOutletContext();
  const navigate = useNavigate();

  const onlyLetters = /^[\p{L}]+$/u;
  const trimmedQuery = searchWord.trim().toLowerCase();

  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["items", searchWord],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/search/items?query=${trimmedQuery}`
      );

      console.log("Search results:", res.data.data);
      return res.data.data;
    },
    // enabled: !!searchWord, // fetch only if searchWord exists
    enabled: !!trimmedQuery && onlyLetters.test(trimmedQuery), // start request only if input is valid!
  });

  if (isLoading) return <div className="loader"></div>;
  if (isError) return <p className="div-center">Error: {error.message}</p>;

  if (items.length === 0)
    return <p className="div-center">No items match your search.</p>;

  function highlightText(text, searchWord) {
    if (!searchWord) return text;

    const regex = new RegExp(`(${searchWord})`, "gi");
    // g - global flag (searches all text), i - case-insensitive
    return text
      .split(regex)
      .map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : part
      );
    // if regex matches with the search-expression, then found word is marked (highlighted with marker),
    // otherwise it returns normal (unmarked) text
  }

  return (
    // return is exactly the same as in CategoryItems-component:
    <div className="div-center category-items-div">
      {items.map((item) => (
        <ItemCard
          key={item.item_id}
          id={item.item_id}
          //   name={item.name}
          name={highlightText(item.name, searchWord)}
          //   description={item.description}
          description={highlightText(item.description, searchWord)}
          price={item.price}
          discountPrice={item.discount_price}
          quantity={item.quantity_in_stock}
          picture={item.picture_url}
          category={item.category_id}
          tags={item.tags}
          className="item-card category-card"
          //   onClick={() => onItemSelected(item.item_id)}
          // taking itemId of the clicked ItemCard as argument & setting it to the state 'ItemCardClicked', just passing function, not calling it
          onClick={() => navigate(`/products/${item.item_id}`)}
        />
      ))}
    </div>
  );
}
