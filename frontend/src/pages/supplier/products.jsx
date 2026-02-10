import React, { useState, useEffect } from "react";
import {
  Package, Plus, Edit2, Trash2,
  ToggleLeft, ToggleRight, Search, X
} from "lucide-react";

const API_URL = "http://localhost:5050/api/products/";

const SupplierProducts = () => {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null); // ⭐ edit mode

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "rice",
    img: ""
  });

  // 🔌 LOAD PRODUCTS
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
        else setProducts([]);
      })
      .catch(() => setProducts([]));
  }, []);

  // ✏️ OPEN EDIT MODAL
  const editProduct = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: (product.category || "rice").toLowerCase(),
      img: product.image_url || ""
    });
    setShowModal(true);
  };

  // 🗑 DELETE
  const deleteProduct = (id) => {
    fetch(`${API_URL}${id}`, { method: "DELETE" })
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
      })
      .catch(() => {});
  };

  // ➕ ADD / ✏️ UPDATE
  const saveProduct = () => {
    if (!form.name || !form.price || !form.stock) return;

    const payload = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock),
      category: form.category.toLowerCase(),
      image_url: form.img || "https://via.placeholder.com/200"
    };

    // UPDATE
    if (editingId) {
      fetch(`${API_URL}${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(() => fetch(API_URL))
        .then(res => res.json())
        .then(data => setProducts(data));
    }
    // ADD NEW
    else {
      fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(() => fetch(API_URL))
        .then(res => res.json())
        .then(data => setProducts(data));
    }

    setEditingId(null);
    setShowModal(false);
    setForm({ name: "", price: "", stock: "", category: "rice", img: "" });
  };

  // 🔥 CATEGORY + SEARCH FILTER (CASE INSENSITIVE)
  const filtered = products.filter(p =>
    (category === "all" ||
      (p.category || "").toLowerCase() === category.toLowerCase()) &&
    (p.name || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <style>{`
        * { box-sizing: border-box; font-family: Inter, sans-serif; }
        .sidebar-item {
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          color: #475569;
          margin-bottom: 6px;
        }
        .sidebar-item.active {
          background: #ecfeff;
          color: #0f766e;
        }
        .product-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          transition: 0.25s ease;
        }
        .product-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.08);
        }
      `}</style>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Package size={18} />
          <span>Product Hub</span>
        </div>
        <button style={styles.addBtn} onClick={() => {
          setEditingId(null);
          setForm({ name: "", price: "", stock: "", category: "rice", img: "" });
          setShowModal(true);
        }}>
          <Plus size={14} /> Add Item
        </button>
      </header>

      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <p style={styles.sideLabel}>Categories</p>
          {["all", "rice", "oil", "spices"].map(c => (
            <div
              key={c}
              className={`sidebar-item ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c.toUpperCase()}
            </div>
          ))}
        </aside>

        {/* MAIN */}
        <main style={styles.mainContent}>
          <div style={styles.searchBox}>
            <Search size={14} />
            <input
              placeholder="Search inventory..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.grid}>
            {filtered.map(p => (
              <div key={p.id} className="product-card">
                <img
                  src={p.image_url || "https://via.placeholder.com/200"}
                  alt={p.name}
                  style={styles.cardImg}
                />
                <h4 style={styles.cardName}>{p.name}</h4>
                <div style={styles.cardPrice}>₹{p.price}</div>

                <div style={{
                  ...styles.stockBadge,
                  background: p.stock > 0 ? "#dcfce7" : "#fee2e2",
                  color: p.stock > 0 ? "#166534" : "#991b1b"
                }}>
                  {p.stock > 0 ? `Stock: ${p.stock}` : "Out of Stock"}
                </div>

                <div style={styles.actions}>
                  <button style={styles.iconBtn} onClick={() => editProduct(p)}>
                    <Edit2 size={14} />
                  </button>

                  <button style={styles.iconBtn}>
                    <ToggleLeft size={16} color="#059669" />
                  </button>

                  <button
                    style={{ ...styles.iconBtn, color: "#ef4444" }}
                    onClick={() => deleteProduct(p.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>{editingId ? "Edit Product" : "Add Product"}</h3>
              <X onClick={() => setShowModal(false)} style={{ cursor: "pointer" }} />
            </div>

            <input placeholder="Product name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />

            <input placeholder="Price" type="number" value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} />

            <input placeholder="Stock" type="number" value={form.stock}
              onChange={e => setForm({ ...form, stock: e.target.value })} />

            <input placeholder="Image URL" value={form.img}
              onChange={e => setForm({ ...form, img: e.target.value })} />

            <select value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}>
              <option value="rice">Rice</option>
              <option value="oil">Oil</option>
              <option value="spices">Spices</option>
            </select>

            <button style={styles.saveBtn} onClick={saveProduct}>
              Save Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------- STYLES ---------- */
const styles = {
  container: { height: "100vh", background: "#f8fafc" },
  header: { height: 52, background: "#0f766e", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px" },
  headerLeft: { display: "flex", gap: 8, fontWeight: "bold" },
  addBtn: { background: "#14b8a6", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 8, cursor: "pointer", display: "flex", gap: 6 },

  layout: { display: "flex", height: "calc(100% - 52px)" },
  sidebar: { width: 220, background: "#fff", borderRight: "1px solid #e2e8f0", padding: 16 },
  sideLabel: { fontSize: 11, fontWeight: "700", color: "#94a3b8", marginBottom: 12 },

  mainContent: { flex: 1, padding: 20, overflowY: "auto" },
  searchBox: { display: "flex", gap: 8, background: "#fff", padding: "8px 10px", width: 260, borderRadius: 10, marginBottom: 20 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 26,
    paddingBottom: 20
  },

  cardImg: { height: 130, objectFit: "contain", background: "#f8fafc", borderRadius: 10, padding: 10, marginBottom: 12 },
  cardName: { fontSize: 14, fontWeight: 700, marginBottom: 6, lineHeight: 1.4 },
  cardPrice: { fontSize: 17, fontWeight: 800, marginBottom: 10 },

  stockBadge: { fontSize: 11, padding: "4px 10px", borderRadius: 6, marginBottom: 12, display: "inline-block" },

  actions: { display: "flex", gap: 10, borderTop: "1px solid #f1f5f9", paddingTop: 12 },
  iconBtn: { flex: 1, border: "1px solid #e2e8f0", background: "#fff", borderRadius: 8, cursor: "pointer" },

  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "#fff", padding: 20, width: 320, display: "flex", flexDirection: "column", gap: 10, borderRadius: 12 },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  saveBtn: { background: "#0f766e", color: "#fff", border: "none", padding: 10, borderRadius: 8 }
};

export default SupplierProducts;
