// CartMain - main child component of the Cart-page and CartModal:
// gets access to cartitems from the global store
import { useContext } from "react";
import CartContext from "../../context-store/CartContext";
import { toast } from "react-toastify"; // Toastify - for instant notifications (Toastify is set up in RootLayout component)

export default function CartMain() {
  const cartCtx = useContext(CartContext);

  // // State for quantity-button:
  // const [qty, setQty] = useState(1);

  // const increase = () => setQty((q) => q + 1);
  // const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  const cartTotalPrice = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
    return totalNumberOfItems + item.quantity;
  }, 0);

  // handler-functions which are editing items-contaxt-state and adding toast-notifications for each operation:
  function handleQuantityChange(id, newQty, name) {
    cartCtx.updateItemQuantity(id, newQty);

    toast(
      <div>
        <span className="checkmark">✓</span>{" "}
        <span className="toast-itemname">{name}</span> quantity updated
      </div>
    );
  }

  function handleDeleteItem(id, name) {
    cartCtx.deleteItem(id);

    toast(
      <div>
        <span className="error-icon">❌</span>{" "}
        <span className="toast-itemname">{name}</span> removed from cart
      </div>
    );
  }

  return (
    <>
      <section className="cart-main div-center">
        <div className="cart-items-info">
          <h3 className="main-title2 div-center">
            Selected products ({totalCartItems}):
          </h3>
          <ul>
            {cartCtx.items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-picture item-image">
                  <img
                    src={item.picture}
                    alt={item.name}
                    className="cart-image product-image"
                  />
                </div>

                <div className="cart-all-text">
                  <div className="cart-main-part">
                    <div className="cart-item-name">{item.name}</div>

                    <div className="cart-price">
                      Price:{" "}
                      {item.discountPrice && item.discountPrice < item.price ? (
                        <>
                          <span className="original-price cart-item-price">
                            {item.price.toFixed(2)} €
                          </span>
                          <span className="discount-price cart-item-price">
                            {item.discountPrice.toFixed(2)} €
                          </span>
                        </>
                      ) : (
                        <span className="cart-item-price">
                          {item.price.toFixed(2)} €
                        </span>
                      )}
                    </div>

                    <div className="quantity-selector-cart">
                      <label>Quantity:</label>

                      <div className="quantity-box">
                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              Math.max(1, item.quantity - 1),
                              item.name
                            )
                          }
                          className="qty-btn"
                        >
                          −
                        </button>

                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.id,
                              Number(e.target.value),
                              item.name
                            )
                          }
                          className="qty-input"
                        />

                        <button
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity + 1, item.name
                            )
                          }
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="cart-remove-button">
                    <button
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="link category-link remove-button"
                    >
                      Remove item
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-total-price">
            Total Price:{" "}
            <span className="cart-total-euros">
              {cartTotalPrice.toFixed(2)} €
            </span>
          </div>
        </div>
        <button className="link category-link proceed-button">
          Proceed to payment <span className="arrow">➡</span>
        </button>
      </section>
    </>
  );
}
