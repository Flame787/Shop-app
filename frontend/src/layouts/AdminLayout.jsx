import { Outlet } from "react-router-dom";
import AdminHeader from "../components/Admin/AdminHeader";
import AdminFooter from "../components/Admin/AdminFooter";

export default function RootLayout() {
  return (
    <>
      <AdminHeader />

      <main style={{ minHeight: "80vh" }}>   
        {/* pushes footer down, even if it's not much content on the page */}
        <Outlet />
      </main>

      <AdminFooter />
    </>
  );
}