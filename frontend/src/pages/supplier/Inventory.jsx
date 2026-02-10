import React, { useState, useEffect } from "react";
import { ArrowLeft, Package, AlertTriangle, Download, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5050/api/products/";

const Inventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [inventory, setInventory] = useState([]);

  // 🔥 GET PRODUCTS FROM DB
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          setInventory([]);
        }
      })
      .catch(() => setInventory([]));
  }, []);

  // SEARCH
  const filteredInventory = inventory.filter(item =>
    (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // EXPORT CSV
  const handleExport = () => {
    const csvRows = [
      ["Product Name", "Category", "Stock"],
      ...filteredInventory.map(item => [
        item.name,
        item.category || "N/A",
        item.stock
      ])
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvRows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "inventory_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <Package size={22} color="#347d73" />
          <h2 style={styles.headerTitle}>Inventory Management</h2>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.searchBox}>
            <Search size={16} color="#64748b" />
            <input
              placeholder="Search product..."
              style={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button style={styles.exportBtn} onClick={handleExport}>
            <Download size={16} /> Export
          </button>
        </div>
      </header>

      <div style={styles.mainContent}>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Stock Level</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredInventory.map(item => {
                const isOut = item.stock === 0;
                const isLow = item.stock <= 10 && item.stock > 0;

                return (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.tdName}>{item.name}</td>
                    <td style={styles.td}>{item.category || "N/A"}</td>

                    <td style={{
                      ...styles.td,
                      fontWeight: "bold",
                      color: isOut ? "#dc2626" : isLow ? "#d97706" : "#1e293b"
                    }}>
                      {item.stock}
                      {(isOut || isLow) && (
                        <AlertTriangle size={14} style={{ marginLeft: 5 }} />
                      )}
                    </td>

                    <td style={styles.td}>
                      <span style={{
                        ...styles.badge,
                        backgroundColor: isOut ? "#fee2e2" : isLow ? "#fef3c7" : "#dcfce7",
                        color: isOut ? "#991b1b" : isLow ? "#92400e" : "#166534"
                      }}>
                        {isOut ? "Out of Stock" : isLow ? "Low Stock" : "Healthy"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredInventory.length === 0 && (
            <div style={{ padding: 20, textAlign: "center", color: "#64748b" }}>
              No products found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { height: "100vh", display: "flex", flexDirection: "column", background: "#fcf6f1" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", background: "#fff", borderBottom: "1px solid #e2e8f0" },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: 800, margin: 0 },
  backBtn: { background: "#f8fafc", border: "1px solid #e2e8f0", padding: 8, borderRadius: 8, cursor: "pointer" },
  headerRight: { display: "flex", gap: 12 },
  searchBox: { display: "flex", alignItems: "center", background: "#f1f5f9", borderRadius: 8, padding: "0 12px", gap: 8, width: 250 },
  searchInput: { border: "none", background: "transparent", outline: "none", padding: "10px 0", width: "100%" },
  exportBtn: { background: "#347d73", color: "#fff", border: "none", padding: "10px 20px", borderRadius: 8, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 },
  mainContent: { flex: 1, padding: "30px 40px", overflowY: "auto" },
  tableWrapper: { background: "#fff", borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: 16, background: "#f8fafc", borderBottom: "2px solid #e2e8f0", fontSize: 12, color: "#64748b" },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: 16, fontSize: 14 },
  tdName: { padding: 16, fontWeight: "bold" },
  badge: { padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 800 }
};

export default Inventory;
