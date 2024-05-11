import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import LoginPage from "../src/pages/login";
import RegisterPage from "../src/pages/register";
import Home from "./pages/home";
import BuildAutomation from "./pages/buildAutomation";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/build-automation",
    element : <BuildAutomation/>
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

//https://colorhunt.co/palette/070f2b1b1a55535c919290c3
