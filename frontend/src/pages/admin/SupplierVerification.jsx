import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search,
  Truck,
  Clock,
  Shield,
  Eye,
  CheckCircle,
  XCircle,
  FileText
} from "lucide-react";

const API = "http://127.0.0.1:5050/api/admin";

const SupplierVerification = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewSupplier, setViewSupplier] = useState(null);
  const [viewDocs, setViewDocs] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = () => {
    setLoading(true);
    axios.get(`${API}/suppliers`)
      .then(res => setSuppliers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleApprove = (id) => {
    axios.put(`${API}/suppliers/approve/${id}`)
      .then(fetchSuppliers)
      .catch(err => console.error(err));
  };

  const handleReject = (id) => {
    axios.put(`${API}/suppliers/reject/${id}`)
      .then(fetchSuppliers)
      .catch(err => console.error(err));
  };

  // ✅ FIXED FILTER LOGIC
  const filteredSuppliers = suppliers.filter((s) =>
    (s.company_name || "").toLowerCase().includes(search.toLowerCase()) &&
    (
      statusFilter === "All" ||
      (statusFilter === "Approved" && s.verified === "Yes") ||
      (statusFilter === "Pending" && s.verified === "No") ||
      (statusFilter === "Rejected" && s.status === "Blocked")
    )
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Supplier Verification</h1>
      <p style={styles.subtitle}>Review and approve supplier registrations</p>

      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <Search size={18} />
          <input
            placeholder="Search by company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Rejected</option>
        </select>
      </div>

      <div style={styles.stats}>
        <Stat icon={<Truck />} label="Total Suppliers" value={suppliers.length} />
        <Stat icon={<Shield />} label="Approved" value={suppliers.filter(s => s.verified === "Yes").length} />
        <Stat icon={<Clock />} label="Pending" value={suppliers.filter(s => s.verified === "No").length} />
      </div>

      {loading && <p>Loading suppliers...</p>}

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Company</th>
              <th>Owner</th>
              <th>Email</th>
              <th>Status</th>
              <th>Verified</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSuppliers.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.company_name ? s.company_name : "N/A"}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td><span style={statusStyle(s.status)}>{s.status}</span></td>
                <td>{s.verified}</td>
                <td style={{ textAlign: "right" }}>
                  <IconBtn onClick={() => setViewSupplier(s)}><Eye size={16} /></IconBtn>
                  <IconBtn onClick={() => setViewDocs(s)}><FileText size={16} /></IconBtn>

                  {s.verified !== "Yes" && (
                    <>
                      <IconBtn approve onClick={() => handleApprove(s.id)}>
                        <CheckCircle size={16} />
                      </IconBtn>
                      <IconBtn danger onClick={() => handleReject(s.id)}>
                        <XCircle size={16} />
                      </IconBtn>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewSupplier && (
        <Modal onClose={() => setViewSupplier(null)} title="Supplier Details">
          <p><b>Company:</b> {viewSupplier.company_name}</p>
          <p><b>Owner:</b> {viewSupplier.name}</p>
          <p><b>Email:</b> {viewSupplier.email}</p>
        </Modal>
      )}

      {viewDocs && (
        <Modal onClose={() => setViewDocs(null)} title="Supplier Documents">
          <p>📄 GST Certificate</p>
          <p>📄 Business License</p>
          <p>📄 ID Proof</p>
        </Modal>
      )}
    </div>
  );
};

const Stat = ({ icon, label, value }) => (
  <div style={styles.statCard}>
    <div style={styles.statIcon}>{icon}</div>
    <div>
      <div style={styles.statValue}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
    </div>
  </div>
);

const IconBtn = ({ children, danger, approve, onClick }) => (
  <button onClick={onClick} style={{
    ...styles.iconBtn,
    color: danger ? "#dc2626" : approve ? "#16a34a" : "#374151"
  }}>
    {children}
  </button>
);

const Modal = ({ title, children, onClose }) => (
  <div style={styles.modal}>
    <div style={styles.modalBox}>
      <h3>{title}</h3>
      {children}
      <button onClick={onClose} style={styles.closeBtn}>Close</button>
    </div>
  </div>
);

const styles = {
  page: { background: "#f9fafb", padding: 30 },
  title: { fontSize: 28, fontWeight: 700 },
  subtitle: { color: "#6b7280", marginBottom: 20 },
  filters: { display: "flex", gap: 10, marginBottom: 20 },
  searchBox: { display: "flex", alignItems: "center", gap: 8, border: "1px solid #d1d5db", borderRadius: 6, padding: "6px 10px", background: "#fff" },
  searchInput: { border: "none", outline: "none" },
  stats: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 25 },
  statCard: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: 16, display: "flex", gap: 14, alignItems: "center" },
  statIcon: { background: "#e0f2fe", padding: 10, borderRadius: 8 },
  statValue: { fontSize: 22, fontWeight: 700 },
  statLabel: { fontSize: 14, color: "#6b7280" },
  tableWrap: { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  iconBtn: { border: "1px solid #e5e7eb", background: "#fff", padding: "4px 6px", borderRadius: 6, marginLeft: 6, cursor: "pointer" },
  modal: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center" },
  modalBox: { background: "#fff", padding: 20, borderRadius: 10, width: 380 },
  closeBtn: { marginTop: 15, padding: "6px 12px", borderRadius: 6 }
};

const statusStyle = (status) => ({
  padding: "4px 10px",
  borderRadius: 999,
  fontSize: 12,
  background:
    status === "Approved" ? "#dcfce7" :
    status === "Pending" ? "#fef3c7" : "#fee2e2"
});

export default SupplierVerification;
