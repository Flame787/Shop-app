import axios from "axios";
import { useState, useEffect } from "react";
import ItemCard from "../Product/ItemCard";

export default function CategoryItems({ categoryId }) {
  // state for collecting all items/products of one category:
  const [items, setItems] = useState([]);

  // state for loading, while data are being fetched:
  const [loading, setLoading] = useState(false);

  // debounce effect for showing message "No items in this category" if products will eventually load, but not in the 1st sec -> delay:
  const [showEmpty, setShowEmpty] = useState(false);

  // side effect for showing message "No items in this category":
  useEffect(() => {
    if (items.length === 0 && !loading) {
      const timer = setTimeout(() => setShowEmpty(true), 300); // wait 300ms
      return () => clearTimeout(timer);
    } else {
      setShowEmpty(false);
    }
  }, [items, loading]);

  // side-effect for fetching all products from one category - API GET-request:
  useEffect(() => {
    if (!categoryId) return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        // const res = await axios.get(`/api/items/category/${categoryId}`);
        // -> cross-origin issue, fetching from http://localhost:5000/api/items/category/1 to http://localhost:3000/products
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/items/category/${categoryId}`
        );
        setItems(res.data.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      } finally {
        setLoading(false); 
      }
    };
    // calling the fetch-function (if a category was selected, and not null):
    if (categoryId) fetchItems();

  }, [categoryId]);

  if (loading) {
    return <div className="loader"></div>;
  }

  // message shows up not immediatelly, but with small delay, after 300 ms:
  if (showEmpty) {
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
