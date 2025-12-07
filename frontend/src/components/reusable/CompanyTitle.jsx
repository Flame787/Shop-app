export default function CompanyTitle() {
  return (
    <div className="div-center flex-column logo-background">
      <img
        src="/logo1orange.png"
        alt="Company Logo"
        height="80"
        width="80"
        style={{ objectFit: "contain" }}
      ></img>
      <div className="logo-text">
        <span className="orange-letters">Smart</span>Space{" "}
        <span className="orange-letters">Studio</span>
      </div>
    </div>
  );
}
