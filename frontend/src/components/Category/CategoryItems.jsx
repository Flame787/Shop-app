import axios from "axios";
// import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ItemCard from "../Product/ItemCard";

export default function CategoryItems({ categoryId, onItemSelected }) {
  // NEW - React Query handling fetch-request, caching and refetching:
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["items", categoryId], // unique key for caching data
    queryFn: async () => {
      // query-function, API-request for data
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/items/category/${categoryId}`
      );
      return res.data.data;
    },
    enabled: !!categoryId,
    // enabled - determins if function will start at all. Fetching only if categoryId is existing, not null.
    // enabled: false - query will not execute. enabled: true - query starts automatically.
    // !! - turns a value (string, number...) of some variable into a boolean value (true, false) - double inversion (truthy → false, false → true)
  });

  if (isLoading) return <div className="loader"></div>;
  if (items.length === 0)
    return <p className="div-center">No items in this category</p>;

  // // state for collecting all items/products of one category:
  // const [items, setItems] = useState([]);

  // // state for loading, while data are being fetched:
  // const [loading, setLoading] = useState(false);

  // // state for tracking which ProductId-ItemCard was clicked:
  // const [ItemCardClicked, setItemCardClicked] = useState(null);

  // // debounce effect for showing message "No items in this category" if products will eventually load, but not in the 1st sec -> delay:
  // const [showEmpty, setShowEmpty] = useState(false);

  // // side effect for showing message "No items in this category":
  // useEffect(() => {
  //   if (items.length === 0 && !loading) {
  //     const timer = setTimeout(() => setShowEmpty(true), 300); // wait 300ms
  //     return () => clearTimeout(timer);
  //   } else {
  //     setShowEmpty(false);
  //   }
  // }, [items, loading]);

  // // side-effect for fetching all products from one category - API GET-request:
  // useEffect(() => {
  //   if (!categoryId) return;

  //   const fetchItems = async () => {
  //     try {
  //       setLoading(true);
  //       // const res = await axios.get(`/api/items/category/${categoryId}`);
  //       // -> cross-origin issue, fetching from http://localhost:5000/api/items/category/1 to http://localhost:3000/products
  //       const res = await axios.get(
  //         `${process.env.REACT_APP_API_URL}/api/items/category/${categoryId}`
  //       );
  //       setItems(res.data.data);
  //     } catch (err) {
  //       console.error("Error fetching items:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   // calling the fetch-function (if a category was selected, and not null):
  //   if (categoryId) fetchItems();
  // }, [categoryId]);

  // if (loading) {
  //   return <div className="loader"></div>;
  // }

  // // message shows up not immediatelly, but with small delay, after 300 ms:
  // if (showEmpty) {
  //   return <p className="div-center">No items in this category</p>;
  // }

  // // setting currently selected ItemCard-ID to the state, and enabling passing this ID to parent-components (ProductsList.jsx):
  // function handleItemCardClick(itemId) {
  //   setItemCardClicked(itemId);
  //   // taking the fetched ID in argument: item.item_id
  //   console.log("Clicked product id:", itemId);
  //   if (onItemSelected) {
  //     onItemSelected(itemId); // sending to the parent-component
  //   }
  // }

  return (
    <div className="div-center category-items-div">
      {items.map((item) => (
        <ItemCard
          key={item.item_id}
          id={item.item_id}
          name={item.name}
          description={item.description}
          price={item.price}
          discountPrice={item.discount_price}
          quantity={item.quantity_in_stock}
          picture={item.picture_url}
          category={item.category_id}
          tags={item.tags}
          className="item-card category-card"
          // onClick={() => handleItemCardClick(item.item_id)}
          onClick={() => onItemSelected(item.item_id)}
          // taking itemId of the clicked ItemCard as argument & setting it to the state 'ItemCardClicked', just passing function, not calling it
        />
      ))}
    </div>
  );
}
