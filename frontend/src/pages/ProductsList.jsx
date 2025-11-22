import { useOutletContext } from "react-router-dom";
import { useState, useEffect } from "react";
import CategoryItems from "../components/Category/CategoryItems";

export default function ProductsList() {
  const { selectedCategory } = useOutletContext();

  // to show a loader while products are loading:
  const [loading, setLoading] = useState(false);

  console.log("Selected category:", selectedCategory); // test

  useEffect(() => {
    if (selectedCategory) {
      setLoading(true);
      // when category is selected/changed, show loading-spinner (simulates a small loader):
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory]); // dependency - when category changes, this effect rerenders

  return (
    <>
      {/* <Header /> */}
      <div className="div-center products-category">Products in this category:</div>

      {loading ? (
        <div className="loader"></div>
      ) : selectedCategory ? (
        <CategoryItems categoryId={selectedCategory} />
      ) : (
        <p className="div-center">Please select a category above.</p>
      )}
    </>
  );
}
