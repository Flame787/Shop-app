// Product-page opens on this link:  { path: "products/:id", element: <Product /> }

import { useParams } from "react-router-dom";
// this hook takes additional parameters from the http-link

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import ProductSection from "../components/Product/ProductSection";

export default function Product() {
  // const params = useParams();

  const { id } = useParams();
  // fetching ID-parameter from the http-link: http://localhost:3000/products/24 -> id='24'

  // useQuery()-call, for fetching product-data based on the ID from the link:
  const {          // state-object {} received from useQuery, has 3 parts:
    data: product, // 1. result-state received from fetching-function, or from cache
    isLoading,     // 2. loading-state: true, while fetching data
    isError,       // 3. error-state: true only if fetching-function results with error
  } = useQuery({
    // useQuery()-call
    queryKey: ["product", id], // unique key for saving fetched data in cache
    queryFn: async () => {
      // function for fetching data (API-call to a defined route on backend), if data not found in cache:
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/items/${id}`
      );
      return res.data.data;
    },
  });
  // up here React Query decides weather the data will be fetched from cached data -> then instant rendering; or if needs to send a new api-request
  // if the same 'id' is requested again, data will be taken from cache (under the same key as before).

  if (isLoading) return <div className="loader">Loading product...</div>;
  if (isError) return <div>Error loading product</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <>
      <div className="div-center main-title">Product Overview</div>
      {/* <div className="div-center">Product id: {params.id}</div> */}
      <div className="div-center">Product id: {id}</div>
      {/* taking product-id from the link (http://localhost:3000/products/1234), and using it to show other product data */}
      <div className="div-center">...</div>
      {/* <ProductSection /> */}
      <ProductSection product={product} />
      {/* passing the data to child-component ProductSection */}
    </>
  );
}
