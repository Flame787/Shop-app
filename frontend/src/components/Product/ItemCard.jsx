// import ItemTitle from "./ItemTitle";
// import ItemPicture from "./ItemPicture";
// import ItemDescription from "./ItemDescription";
// import ItemTags from "./ItemTags";
// import ItemPrice from "./ItemPrice";
// import ItemQuantity from "./ItemQuantity";

export default function ItemCard({
  name,
  description,
  price,
  discountPrice,
  quantity,
  picture,
  category,
  tags,
  className,
}) {
  // turn into number (if null or undefined, fallback to 0)
  const numericPrice = price ? Number(price) : 0;
  const numericDiscount = discountPrice ? Number(discountPrice) : null;

  // check if item is on discount:
  const hasDiscount =
    numericDiscount !== null && numericDiscount < numericPrice;

  return (
    <section className={className}>
      <div className="item-image">
        <img src={picture} alt={name} />
      </div>
      <div className="item-info">
        <h3 className="item-name">{name}</h3>
        <p className="item-description">{description}</p>

        <div className="item-pricing">
          {hasDiscount ? (
            <>
              <span className="item-price original">
                €{numericPrice.toFixed(2)}
              </span>
              <span className="item-price discount">
                €{numericDiscount.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="item-price">€{numericPrice.toFixed(2)}</span>
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

        {/* <p className="item-category">Category: {category}</p> */}
      </div>
    </section>
  );
}
