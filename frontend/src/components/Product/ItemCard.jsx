import ItemTitle from "./ItemTitle";
import ItemPicture from "./ItemPicture";
import ItemDescription from "./ItemDescription";
import ItemTags from "./ItemTags";
import ItemPrice from "./ItemPrice";
import ItemQuantity from "./ItemQuantity";

export default function ItemCard() {
  return (
    <>
      <section className="item-card">
        <ItemTitle />
        <ItemPicture />
        <ItemDescription />
        <ItemTags />
        <ItemPrice />
        <ItemQuantity />
      </section>
    </>
  );
}
