import { useParams } from "react-router-dom";
// this hook takes additional parameters from the http-link

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import ProductSection from "../components/Product/ProductSection";

export default function Product() {
  // const params = useParams();

  const { id } = useParams();
  // fetching ID from the http-link in api-get-request: `${process.env.REACT_APP_API_URL}/api/items/${id}`

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/items/${id}`
      );
      return res.data.data;
    },
  });
  // up here React Query decides if data will be fetched from cached data -> then instant rendering, or if needs to send a new api-request

  if (isLoading) return <div className="loader">Loading product...</div>;
  if (isError) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      {/* <Header /> */}
      <div className="div-center">Product / Article Page</div>
      {/* <div className="div-center">Product id: {params.id}</div> */}
      <div className="div-center">Product id: {id}</div>
      {/* taking product-id from the link (http://localhost:3000/products/1234), and using it to show other product data */}
      <div className="div-center">...</div>
      {/* <ProductSection /> */}
      <ProductSection product={product} />
      {/* <Footer /> */}
    </>
  );
}
