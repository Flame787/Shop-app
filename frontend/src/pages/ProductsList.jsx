import { useOutletContext, useNavigate } from "react-router-dom";

import CategoryItems from "../components/Category/CategoryItems";

export default function ProductsList() {
  // consuming context (selectedCategory) as one of the pages wrapped with Rootlayout:
  const { selectedCategory } = useOutletContext();

  // enables navigation to another page -> Product.jsx:
  const navigate = useNavigate();

  console.log("Selected category:", selectedCategory); // test

  function handleItemSelected(id) {
    console.log("Parent has received id:", id);
    // navigacija na detaljnu stranicu proizvoda
    navigate(`/products/${id}`);
  }

  return (
    <>
      <div className="div-center products-category">
        Products in this category:
      </div>

      {selectedCategory ? (
        <CategoryItems
          categoryId={selectedCategory}
          // onItemSelected={(id) => console.log("Parent has recieved id:", id)}
          onItemSelected={handleItemSelected}
        />
      ) : (
        <p className="div-center">Please select a category above.</p>
      )}
    </>
  );
}
