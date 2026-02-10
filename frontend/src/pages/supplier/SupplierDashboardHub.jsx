import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  ClipboardList,
  ShoppingCart,
  FileText,
  User,
  ChevronRight,
  LogOut
} from "lucide-react";

import SupplierProducts from "./products";
import Inventory from "./Inventory";
import OrdersReceived from "./ordersReceived";
import Invoices from "./Invoices";
import Profile from "./Profile";

const SupplierDashboardHub = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");

  const modules = [
    {
      id: "products",
      title: "Products",
      desc: "Manage product listings",
      icon: <Package size={20} />,
      component: <SupplierProducts />
    },
    {
      id: "inventory",
      title: "Inventory",
      desc: "Track stock",
      icon: <ClipboardList size={20} />,
      component: <Inventory />
    },
    {
      id: "orders",
      title: "Orders",
      desc: "Orders received",
      icon: <ShoppingCart size={20} />,
      component: <OrdersReceived />
    },
    {
      id: "invoices",
      title: "Invoices",
      desc: "Billing & invoices",
      icon: <FileText size={20} />,
      component: <Invoices />
    },
    {
      id: "profile",
      title: "Profile",
      desc: "Business info",
      icon: <User size={20} />,
      component: <Profile />
    }
  ];

  return (
    <div style={styles.wrapper}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <strong>Supplier Dashboard</strong>
        <button style={styles.logout} onClick={() => navigate("/login")}>
          <LogOut size={16} /> Logout
        </button>
      </div>

      {/* BODY */}
      <div style={styles.body}>
        {/* MODULE LIST */}
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

export default SupplierDashboardHub;
