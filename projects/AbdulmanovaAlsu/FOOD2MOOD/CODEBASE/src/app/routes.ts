import { createBrowserRouter } from "react-router";
import RootLayout from "./layouts/RootLayout";
import Onboarding from "./pages/Onboarding";
import Menu from "./pages/Menu";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Onboarding,
      },
      {
        path: "menu",
        Component: Menu,
      },
    ],
  },
]);