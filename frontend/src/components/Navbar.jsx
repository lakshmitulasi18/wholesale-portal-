import { useNavigate } from "react-router-dom";

const Navbar = ({ title = "Wholesale Portal" }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("LOGGED_USER");
    navigate("/");
  };

  return (
    <header style={{
      background: "#0f766e",
      color: "#fff",
      padding: "15px 25px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>
      <h2>{title}</h2>
      <button
        onClick={logout}
        style={{
          background: "#ef4444",
          border: "none",
          padding: "8px 16px",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </header>
  );
};

export default Navbar;
