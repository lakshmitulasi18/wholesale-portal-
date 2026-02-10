import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  PackageCheck,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  LogOut
} from "lucide-react";

/* ===== ADMIN PAGES ===== */
import UserManagement from "./UserManagement";
import SupplierVerification from "./SupplierVerification";
import ProductApproval from "./ProductApproval";
import OrderDisputes from "./OrderDisputes";
import PlatformAnalytics from "./PlatformAnalytics";

const AdminDashboardHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("users");

  const modules = [
    {
      id: "users",
      title: "User Management",
      desc: "Manage buyers, suppliers & admins",
      icon: <Users size={20} />,
      component: <UserManagement />
    },
    {
      id: "suppliers",
      title: "Supplier Verification",
      desc: "Approve or reject suppliers",
      icon: <UserCheck size={20} />,
      component: <SupplierVerification />
    },
    {
      id: "products",
      title: "Product Approval",
      desc: "Approve supplier products",
      icon: <PackageCheck size={20} />,
      component: <ProductApproval />
    },
    {
      id: "disputes",
      title: "Order Disputes",
      desc: "Resolve order conflicts",
      icon: <AlertTriangle size={20} />,
      component: <OrderDisputes />
    },
    {
      id: "analytics",
      title: "Platform Analytics",
      desc: "Sales & performance insights",
      icon: <BarChart3 size={20} />,
      component: <PlatformAnalytics />
    }
  ];

  return (
    <div style={styles.wrapper}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <strong>Admin Dashboard</strong>
        <button style={styles.logout} onClick={() => navigate("/login")}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        {/* LEFT PANEL */}
        <div style={styles.leftPanel}>
          {modules.map((m) => (
            <div
              key={m.id}
              style={{
                ...styles.card,
                background: activeTab === m.id ? "#ecfdf5" : "#fff",
                borderColor: activeTab === m.id ? "#10b981" : "#e5e7eb"
              }}
              onClick={() => setActiveTab(m.id)}
            >
              {m.icon}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: 0 }}>{m.title}</h4>
                <small>{m.desc}</small>
              </div>
              <ChevronRight size={18} />
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          {modules.find((m) => m.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
};

/* ===== SAME STYLES AS SUPPLIER ===== */
const styles = {
  wrapper: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    fontFamily: "sans-serif"
  },
  topBar: {
    height: "60px",
    background: "#047857",
    color: "#fff",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  logout: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    gap: "6px",
    alignItems: "center"
  },
  body: {
    flex: 1,
    display: "flex",
    background: "#f9fafb"
  },
  leftPanel: {
    width: "350px",
    padding: "20px",
    borderRight: "1px solid #e5e7eb",
    background: "#fff"
  },
  card: {
    display: "flex",
    gap: "12px",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid",
    cursor: "pointer",
    marginBottom: "10px",
    alignItems: "center"
  },
  content: {
    flex: 1,
    padding: "30px",
    overflowY: "auto"
  }
};

export default AdminDashboardHub;
