// wrapper for ItemCard (for single Product):
// can be tested on: http://localhost:3000/products/:id

// ProductSection is a child-component of Product.jsx - page: { path: "products/:id", element: <Product /> }
// ProductSection serves as a component for rendering data from parent: Product.jsx
// data are fetched from Product.jsx, where React Query decides if getting already cached data, or sending a new fetch-request

import { useState, useEffect } from "react";
import ItemCard from "./ItemCard";

export default function ProductSection({ product }) {
  // changing style of the ItemCard dinamically, depending if on bigger or smaller resolution:
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 656);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 656);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <section className="product-section div-center">
        <ItemCard
          key={product.item_id}
          id={product.item_id}
          name={product.name}
          description={product.description}
          price={product.price}
          discountPrice={product.discount_price}
          quantity={product.quantity_in_stock}
          picture={product.picture_url}
          category={product.category_id}
          tags={product.tags}
          className={isMobile ? "item-card" : "product-card"}
        />
      </section>
    </>
  );
}

// add another class to ItemCard, that will overwrite or modify existing "item-card", that makes the ProductCard bigger
