import { useParams } from "react-router-dom";
// this hook takes additional parameters from the http-link

import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";

export default function Product() {

  const params = useParams();
  // params.id;

  return (
    <>
      <Header />
      <div className="div-center">Product / Article Page</div>
      <div className="div-center">Product id: {params.id}</div> 
      {/* taking product-id from the link (http://localhost:3000/products/1234), and using it to show other product data */}
      <div className="div-center">...</div>
      <Footer />
    </>
  );
}
