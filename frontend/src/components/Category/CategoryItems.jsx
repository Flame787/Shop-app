import axios from "axios";
import { useState, useEffect } from "react";
import ItemCard from "../Product/ItemCard";

export default function CategoryItems({ categoryId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!categoryId) return;

    const fetchItems = async () => {
      try {
        // const res = await axios.get(`/api/items/category/${categoryId}`);  
        // -> cross-origin issue, fetching from http://localhost:5000/api/items/category/1 to http://localhost:3000/products
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/items/category/${categoryId}`
        );
        setItems(res.data.data);
      } catch (err) {
        console.error("Error fetching items:", err);
      }
    };

    if (categoryId) fetchItems();
  }, [categoryId]);

  return (
    <div className="item-grid">
      {items.map((item) => (
        <ItemCard
          key={item.item_id}
          name={item.name}
          description={item.description}
          price={item.price}
          discountPrice={item.discount_price}
          quantity={item.quantity_in_stock}
          picture={item.picture}
          category={item.category_id}
          tags={item.tags}
          className="item-card"
        />
      ))}
    </div>
  );
}
