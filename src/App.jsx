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
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthContextProvider } from "./context/AuthContext";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Navigate to="calendar" /> },
      { path: "calendar/:day?", element: <Calendar /> },
      {
        path: "cashaccount/:day",
        element: <CashAccount />,
      },
      {
        path: "totalmonthlysales/:day",
        element: <TotalMonthlySales />,
      },
      {
        path: "dailysales/:day",
        element: <DailySales />,
      },
      {
        path: "customerattendance/:day",
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
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;
