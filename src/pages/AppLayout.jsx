import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <main className="container px-3">
      <Outlet />
    </main>
  );
}

export default AppLayout;
