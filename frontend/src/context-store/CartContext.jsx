import { createContext, useReducer, useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../util/axiosConfig";

const CART_STORAGE_KEY = "shop_cart";

const saveCartToLocalStorage = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items }));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const loadCartFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return { items: [] };
    const parsed = JSON.parse(stored);
    return { items: Array.isArray(parsed.items) ? parsed.items : [] };
  } catch (error) {
    console.error("Error loading cart from localStorage:", error);
    return { items: [] };
  }
};

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
});

function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + action.item.quantity,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      updatedItems.push({ ...action.item, quantity: action.item.quantity });
    }
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    const updatedItems = [...state.items];

    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    return { ...state, items: updatedItems };
  }

  if (action.type === "UPDATE_ITEM_QUANTITY") {
    const updatedItems = state.items.map((item) =>
      item.id === action.id ? { ...item, quantity: action.quantity } : item
    );
    return { ...state, items: updatedItems };
  }

  if (action.type === "DELETE_ITEM") {
    const updatedItems = state.items.filter((item) => item.id !== action.id);
    return { ...state, items: updatedItems };
  }

  if (action.type === "SET_CART") {
    return { ...state, items: action.items };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

export function CartContextProvider({ children }) {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Tracks whether user was previously logged in, to distinguish
  // "initial mount (auth not yet checked)" from "actual logout"
  const wasLoggedIn = useRef(false);

  // On initial mount: load localStorage cart for guests
  useEffect(() => {
    const localCart = loadCartFromLocalStorage();
    if (Array.isArray(localCart.items) && localCart.items.length > 0) {
      dispatchCartAction({ type: "SET_CART", items: localCart.items });
    }
  }, []);

  // Save cart on every change:
  // - guests: save to localStorage
  // - logged-in users: save to DB (only after cart has been loaded from DB)
  useEffect(() => {
    if (isLoggedIn) {
      if (!isCartLoaded) return;
      axiosInstance.post("/api/cart", { items: cart.items }).catch((error) => {
        console.error("Error saving cart:", error);
      });
    } else {
      saveCartToLocalStorage(cart.items);
    }
  }, [cart.items, isLoggedIn, isCartLoaded]);

  // Handle login and logout
  useEffect(() => {
    if (!isLoggedIn) {
      if (wasLoggedIn.current) {
        // Actual logout: clear cart state and localStorage so another
        // user/guest starting fresh won't see the previous user's items
        dispatchCartAction({ type: "CLEAR_CART" });
        localStorage.removeItem(CART_STORAGE_KEY);
      }
      wasLoggedIn.current = false;
      setIsCartLoaded(false);
      return;
    }

    wasLoggedIn.current = true;

    const fetchCart = async () => {
      try {
        const response = await axiosInstance.get("/api/cart");
        const savedCart = response.data.cart;

        if (savedCart && Array.isArray(savedCart.items) && savedCart.items.length > 0) {
          // DB has items for this user: use them, discard any localStorage guest cart
          dispatchCartAction({ type: "SET_CART", items: savedCart.items });
          localStorage.removeItem(CART_STORAGE_KEY);
        } else {
          // DB cart is empty (new user or user cleared their cart):
          // migrate guest localStorage cart to DB, then clear localStorage
          const localCart = loadCartFromLocalStorage();
          if (Array.isArray(localCart.items) && localCart.items.length > 0) {
            dispatchCartAction({ type: "SET_CART", items: localCart.items });
            try {
              await axiosInstance.post("/api/cart", { items: localCart.items });
            } catch (error) {
              console.error("Error syncing local cart to server:", error);
            }
          }
          localStorage.removeItem(CART_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsCartLoaded(true);
      }
    };

    fetchCart();
  }, [isLoggedIn]);

  function addItem(item) {
    dispatchCartAction({ type: "ADD_ITEM", item: item });
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_ITEM", id: id });
  }

  function updateItemQuantity(id, quantity) {
    dispatchCartAction({ type: "UPDATE_ITEM_QUANTITY", id, quantity });
  }

  function deleteItem(id) {
    dispatchCartAction({ type: "DELETE_ITEM", id });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });
    localStorage.removeItem(CART_STORAGE_KEY);
  }

  const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    updateItemQuantity,
    deleteItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
