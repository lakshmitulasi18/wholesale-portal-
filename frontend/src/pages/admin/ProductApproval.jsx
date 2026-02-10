import React, { useState, useEffect } from "react";
import { Eye, CheckCircle, XCircle, Search } from "lucide-react";
import axios from "axios";

const PAGE_SIZE = 6;
const API = "http://127.0.0.1:5050/api/admin/products"; // ✅ exact backend URL

const AdminProductApproval = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewProduct, setViewProduct] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✅ GET PRODUCTS FROM BACKEND
  const fetchProducts = () => {
    axios.get(API) // ❌ remove trailing slash
      .then(res => {
        console.log("Products from backend:", res.data); // 👈 debug
        setProducts(res.data);
      })
      .catch(err => console.error("Error fetching products:", err));
  };

  // ✅ APPROVE PRODUCT
  const approveProduct = (id) => {
    axios.put(`${API}/approve/${id}`)
      .then(fetchProducts)
      .catch(err => console.error("Error approving:", err));
  };

  // ✅ REJECT PRODUCT
  const rejectProduct = (id) => {
    axios.put(`${API}/reject/${id}`)
      .then(fetchProducts)
      .catch(err => console.error("Error rejecting:", err));
  };

  // 🔍 FILTER
  const filteredProducts = products.filter((p) =>
    (p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.supplier?.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "All" || p.status === statusFilter)
  );

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Product Approval</h1>
      <p style={styles.subtitle}>Review & approve supplier product listings</p>

      <div style={styles.filters}>
        <div style={styles.searchBox}>
          <Search size={16} />
          <input
            placeholder="Search product or supplier..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Approved</option>
          <option>Pending</option>
          <option>Rejected</option>
        </select>
      </div>

      <div style={styles.grid}>
        {paginatedProducts.map((p) => (
          <div key={p.id} style={styles.card}>
            <span style={statusBadge(p.status)}>{p.status}</span>

            {/* ✅ Correct backend field */}
            <img src={p.image_url} alt={p.name} style={styles.image} />

            <h3 style={styles.name}>{p.name}</h3>
            <small>Supplier: <b>{p.supplier || "Unknown"}</b></small>
            <div>⭐ {p.rating || 0}</div>
            <div style={styles.price}>₹{p.price}</div>
            <div style={styles.date}>Added: {p.date}</div>

            <div style={styles.actions}>
              <ActionBtn bg="#e0f2fe" color="#0284c7" onClick={() => setViewProduct(p)}>
                <Eye size={16} />
              </ActionBtn>

              {p.status === "Pending" && (
                <>
                  <ActionBtn bg="#dcfce7" color="#16a34a" onClick={() => approveProduct(p.id)}>
                    <CheckCircle size={16} />
                  </ActionBtn>
                  <ActionBtn bg="#fee2e2" color="#dc2626" onClick={() => rejectProduct(p.id)}>
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
  <button onClick={onClick} style={{ ...styles.btn, background: bg, color }}>
    {children}
  </button>
);

const statusBadge = (status) => ({
  position: "absolute",
  top: 10,
  left: 10,
  padding: "4px 10px",
  borderRadius: 20,
  fontSize: 11,
  fontWeight: 700,
  background:
    status === "Approved"
      ? "#dcfce7"
      : status === "Pending"
      ? "#fef3c7"
      : "#fee2e2"
});

const styles = {
  page: { padding: 40 },
  title: { fontSize: 28, fontWeight: 900 },
  subtitle: { marginBottom: 20 },
  filters: { display: "flex", gap: 10, marginBottom: 20 },
  searchBox: { display: "flex", gap: 6, background: "#fff", padding: "6px 10px", borderRadius: 8 },
  searchInput: { border: "none", outline: "none" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(245px, 1fr))", gap: 15 },
  card: { background: "#fff", padding: 15, borderRadius: 15, position: "relative" },
  image: { width: "100%", height: 160, objectFit: "contain" },
  name: { fontSize: 15, fontWeight: 700 },
  price: { fontWeight: 900, fontSize: 18 },
  date: { fontSize: 11, color: "#64748b" },
  actions: { display: "flex", gap: 8, marginTop: 10 },
  btn: { flex: 1, padding: 10, borderRadius: 10, border: "none", cursor: "pointer", fontWeight: 700 }
};

export default AdminProductApproval;