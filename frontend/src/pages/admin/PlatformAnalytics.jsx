import React, { useEffect, useState } from "react";
import {
  Users,
  Truck,
  ShoppingCart,
  IndianRupee,
  TrendingUp
} from "lucide-react";

const PlatformAnalytics = () => {
  const [data, setData] = useState({
    users: 0,
    suppliers: 0,
    orders: 0,
    revenue: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    disputed: 0
  });

  // 🔥 Fetch analytics from backend
  useEffect(() => {
    fetch("http://127.0.0.1:5050/api/analytics")
      .then(res => res.json())
      .then(res => setData(res))
      .catch(err => console.log("API Error:", err));
  }, []);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Platform Analytics</h1>
      <p style={styles.subtitle}>
        Overall performance & business insights
      </p>

      {/* KPI CARDS */}
      <div style={styles.stats}>
        <Stat icon={<Users />} label="Total Users" value={data.users} />
        <Stat icon={<Truck />} label="Active Suppliers" value={data.suppliers} />
        <Stat icon={<ShoppingCart />} label="Total Orders" value={data.orders} />
        <Stat icon={<IndianRupee />} label="Total Revenue" value={`₹${data.revenue}`} />
      </div>

      {/* SECOND ROW */}
      <div style={styles.grid}>
        {/* ORDER STATUS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Order Status Overview</h3>

          <StatusRow label="Completed Orders" value={data.completed} color="#16a34a" />
          <StatusRow label="Pending Orders" value={data.pending} color="#f59e0b" />
          <StatusRow label="Cancelled Orders" value={data.cancelled} color="#dc2626" />
          <StatusRow label="Disputed Orders" value={data.disputed} color="#7c3aed" />
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const Stat = ({ icon, label, value }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>{icon}</div>
    <div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
      <div style={styles.trend}>
        <TrendingUp size={14} /> Live
      </div>
    </div>
  </div>
);

const StatusRow = ({ label, value, color }) => (
  <div style={styles.statusRow}>
    <span>{label}</span>
    <span style={{ color, fontWeight: "700" }}>{value}</span>
  </div>
);

/* ================= STYLES ================= */

const styles = {
  page: {
    background: "#f9fafb",
    padding: "30px",
    minHeight: "100%"
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "6px"
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: "25px"
  },
  stats: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
    marginBottom: "25px"
  },
  statCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "18px",
    display: "flex",
    gap: "14px",
    alignItems: "center"
  },
  statIcon: {
    background: "#e0f2fe",
    padding: "12px",
    borderRadius: "10px"
  },
  statValue: {
    fontSize: "22px",
    fontWeight: "800"
  },
  statLabel: {
    fontSize: "14px",
    color: "#6b7280"
  },
  trend: {
    fontSize: "12px",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "20px",
    marginBottom: "25px"
  },
  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "20px"
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "12px"
  },
  statusRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9"
  }
};

export default PlatformAnalytics;
