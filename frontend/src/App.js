import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import Home from "./pages/Home";
import ProductsList from "./pages/ProductsList";
import Product from "./pages/Product";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Delivery from "./pages/Delivery";
import Payment from "./pages/Payment";
import Error from "./pages/Error";

import AdminStats from "./pages/AdminStats";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";

const router = createBrowserRouter([
  { path: "/", element: <Home />, errorElement: <Error /> },
  // start frontend server (npm start) -> test that <Home> renders on http://localhost:3000/
  { path: "/products", element: <ProductsList /> },
  // test that <ProductsList> renders on http://localhost:3000/products

  { path: "/product", element: <Product /> },
  { path: "/products/:id", element: <Product /> },   
  // new, dynamically adding the Product-page for any product - /: is important, then any value can follow
  { path: "/account", element: <Account /> },
  { path: "/cart", element: <Cart /> },
  { path: "/delivery", element: <Delivery /> },
  { path: "/payment", element: <Payment /> },

  // Admin part
  { path: "/admin", element: <AdminStats /> },
  { path: "/admin/products", element: <AdminProducts /> },
  { path: "/admin/orders", element: <AdminOrders /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
