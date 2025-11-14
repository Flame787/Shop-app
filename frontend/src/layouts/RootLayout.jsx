import { Outlet } from "react-router-dom";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";

export default function RootLayout() {
  return (
    <>
      <Header />

      <main style={{ minHeight: "80vh" }}>   
        {/* pushes footer down, even if it's not much content on the page */}
        <Outlet />
      </main>

      <Footer />
    </>
  );
}