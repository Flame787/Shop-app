import { Link } from "react-router-dom";

// import Header from "../components/reusable/Header";
// import Footer from "../components/reusable/Footer";

// fetching data from backend, for example - hier hardcoded:
const PRODUCTS = [
  { id: "1", title: "Product-1" },
  { id: "2", title: "Product-2" },
  { id: "3", title: "Product-3" },
];

export default function ProductsList() {
  return (
    <>
      {/* <Header /> */}
      <div className="div-center">Products in one category</div>
      <ul>
        {/* <li className="div-center">
          <Link to="/products/product-1">Product 1</Link>
        </li>
        <li className="div-center">
          <Link to="/products/product-2">Product 2</Link>
        </li>
        <li className="div-center">
          <Link to="/products/product-3">Product 3</Link>
        </li> */}

        {/* Instead hardcoded links - getting the list of products dynamically, by mapping through the list: */}
        {PRODUCTS.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>{product.title}</Link>
            {/* -> this shound be moved into CategorySection or deeper into CategoryItems */}
          </li>
          // creating different links for differents products with different paths
        ))}
      </ul>
      {/* <Footer /> */}
    </>
  );
}
