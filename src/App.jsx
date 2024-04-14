import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import ErrorElement from "./pages/ErrorElement";
import Calendar from "./pages/Calendar";
import Login from "./pages/Login";
import CashAccount from "./pages/CashAccount";
import TotalMonthlySales from "./pages/TotalMonthlySales";
import DailySales from "./pages/DailySales";
import CustomerAttendance from "./pages/CustomerAttendance";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Navigate to="calendar" /> },
      { path: "calendar/:day?", element: <Calendar /> },
      {
        path: "cashaccount",
        element: <CashAccount />,
      },
      {
        path: "totalmonthlysales",
        element: <TotalMonthlySales />,
      },
      {
        path: "dailysales/:day",
        element: <DailySales />,
      },
      {
        path: "customerattendance",
        element: <CustomerAttendance />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
