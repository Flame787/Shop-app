import { useOutletContext } from "react-router-dom";
import CategoryItems from "../components/Category/CategoryItems";

export default function ProductsList() {
  const { selectedCategory } = useOutletContext();

   console.log("Selected category:", selectedCategory);

  return (
    <>
      {/* <Header /> */}
      <div className="div-center">Products in one category:</div>
      {selectedCategory ? (
        <CategoryItems categoryId={selectedCategory} />
      ) : (
        <p className="div-center">Please select a category above.</p>
      )}
    </>
  );
}
