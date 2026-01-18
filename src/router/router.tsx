import { createBrowserRouter } from "react-router-dom";
import DashboardView from "../pages/DashboardView";
import Products from "../pages/Products";
import DashboardLayout from "../pages/DashboardLayout";
import Services from "../pages/Services";
import Orders from "../pages/Orders";
import Settings from "../pages/Settings";
import Users from "../pages/Users";
import Login from "../pages/auth/Login";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <DashboardLayout />, // 🔥 LAYOUT
    children: [
      { index: true, element: <DashboardView /> },
      { path: "settings", element: <Settings /> },
      { path: "services", element: <Services /> },
      { path: "products", element: <Products /> },
      { path: "users", element: <Users /> },
      { path: "orders", element: <Orders /> },
    ],
  },
]);
