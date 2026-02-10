import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state?.orderId;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f472b6, #a78bfa)",
        color: "#fff",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(20px)",
          padding: "60px",
          borderRadius: "30px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "20px" }}>
          🎉 Order Placed Successfully!
        </h1>

        <p style={{ fontSize: "1.1rem", marginBottom: "10px" }}>
          Your order has been confirmed.
        </p>

        {orderId && (
          <p style={{ fontWeight: "800", marginBottom: "30px" }}>
            Order ID: {orderId}
          </p>
        )}

        <button
          onClick={() => navigate("/buyer/orders")}
          style={{
            padding: "14px 28px",
            borderRadius: "16px",
            border: "none",
            fontWeight: "800",
            background: "#fff",
            color: "#7c3aed",
            cursor: "pointer",
          }}
        >
          View My Orders
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;