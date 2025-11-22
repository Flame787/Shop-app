import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CategoriesBox({ onSelectCategory, selectedCategory }) {
  // accepting one prop - { onSelectCategory } - function, passed from the Parent

  // needed for saving state on existing product-categories:
  const [categories, setCategories] = useState([]);

  // when a category is selected, navigating to this page: http://localhost:3000/products
  const navigate = useNavigate();

  // side-effect for fetching category-names:
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/categories`
        );
        setCategories(res.data.data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <div>
        <div className="div-center all-text margin-bottom">Select a category:</div>
        <div className="categories button-list">
          {/* 
          <button className="link category-link" onClick={() => handleCategoryClick(1)}>Category 1</button>
          <button className="link category-link" onClick={() => handleCategoryClick(2)}>Category 2</button>
          <button className="link category-link" onClick={() => handleCategoryClick(3)}>Category 3</button>
        // etc. */}

          {/* {[...Array(10)].map((_, i) => {
            const categoryId = i + 1;
            const isActive = selectedCategory === categoryId; */}

          {categories.length === 0 ? (
            <p className="div-center">No categories available</p>
          ) : (
            categories.map((categ) => {
              const isActive = selectedCategory === categ.category_id;

              return (
                <button
                  // key={i + 1}
                  key={categ.category_id}
                  // className="link category-link"
                  className={`link category-link all-text ${
                    isActive ? "active-link" : ""
                  }`}
                  onClick={() => {
                    // console.log("Clicked category:", i + 1);   // - older version, for Array
                    console.log("Clicked category:", categ.category_id);
                    // onSelectCategory(i + 1);     // - older version, for Array
                    onSelectCategory(categ.category_id);
                    // on click - calling the onSelectCategory()-function & passing an argument
                    navigate("/products");
                    // on category select - navigate to the Products page: http://localhost:3000/products
                  }}
                >
                  {/* {i + 1} - gives values from 1 to 10 - generates 10 buttons (1-10) */}
                  {/* on click - passing a value to the onSelectCategory()-function, which was forwarded as a setter-function 
              from RootLayout wrapper via Header-component - and now we are lifting the state up to the parent */}

                  {/* Category {categoryId}    // - older version, for Array  */}
                  {categ.category_name}
                </button>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
