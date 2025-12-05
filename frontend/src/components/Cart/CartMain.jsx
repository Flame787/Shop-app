// CartMain - main child component of the Cart-page and CartModal:
// gets access to cartitems from the global store
import { useContext } from "react";
import CartContext from "../../context-store/CartContext";

export default function CartMain() {
  const cartCtx = useContext(CartContext);

  const cartTotalPrice = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.quantity * item.price,
    0
  );

  return (
    <>
      <section className="cart-main div-center">
        <div className="cart-items-info">
          <h3>Items in the chart</h3>
          <ul>
            {cartCtx.items.map((item) => (
              <li key={item.id} className="cart-item">
                <div className="cart-item-picture">
                  <img
                    src={item.picture}
                    alt={item.name}
                    className="cart-image product-image"
                  />
                </div>
                <div className="cart-item-name">{item.name}</div>

                <div className="cart-item-price">
                  Price:{" "}
                  {item.discountPrice && item.discountPrice < item.price ? (
                    <>
                      <span className="original-price">
                        €{item.price.toFixed(2)}
                      </span>
                      <span className="discount-price">
                        €{item.discountPrice.toFixed(2)}
                      </span>
                    </>
                  ) : (
                    <span>€{item.price.toFixed(2)}</span>
                  )}
                </div>
                <div className="cart-item-quantity">
                  Quantity: {item.quantity}
                </div>
              </li>
            ))}
          </ul>
          <div className="cart-total-price">Total Price: {cartTotalPrice.toFixed(2)} €</div>
        </div>
        <button>Proceed to payment</button>
      </section>
    </>
  );
}
