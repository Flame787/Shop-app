import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";

export default function Error() {
  return (
    <>
      <Header />
      <div className="div-center">An error occurred!</div>
      <div className="div-center">Could not find this page.</div>
      <Footer />
    </>
  );
}
