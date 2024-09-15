import React from "react";
import ReactDOM, { createRoot } from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { App } from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Authorization } from "./pages/authentication/authorization/authorization";
import { Registration } from "./pages/authentication/registration/registration";
import { MainPage } from "./pages/mainPage/mainPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Authorization />,
  },
  {
    path: "/registration",
    element: <Registration />,
  },
  {
    path: "/mainPage",
    element: <MainPage />,
  },
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider router={router} />
);
