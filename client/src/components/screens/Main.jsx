import React from "react";
import NavBar from "../components/NavBar";
import FormScreen from "./FormScreen";
import Input from "./InputScreen";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
const Main = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <NavBar />
          <Input />
        </>
      ),
    },

    {
      path: "/next",
      element: (
        <>
          <NavBar />
          <FormScreen />
        </>
      ),
    },
  ]);
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

export default Main;
