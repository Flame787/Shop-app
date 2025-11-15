// wrapper for ItemCard (for single Product): 
// can be tesed on: http://localhost:3000/products/:id

import ItemCard from "./ItemCard";

export default function ProductSection() {
  return (
    <>
      <section className="product-section div-center">
        <ItemCard />
      </section>
    </>
  );
}
