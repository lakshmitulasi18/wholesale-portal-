import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCcw, ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const { addItem, cartItems } = useCart();

  useEffect(() => {
    const userId = sessionStorage.getItem("USER_ID");

    fetch(`http://127.0.0.1:5050/api/orders/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Orders:", data);
        setOrders(data);
      })
      .catch(err => console.error("Error fetching orders:", err));
  }, []);

  const latestOrders = orders.slice(0, 5);

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.glassHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate(-1)} style={styles.backBtn}>
            <ArrowLeft size={20} color="#1e293b" />
          </button>
          <div style={styles.logoText}>
            WholeSale <span style={{ color: "#f472b6" }}>Portal</span>
          </div>
        </div>

        <div style={styles.navLinks}>
          <button onClick={() => navigate("/")} style={styles.navLinkBtn}>Home</button>
          <button onClick={() => navigate("/buyer/products")} style={styles.navLinkBtn}>Catalog</button>
          <div style={styles.cartBadge} onClick={() => navigate("/buyer/cart")}>
            🛒 Cart ({cartItems.length})
          </div>
        </div>
      </header>

      <div style={styles.scrollArea}>
        <h1 style={styles.pageTitle}>Your Orders</h1>

        <div style={styles.searchContainer}>
          <Search size={20} color="#64748b" />
          <input
            placeholder="Search all orders..."
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button style={styles.searchBtn}>Search Orders</button>
        </div>

        {latestOrders.length === 0 && (
          <p style={{ color: "white", fontWeight: "bold" }}>No orders yet.</p>
        )}

        {latestOrders.map((order) => (
          <div key={order.order_id} style={styles.orderCard}>
            <div style={styles.orderCardHeader}>
              <div style={styles.headerInfoGroup}>
                <div style={styles.infoCol}>
                  <span style={styles.label}>ORDER PLACED</span>
                  <span style={styles.value}>Recently</span>
                </div>
                <div style={styles.infoCol}>
                  <span style={styles.label}>TOTAL</span>
                  <span style={styles.value}>₹ {order.total}</span>
                </div>
                <div style={styles.infoCol}>
                  <span style={styles.label}>STATUS</span>
                  <span style={styles.value}>{order.status}</span>
                </div>
              </div>
              <div style={styles.headerRight}>
                <span style={styles.label}>ORDER # {order.order_id}</span>
              </div>
            </div>

            <div style={styles.orderBody}>
              <div style={styles.bodyLeft}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={styles.itemRow}>
                    <img
                      src={item.image_url || "https://via.placeholder.com/100"}
                      alt={item.name}
                      style={styles.itemImg}
                    />
                    <div style={styles.itemDetails}>
                      <span style={styles.itemName}>{item.name}</span>
                      <span style={styles.returnText}>Qty: {item.qty}</span>
                      <button
                        style={styles.buyAgainBtn}
                        onClick={() =>
                          addItem({
                            id: idx,
                            name: item.name,
                            price: item.price,
                            img: item.image_url || "https://via.placeholder.com/100",
                          })
                        }
                      >
                        <RefreshCcw size={14} /> Buy it again
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    height: "100vh",
    width: "100%",
    background: "linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #f472b6 100%)",
    display: "flex",
    flexDirection: "column"
  },
  glassHeader: {
    height: "80px",
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
    padding: "0 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 15px rgba(0,0,0,0.1)"
  },
  scrollArea: { flex: 1, overflowY: "auto", padding: "40px" },
  logoText: { fontSize: "24px", fontWeight: "900", color: "#1e293b" },
  backBtn: { background: "#f1f5f9", border: "none", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" },
  navLinks: { display: "flex", gap: "20px", alignItems: "center" },
  navLinkBtn: { background: "none", border: "none", color: "#475569", fontWeight: "700", cursor: "pointer" },
  cartBadge: { background: "#a78bfa", color: "#fff", padding: "8px 18px", borderRadius: "50px", fontWeight: "800", cursor: "pointer" },
  pageTitle: { color: "#fff", fontSize: "32px", fontWeight: "900", marginBottom: "25px" },
  searchContainer: { display: "flex", background: "#fff", padding: "12px 20px", borderRadius: "12px", marginBottom: "30px", gap: "15px", alignItems: "center" },
  searchInput: { flex: 1, border: "none", outline: "none", fontSize: "16px" },
  searchBtn: { background: "#334155", color: "#fff", border: "none", padding: "10px 25px", borderRadius: "25px", fontWeight: "700", cursor: "pointer" },
  orderCard: { background: "#fff", borderRadius: "12px", marginBottom: "30px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  orderCardHeader: { background: "#f8fafc", padding: "20px 30px", display: "flex", justifyContent: "space-between", borderBottom: "1px solid #edf2f7" },
  headerInfoGroup: { display: "flex", gap: "60px" },
  infoCol: { display: "flex", flexDirection: "column" },
  label: { fontSize: "11px", color: "#64748b", fontWeight: "700" },
  value: { fontSize: "14px", color: "#1e293b", fontWeight: "600", marginTop: "3px" },
  headerRight: { textAlign: "right" },
  orderBody: { padding: "30px" },
  itemRow: { display: "flex", gap: "20px", marginBottom: "25px" },
  itemImg: { width: "100px", height: "100px", objectFit: "contain" },
  itemDetails: { flex: 1, display: "flex", flexDirection: "column", gap: "5px" },
  itemName: { color: "#1e40af", fontWeight: "800", fontSize: "16px" },
  returnText: { fontSize: "13px", color: "#64748b" },
  buyAgainBtn: { display: "flex", alignItems: "center", gap: "8px", background: "#fbbf24", border: "none", padding: "8px 20px", borderRadius: "50px", fontWeight: "800", marginTop: "10px", cursor: "pointer" }
};

export default OrdersPage;