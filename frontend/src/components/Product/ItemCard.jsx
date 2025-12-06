import { useState, useContext } from "react";
import CartContext from "../../context-store/CartContext";
import { toast } from "react-toastify"; // Toastify - for instant notifications (Toastify is set up in RootLayout component)

export default function ItemCard({
  id,
  name,
  description,
  price,
  discountPrice,
  quantity,
  picture,
  category,
  tags,
  className,
  onClick,
}) {
  // access to cart-context:
  const cartCtx = useContext(CartContext);

  // State for quantity-button:
  const [qty, setQty] = useState(1);

  const increase = () => setQty((q) => q + 1);
  const decrease = () => setQty((q) => (q > 1 ? q - 1 : 1));

  // turn price into number (if null or undefined, fallback to 0)
  const numericPrice = price ? Number(price) : 0;
  const numericDiscount = discountPrice ? Number(discountPrice) : null;

  // check if item is on discount:
  const hasDiscount =
    numericDiscount !== null && numericDiscount < numericPrice;

  // function for adding items to cart:
  function handleAddToCart() {
    try {
      cartCtx.addItem({
        id,
        name,
        description,
        price: hasDiscount ? numericDiscount : numericPrice,
        quantity: qty,
        picture,
        category,
        tags,
      });

      // a toast-notification in lower right corner, whenever an item gets added to the Cart:

      // toast(`✓ ${name} added to cart`);
      toast(
        <div>
          <span className="checkmark">✓</span>{" "}
          <span className="toast-itemname">{name} </span>({qty}) added to cart
        </div>
      );
    } catch (error) {
      toast.error(
        <div>
          <span className="toast-itemname">{name}</span> could not be added
        </div>
      );
    }
  }

  return (
    <section className={className}>
      <div className="item-image" onClick={onClick}>
        <img src={picture} alt={name} className="product-image" />
      </div>
      <div className="item-info">
        <h3 className="item-name" onClick={onClick}>
          {name}
        </h3>
        <p className="item-description" onClick={onClick}>
          {description}
        </p>

        <div className="item-pricing" onClick={onClick}>
          {hasDiscount ? (
            <>
              <span className="item-price original">
                {numericPrice.toFixed(2)} €
              </span>
              <span className="item-price discount">
                {numericDiscount.toFixed(2)} €
              </span>
            </>
          ) : (
            <span className="item-price">{numericPrice.toFixed(2)} €</span>
          )}
        </div>

        <p className="item-quantity">In stock: {quantity}</p>

        {tags && (
          <div className="item-tags">
            {tags.split(",").map((tag) => (
              <span key={tag.trim()} className="tag">
                {tag.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="item-bottom">
          <div className="quantity-selector">
            <label>Quantity:</label>

            <div className="quantity-box">
              <button onClick={decrease} className="qty-btn">
                −
              </button>

              {/* <span className="qty-value">{qty}</span> */}
              <input
                type="number"
                min="1"
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="qty-input"
              />

              <button onClick={increase} className="qty-btn">
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="link buy-button button-text"
          >
            Add to Cart
          </button>
        </div>

        {/* <p className="item-category">Category: {category}</p> */}
      </div>
    </section>
  );
}
