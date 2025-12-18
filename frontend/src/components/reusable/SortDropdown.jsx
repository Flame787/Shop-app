export default function SortDropDown({ onSort, selectedOption }) {
  function handleChange(event) {
    onSort(event.target.value);
    // lifting the state up, so no need to manage the state here in this component
  }

  return (
    <div className="div-center sort-dropdown flex-column">
      <label htmlFor="parameter">Sort by: </label>

      <select
        name="parameter"
        id="parameter"
        className="sort-select"
        value={selectedOption}
        onChange={handleChange}
      >
        <option value="default" className="default-option">
          default
        </option>
        <option value="a-z">A to Z</option>
        <option value="z-a">Z to A</option>
        <option value="price-asc">Price: low to high ↑</option>
        <option value="price-desc">Price: high to low ↓</option>
        <option value="newest">Newest</option>
        <option value="bestseller">Best selling</option>
      </select>
    </div>
  );
}
