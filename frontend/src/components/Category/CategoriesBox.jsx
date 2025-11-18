// import { useState } from "react";

export default function CategoriesBox({ onSelectCategory }) {
  // accepting one prop - { onSelectCategory } - function, passed from the Parent

  // const [selectedCategory, setSelectedCategory] = useState();

  // const handleCategoryClick = (categoryId) => {
  //   setSelectedCategory(categoryId);
  // };

  return (
    <>
      <div>
        <div className="div-center">Select a category:</div>
        <div className="categories button-list">
          {/* <button className="link category-link" onClick={() => handleCategoryClick(1)}>Category 1</button>
          <button className="link category-link" onClick={() => handleCategoryClick(2)}>Category 2</button>
          <button className="link category-link" onClick={() => handleCategoryClick(3)}>Category 3</button>
          <button className="link category-link" onClick={() => handleCategoryClick(4)}>Category 4</button>
          <button className="link category-link" onClick={() => handleCategoryClick(5)}>Category 5</button>
          <button className="link category-link" onClick={() => handleCategoryClick(6)}>Category 6</button>
          <button className="link category-link" onClick={() => handleCategoryClick(7)}>Category 7</button>
          <button className="link category-link" onClick={() => handleCategoryClick(8)}>Category 8</button>
          <button className="link category-link" onClick={() => handleCategoryClick(9)}>Category 9</button>
          <button className="link category-link" onClick={() => handleCategoryClick(10)}>Category 10</button> */}

          {[...Array(10)].map((_, i) => (
            <button
              key={i + 1}
              className="link category-link"
              onClick={() => {
                console.log("Clicked category:", i + 1);
                onSelectCategory(i + 1);
              }}
            >
              {/* {i + 1} - gives values from 1 to 10 - generates 10 buttons (1-10) */}
              {/* on click - passing a value to the onSelectCategory()-function, which was forwarded as a setter-function 
              from RootLayout wrapper via Header-component - and now we are lifting the state up to the parent */}
              Category {i + 1}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
