import { createContext, useReducer } from "react";

// state managed in context - object with attributes: items, addItem, removeItem:
const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
});

// using useReducer instead of useState, for managing more complex state:
function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    // update the state, to add a product to the cart
    // state.items.push(action.item) - not ok, never mutate the existing state!
    const existingCartItemIndex = state.items.findIndex(
      // findIndex() returns -1 if it doesn't find a value, otherwise: > -1 = item already exists in [items]-array
      (item) => item.id === action.item.id
    );
    // creating new Array, and new array-object in memory
    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      // new variable, to shorten the code:
      const existingItem = state.items[existingCartItemIndex];
      // taking all properties of an existing item, spreading them into this new object, & adding +1 to quantity-property:
      const updatedItem = {
        ...existingItem,
        // quantity: existingItem.quantity + 1,
        quantity: existingItem.quantity + action.item.quantity,
      };
      // overwriting existing item with the updatedItem (if quantity has changed):
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      // if not > -1, item doesn't exist in array, and should be added (push). Also adding quantity-property & setting it to 1:
      // updatedItems.push({ ...action.item, quantity: 1 });
      updatedItems.push({ ...action.item, quantity: action.item.quantity });
    }
    // returning new object - keeping parts that didn't change, and overwriting items with updatedItems:
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    // remove a product from the state
    const existingCartItemIndex = state.items.findIndex(
      // findIndex() returns -1 if it doesn't find a value, otherwise: > -1 = item already exists in [items]-array
      (item) => item.id === action.id
      // here action.id is the id of the item to be removed (sent as payload); we don't need the entire item object, just the id
    );
    const existingCartItem = state.items[existingCartItemIndex];

    const updatedItems = [...state.items];

    // if quantity of product in the cart is 1, on REMOVE we want to remove the entire item from the cart:
    if (existingCartItem.quantity === 1) {
      // method that removes a number of items from array (here it removes only 1 item):
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      // if the quantity of item in the cart is bigger than 1, we want to just remove -1, update that quantity, but leave the item in the cart,
      // we are creating a new item (a copy), based on old item, with reduced quantity:
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      // overwriting existing item with the updatedItem (if quantity has changed):
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    // returning new object - keeping parts that didn't change, and overwriting items with updatedItems:
    return { ...state, items: updatedItems };
  }

  // function for updating item quantity in the Cart:
  if (action.type === "UPDATE_ITEM_QUANTITY") {
    const updatedItems = state.items.map((item) =>
      item.id === action.id ? { ...item, quantity: action.quantity } : item
    );
    return { ...state, items: updatedItems };
  }

  // function for deleting entirely a product from the Cart with Remove-button:
  if (action.type === "DELETE_ITEM") {
    const updatedItems = state.items.filter((item) => item.id !== action.id);
    return { ...state, items: updatedItems };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });
  // destructuring the state that is returned by useReducer-hook: 1st part is cart-state, 2nd part is dispatchCartAction
  // 1st parameter of useReducer-hook: passing the name of reducer-function (not calling it, just passing it)
  // 2nd parameter of useReducer-hook: initial state, when component renders for the first time.

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
    // calling the dispatch-function, passing an action-object with action-type and item as payload
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
    // calling the dispatch-function, passing an action-object with action-type and id as payload
  }

  // function for updating item quantity in the Cart:
  function updateItemQuantity(id, quantity) {
    dispatchCartAction({ type: "UPDATE_ITEM_QUANTITY", id, quantity });
  }

  // function for deleting entirely a product from the Cart with Remove-button:
  function deleteItem(id) {
    dispatchCartAction({ type: "DELETE_ITEM", id });
  }

  // passing the state to CartContextProvider (so other components can access it via useContext-hook):
  const cartContext = {
    items: cart.items,
    addItem: addItem,
    removeItem: removeItem,
    updateItemQuantity,
    deleteItem,
  };

  console.log("cartContext:", cartContext);

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
