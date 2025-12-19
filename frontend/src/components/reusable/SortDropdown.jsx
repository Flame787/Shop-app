export default function SortDropDown({ onSort, selectedOption }) {
                                    // recieves the setter-function & state from the parent-component as props
  // handler-function:
  function handleChange(event) {
    onSort(event.target.value);
    // setter-function is recieved via 'onSort'-prop and it sets the state to event.target.value - selected via user-interaction in this component
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
        // value is state-value, received from outer state in parent-component, but it also gets changed here in this component
        onChange={handleChange}   // change-event is setting new state, and causing that the component re-renders, to reflect the changes
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
