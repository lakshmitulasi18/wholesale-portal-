import React, { useEffect, useState } from "react";
import { Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const API = "http://127.0.0.1:5050/api/disputes";

const OrderDisputes = () => {
  const [disputes, setDisputes] = useState([]);

  // ================= LOAD FROM BACKEND =================
  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setDisputes(data))
      .catch(err => console.log(err));
  }, []);

  /* ================= ACTIONS ================= */

  const viewDispute = (d) => {
    alert(
      `DISPUTE DETAILS\n\nDispute ID: ${d.id}\nOrder ID: ${d.orderId}\nBuyer: ${d.buyer}\nSupplier: ${d.supplier}\nIssue: ${d.issue}\nAmount: ₹${d.amount}\nStatus: ${d.status}`
    );
  };

  const resolveDispute = async (id) => {
    await fetch(`${API}/resolve/${id}`, {
      method: "PUT"
    });

    setDisputes(
      disputes.map((d) =>
        d.id === id ? { ...d, status: "Resolved" } : d
      )
    );

    alert("Dispute resolved successfully");
  };

  const rejectDispute = async (id) => {
    await fetch(`${API}/reject/${id}`, {
      method: "PUT"
    });

    setDisputes(
      disputes.map((d) =>
        d.id === id ? { ...d, status: "Rejected" } : d
      )
    );

    alert("Dispute rejected");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #f472b6, #a78bfa, #f472b6)",
        padding: "90px 20px"
      }}
    >
      <h1 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "6px" }}>
        Order Disputes
      </h1>
      <p style={{ color: "#334155", marginBottom: "25px" }}>
        Review and resolve buyer order disputes
      </p>

      {/* DISPUTE CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "18px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        {disputes.map((d) => (
          <div
            key={d.id}
            style={{
              background: "#fff",
              borderRadius: "16px",
              padding: "18px",
              boxShadow: "0 8px 15px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              position: "relative"
            }}
          >
            {/* STATUS BADGE */}
            <span
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                padding: "4px 10px",
                borderRadius: "20px",
                fontSize: "11px",
                fontWeight: "700",
                background:
                  d.status === "Resolved"
                    ? "#dcfce7"
                    : d.status === "Open"
                    ? "#fef3c7"
                    : "#fee2e2",
                color:
                  d.status === "Resolved"
                    ? "#166534"
                    : d.status === "Open"
                    ? "#92400e"
                    : "#991b1b"
              }}
            >
              {d.status}
            </span>

            <div style={{ marginBottom: "10px" }}>
              <h3 style={{ fontSize: "15px", fontWeight: "800" }}>
                Order #{d.orderId}
              </h3>
              <p style={{ fontSize: "12px", color: "#64748b" }}>
                Dispute ID: {d.id}
              </p>
            </div>

            <div style={{ fontSize: "13px", marginBottom: "6px" }}>
              <b>Buyer:</b> {d.buyer}
            </div>
            <div style={{ fontSize: "13px", marginBottom: "6px" }}>
              <b>Supplier:</b> {d.supplier}
            </div>

            <div
              style={{
                background: "#fef2f2",
                padding: "10px",
                borderRadius: "10px",
                fontSize: "13px",
                color: "#7f1d1d",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                marginBottom: "10px"
              }}
            >
              <AlertTriangle size={16} />
              {d.issue}
            </div>

            <div style={{ fontWeight: "800", marginBottom: "12px" }}>
              Amount: ₹{Number(d.amount).toLocaleString()}
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: "flex", gap: "8px" }}>
              <ActionBtn
                bg="#e0f2fe"
                color="#0284c7"
                onClick={() => viewDispute(d)}
              >
                <Eye size={16} />
              </ActionBtn>

              {d.status === "Open" && (
                <>
                  <ActionBtn
                    bg="#dcfce7"
                    color="#16a34a"
                    onClick={() => resolveDispute(d.id)}
                  >
                    <CheckCircle size={16} />
                  </ActionBtn>

                  <ActionBtn
                    bg="#fee2e2"
                    color="#dc2626"
                    onClick={() => rejectDispute(d.id)}
                  >
                    <XCircle size={16} />
                  </ActionBtn>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ActionBtn = ({ children, bg, color, onClick }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "10px",
      border: "none",
      background: bg,
      color: color,
      cursor: "pointer",
      fontWeight: "700"
    }}
  >
    {children}
  </button>
);

export default OrderDisputes;
