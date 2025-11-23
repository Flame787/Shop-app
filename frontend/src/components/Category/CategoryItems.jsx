import axios from "axios";
import { useState, useEffect } from "react";
import ItemCard from "../Product/ItemCard";

export default function CategoryItems({ categoryId, onLoading }) {
  // state for collecting all items/products of one category:
  const [items, setItems] = useState([]);

  // side-effect for fetching all products from one category - API GET-request:
  useEffect(() => {
    if (!categoryId) return;

    const fetchItems = async () => {
      try {
        // new - to pass loading status to the parent-page ProductsList.jsx:
        onLoading(true); // signal to parent-page: start loading

        // const res = await axios.get(`/api/items/category/${categoryId}`);
        // -> cross-origin issue, fetching from http://localhost:5000/api/items/category/1 to http://localhost:3000/products
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/items/category/${categoryId}`
        );
        setItems(res.data.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        onLoading(false); // signal to parent-page: stop loading
      }
    };
    // calling the fetch-function (if a category was selected, and not null):
    if (categoryId) fetchItems();
  }, [categoryId, onLoading]);

  if (items.length === 0) {
    return <p className="div-center">No items in this category</p>;
  }

  return (
    <div className="div-center category-items-div">
      {items.map((item) => (
        <ItemCard
          key={item.item_id}
          name={item.name}
          description={item.description}
          price={item.price}
          discountPrice={item.discount_price}
          quantity={item.quantity_in_stock}
          picture={item.picture_url}
          category={item.category_id}
          tags={item.tags}
          className="item-card"
        />
      ))}
    </div>
  );
}
