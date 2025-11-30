// CartMain - main child component of the Cart-page and CartModal:
// gets access to cartitems from the global store

export default function CartMain({ cartitems }) {
  return (
    <>
      <section className="cart-main">
        <div>
          <h3>Items in the chart</h3>
          <ul>
            {cartitems.map((item) => {
              <li key={item.item_id} className="cart-item">
                <div className="cart-item-picture">{item.picture}</div>
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">
                  Price: {item.discount_price ?? item.price} €
                </div>
                <div className="cart-item-quantity">
                  Quantity: {item.quantity_in_stock}
                </div>
              </li>;
            })}
          </ul>
        </div>
        <button>Proceed to payment</button>
      </section>
    </>
  );
}
