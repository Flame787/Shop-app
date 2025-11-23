import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import CategoryItems from "../components/Category/CategoryItems";

export default function ProductsList() {
  // consuming context (selectedCategory) as one of the pages wrapped with Rootlayout:
  const { selectedCategory } = useOutletContext();

  // to show a loader while products are loading:
  const [loading, setLoading] = useState(false);

  // new, to be able to recieve the loading-status from the child-component CategoryItems.jsx:
  const handleLoading = (status) => {
    setLoading(status);
  };

  console.log("Selected category:", selectedCategory); // test

  // *temporary loader, lasting always for 300ms, not displaying real loading state:

  // useEffect(() => {
  //   if (selectedCategory) {
  //     setLoading(true);
  //     // when category is selected/changed, show loading-spinner (simulates a small loader):
  //     const timer = setTimeout(() => setLoading(false), 300);
  //     return () => clearTimeout(timer);
  //   }
  // }, [selectedCategory]); // dependency - when category changes, this effect rerenders

  return (
    <>
      <div className="div-center products-category">
        Products in this category:
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : selectedCategory ? (
        <CategoryItems categoryId={selectedCategory} onLoading={handleLoading} />
      ) : (
        <p className="div-center">Please select a category above.</p>
      )}
    </>
  );
}
