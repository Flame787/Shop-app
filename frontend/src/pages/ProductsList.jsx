import { useOutletContext } from "react-router-dom";

import CategoryItems from "../components/Category/CategoryItems";

export default function ProductsList() {
  // consuming context (selectedCategory) as one of the pages wrapped with Rootlayout:
  const { selectedCategory } = useOutletContext();

  console.log("Selected category:", selectedCategory); // test

  return (
    <>
      <div className="div-center products-category">
        Products in this category:
      </div>

      {selectedCategory ? (
        <CategoryItems categoryId={selectedCategory} />
      ) : (
        <p className="div-center">Please select a category above.</p>
      )}
    </>
  );
}
