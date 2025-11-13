import AdminHeader from "../components/Admin/AdminHeader";
import AdminFooter from "../components/Admin/AdminFooter";

export default function AdminStats() {
  return (
    <>
      <AdminHeader />
      <div className="div-center">This is Admin home page, with stats</div>
      <div className="div-center">...</div>
      <div className="div-center">...</div>
      <AdminFooter />
      {/* <div>Home page</div> */}
      {/* <p>
        Open <Link to="/cart">Cart</Link> to check your Cart items
      </p> */}
    </>
  );
}