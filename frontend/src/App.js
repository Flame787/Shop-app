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

import RootLayout from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";

const router = createBrowserRouter([

  // Routes before the layout-wrappers, with absolute paths (/):

  // { path: "/", element: <Home />, errorElement: <Error /> },
  // // start frontend server (npm start) -> test that <Home> renders on http://localhost:3000/

  // { path: "/products", element: <ProductsList /> },
  // // test that <ProductsList> renders on http://localhost:3000/products
  // { path: "/product", element: <Product /> },
  // { path: "/products/:id", element: <Product /> },
  // // dynamically adding the Product-page for any product
  // { path: "/account", element: <Account /> },
  // { path: "/cart", element: <Cart /> },
  // { path: "/delivery", element: <Delivery /> },
  // { path: "/payment", element: <Payment /> },

  // // Admin part
  // { path: "/admin", element: <AdminStats /> },
  // { path: "/admin/products", element: <AdminProducts /> },
  // { path: "/admin/orders", element: <AdminOrders /> },


  // Relative paths (without /), and with wrappers (layouts):

  //Shop layout:
  {
    path: "/",
    element: <RootLayout />, // common UI wrapper (with Header and Footer)
    errorElement: <Error />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <ProductsList /> },
      { path: "products/:id", element: <Product /> },  
      // dynamically adding the Product-page for any product, by product ID - /: is important, then any value can follow, 
      // e.g. http://localhost:3000/products/528   <- product ID = 528
      { path: "account", element: <Account /> },
      { path: "cart", element: <Cart /> },
      { path: "delivery", element: <Delivery /> },
      { path: "payment", element: <Payment /> },
    ],
  },

  // Admin layout:
  {
    path: "/admin",
    element: <AdminLayout />, // admin has different layout
    children: [
      { index: true, element: <AdminStats /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
