import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import {
  About,
  Cart,
  Error,
  Home,
  PrivateRoute,
  Products,
  SingleProduct,
} from "./pages";
import Layout from "./pages/Layout";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <Error />,
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: "about", element: <About /> },
        { path: "cart", element: <Cart /> },
        { path: "products", element: <Products /> },
        { path: "products/:id", element: <SingleProduct /> },
        { path: "checkout/*", element: <PrivateRoute /> },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
