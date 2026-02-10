import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const WholesaleBuyerDashboard = () => {
  const navigate = useNavigate();

  // Get name from login session
  const buyerName = sessionStorage.getItem("NAME") || "Buyer";

  const [stats, setStats] = useState({
    total_products: 0,
    total_orders: 0,
    cart_items: 0,
    favorites: 0
  });

  useEffect(() => {
    axios.get("http://127.0.0.1:5050/api/buyer/dashboard")
      .then(res => setStats(res.data))
      .catch(err => console.log("Dashboard API error:", err));
  }, []);

  const dashboardCards = [
    { title: "Product Catalog", desc: `Browse and order inventory (${stats.total_products})`, icon: "📦", path: "/buyer/products", color: "#00c4cc" },
    { title: "Your Orders", desc: `Track and manage bulk orders (${stats.total_orders})`, icon: "📝", path: "/buyer/orders", color: "#ff9f43" },
    { title: "Shopping Cart", desc: `View items ready for checkout (${stats.cart_items})`, icon: "🛒", path: "/buyer/cart", color: "#54a0ff" },
    { title: "Favorites", desc: `Your most ordered products (${stats.favorites})`, icon: "⭐", path: "/buyer/favorites", color: "#5f27cd" },
    { title: "Manage Addresses", desc: "Update warehouse locations", icon: "📍", path: "/buyer/addresses", color: "#ee5253" },
    { title: "Billing & Invoices", desc: "View payment history", icon: "💳", path: "/buyer/checkout", color: "#10ac84" },
  ];

  return (
    <div style={styles.outerWrapper}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.logoIcon}>🏭</div>
          <span style={styles.logoText}>Wholesale Portal | Buyer</span>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.avatarCircle}>{buyerName.charAt(0).toUpperCase()}</div>
          <button style={styles.logoutBtn} onClick={() => {
            sessionStorage.clear();
            navigate("/login");
          }}>Logout</button>
        </div>
      </header>

      <main style={styles.mainContent}>
        <div style={styles.welcomeSection}>
          {/* 🔥 FIXED TITLE */}
          <h1 style={styles.title}>Buyer Dashboard</h1>

          {/* Name only in subtitle */}
          <p style={styles.subtitle}>
            Welcome back, {buyerName}! Manage your procurement and inventory.
          </p>
        </div>

        <div style={styles.cardGrid}>
          {dashboardCards.map((card, index) => (
            <div 
              key={index} 
              style={styles.card} 
              onClick={() => navigate(card.path)}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <div style={{ ...styles.iconBox, backgroundColor: card.color }}>{card.icon}</div>
              <h3 style={styles.cardTitle}>{card.title}</h3>
              <p style={styles.cardDesc}>{card.desc}</p>
              <div style={styles.cardFooter}>
                <span style={styles.badge}>Open Page →</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

/* STYLES EXACT SAME */
const styles = {
  outerWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    minHeight: "100vh",
    background: "#f8fafc",
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "70px",
    background: "#1d7a74",
    padding: "0 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
    zIndex: 2000,
    boxSizing: "border-box",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "12px" },
  logoIcon: { fontSize: "24px" },
  logoText: { fontSize: "20px", fontWeight: "bold" },
  headerRight: { display: "flex", alignItems: "center", gap: "15px" },
  avatarCircle: { width: "36px", height: "36px", borderRadius: "50%", background: "#fff", color: "#1d7a74", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: "bold" },
  logoutBtn: { background: "#ff4757", border: "none", color: "white", padding: "8px 18px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" },
  mainContent: { width: "100%", marginTop: "70px", padding: "40px", boxSizing: "border-box", flex: 1 },
  welcomeSection: { marginBottom: "30px" },
  title: { fontSize: "36px", fontWeight: "800", color: "#1e293b", margin: "0" },
  subtitle: { fontSize: "18px", color: "#64748b", marginTop: "5px" },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px", width: "100%" },
  card: { background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "20px", padding: "30px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "transform 0.2s ease-in-out" },
  iconBox: { width: "55px", height: "55px", borderRadius: "12px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "26px", color: "#fff" },
  cardTitle: { fontSize: "22px", fontWeight: "700", color: "#1e293b", margin: 0 },
  cardDesc: { fontSize: "15px", color: "#475569", lineHeight: "1.5", margin: 0 },
  cardFooter: { marginTop: "10px" },
  badge: { fontSize: "14px", fontWeight: "600", color: "#1d7a74" },
};

export default WholesaleBuyerDashboard;