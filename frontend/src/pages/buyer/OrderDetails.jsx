import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText } from "lucide-react";
import { useOrders } from "../../context/OrdersContext";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrders();
  const order = orders.find(o => o.id === orderId);


  if (!order) {
    return (
      <div style={{ padding: 60 }}>
        <h2>Order not found</h2>
        <button onClick={() => navigate("/buyer/orders")}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <ArrowLeft size={18} /> Back
        </button>
        <h1 style={styles.title}>Order #{order.id}</h1>
      </header>

      <div style={styles.card}>
        <div style={styles.metaRow}>
          <div>
            <span style={styles.label}>Placed On</span>
            <div>{new Date(order.date).toLocaleString()}</div>
          </div>
          <div>
            <span style={styles.label}>Ship To</span>
            <div>{order.shipTo || "Lakshmi Tulasi"}</div>
          </div>
          <div>
            <span style={styles.label}>Status</span>
            <div style={{ fontWeight: 800, color: "#16a34a" }}>
              {order.status || "Confirmed"}
            </div>
          </div>
        </div>

        <div style={styles.items}>
          {order.items.map(item => (
            <div key={item.id} style={styles.itemRow}>
              <img src={item.img} alt={item.name} style={styles.img} />
              <div style={{ flex: 1 }}>
                <div style={styles.name}>{item.name}</div>
                <div style={styles.sub}>
                  ₹{item.price} × {item.qty}
                </div>
              </div>
              <div style={styles.amount}>
                ₹{(item.price * item.qty).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.summary}>
          <Row label="Subtotal" value={order.subtotal} />
          <Row label="GST (5%)" value={order.tax} />
          <Row label="Logistics" value={order.shipping === 0 ? "FREE" : `₹${order.shipping}`} />
          {order.discount > 0 && (
            <Row label="Coupon Discount" value={`-₹${order.discount.toLocaleString()}`} />
          )}
          <div style={styles.totalRow}>
            <span>Grand Total</span>
            <span>₹{order.total.toLocaleString()}</span>
          </div>
        </div>

        <div style={styles.footer}>
          <FileText size={16} /> This is a system-generated order summary.
        </div>
      </div>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div style={styles.row}>
    <span>{label}</span>
    <span>{typeof value === "number" ? `₹${value.toLocaleString()}` : value}</span>
  </div>
);

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f472b6, #a78bfa)",
    padding: "120px 40px 40px"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 20,
    marginBottom: 30,
    color: "#fff"
  },
  backBtn: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    padding: "10px 16px",
    borderRadius: 10,
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 6
  },
  title: {
    fontSize: 28,
    fontWeight: 900
  },
  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 40,
    maxWidth: 900,
    margin: "0 auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
  },
  metaRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    marginBottom: 30
  },
  label: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 700
  },
  items: {
    borderTop: "1px solid #e5e7eb",
    borderBottom: "1px solid #e5e7eb",
    padding: "20px 0",
    marginBottom: 20
  },
  itemRow: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 16
  },
  img: {
    width: 60,
    height: 60,
    objectFit: "contain"
  },
  name: {
    fontWeight: 800,
    color: "#1e293b"
  },
  sub: {
    fontSize: 13,
    color: "#64748b"
  },
  amount: {
    fontWeight: 900
  },
  summary: {
    maxWidth: 360,
    marginLeft: "auto"
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 10
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTop: "2px solid #e5e7eb",
    fontSize: 18,
    fontWeight: 900
  },
  footer: {
    marginTop: 30,
    fontSize: 12,
    color: "#64748b",
    display: "flex",
    alignItems: "center",
    gap: 8
  }
};

export default OrderDetails;
