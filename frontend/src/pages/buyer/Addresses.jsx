import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Plus, Trash2, Phone, ArrowLeft, X, Home } from "lucide-react";

const Addresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    doorNumber: "",
    address: "",
    city: "",
    pin: "",
    phone: ""
  });

  useEffect(() => {
    fetch("http://127.0.0.1:5050/api/addresses")
      .then(res => res.json())
      .then(data => setAddresses(data))
      .catch(err => console.log(err));
  }, []);

  const handleSave = () => {
    if (Object.values(formData).some(val => val.trim() === "")) {
      alert("All fields are mandatory.");
      return;
    }
    if (formData.pin.length !== 6) {
      alert("Pincode must be 6 digits.");
      return;
    }
    if (formData.phone.length !== 10) {
      alert("Mobile number must be 10 digits.");
      return;
    }

    fetch("http://127.0.0.1:5050/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => fetch("http://127.0.0.1:5050/api/addresses"))
      .then(res => res.json())
      .then(data => {
        setAddresses(data);
        setShowAddModal(false);
        setFormData({ doorNumber: "", address: "", city: "", pin: "", phone: "" });
      });
  };

  const deleteAddress = (id) => {
    fetch(`http://127.0.0.1:5050/api/addresses/${id}`, { method: "DELETE" })
      .then(() => setAddresses(addresses.filter(addr => addr.id !== id)));
  };

  const handleDoorNumberChange = (e) => {
    const val = e.target.value.replace(/[a-zA-Z]/g, "");
    setFormData({ ...formData, doorNumber: val });
  };

  const handleNumericInput = (field, value, max) => {
    const val = value.replace(/\D/g, "").slice(0, max);
    setFormData({ ...formData, [field]: val });
  };

  return (
    <div style={styles.fullScreenFixed}>
      <div style={styles.overlayGradient}>
        <header style={styles.glassHeader}>
          <div style={styles.logoGroup}>
            <MapPin size={24} color="#fff" />
            <span style={styles.brandText}>WHOLESALE PORTAL</span>
          </div>
          <button onClick={() => navigate("/buyer/checkout")} style={styles.navBtn}>Go to Checkout</button>
        </header>

        <main style={styles.contentArea}>
          <div style={styles.headerRow}>
            <div>
              <button onClick={() => navigate(-1)} style={styles.backBtn}><ArrowLeft size={18} /> Back</button>
              <h1 style={styles.mainTitle}>Shipping Locations</h1>
            </div>
            <button style={styles.addBtn} onClick={() => setShowAddModal(true)}><Plus size={20} /> Add New Address</button>
          </div>

          <div style={styles.addressGrid}>
            {addresses.map((addr) => (
              <div key={addr.id} style={styles.addressCard}>
                <div style={styles.cardTop}>
                  <div style={styles.locationTag}><Home size={16}/> Door {addr.doorNumber}</div>
                </div>
                <p style={styles.addrText}>{addr.address}</p>
                <p style={styles.addrText}>{addr.city} - {addr.pin}</p>
                <div style={styles.contactLine}><Phone size={14} /> +91 {addr.phone}</div>
                <div style={styles.cardActions}>
                  <button onClick={() => deleteAddress(addr.id)} style={styles.deleteBtn}><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        </main>

        {showAddModal && (
          <div style={styles.modalBackdrop}>
            <div style={styles.modalContainer}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Add Shipping Location</h2>
                <button onClick={() => setShowAddModal(false)} style={styles.closeBtn}><X /></button>
              </div>
              <div style={styles.formBody}>
                <div>
                  <label style={styles.label}>Door Number *</label>
                  <input style={styles.input} value={formData.doorNumber} onChange={handleDoorNumberChange} />
                </div>
                <div>
                  <label style={styles.label}>Street Address *</label>
                  <input style={styles.input} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
                </div>
                <div style={styles.inputRow}>
                  <div style={{flex: 1}}>
                    <label style={styles.label}>City *</label>
                    <input style={styles.input} value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                  </div>
                  <div style={{flex: 1}}>
                    <label style={styles.label}>Pincode *</label>
                    <input style={styles.input} value={formData.pin} onChange={(e) => handleNumericInput("pin", e.target.value, 6)} />
                  </div>
                </div>
                <div>
                  <label style={styles.label}>Mobile Number *</label>
                  <input style={styles.input} value={formData.phone} onChange={(e) => handleNumericInput("phone", e.target.value, 10)} />
                </div>
                <button style={styles.saveBtn} onClick={handleSave}>Save Address</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  fullScreenFixed: { position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 9999, overflowY: "auto", fontFamily: "sans-serif" },
  overlayGradient: { minHeight: "100%", background: "linear-gradient(135deg, #f472b6, #a78bfa)", paddingBottom: "50px" },
  glassHeader: { background: "rgba(255, 255, 255, 0.2)", padding: "15px 5%", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brandText: { color: "#fff", fontWeight: "900", marginLeft: "10px" },
  logoGroup: { display: "flex", alignItems: "center" },
  navBtn: { background: "white", color: "#a78bfa", border: "none", padding: "8px 15px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" },
  contentArea: { padding: "40px 5%" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", color: "#fff" },
  mainTitle: { fontSize: "3rem", fontWeight: "900", margin: 0 },
  backBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", marginBottom: "10px" },
  addBtn: { background: "#fff", color: "#a78bfa", border: "none", padding: "14px 25px", borderRadius: "15px", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" },
  addressGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "25px" },
  addressCard: { background: "rgba(255, 255, 255, 0.15)", backdropFilter: "blur(12px)", borderRadius: "25px", padding: "20px", color: "#fff" },
  cardTop: { display: "flex", justifyContent: "space-between", marginBottom: "15px" },
  locationTag: { background: "rgba(255,255,255,0.2)", padding: "4px 10px", borderRadius: "8px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: "5px" },
  addrText: { margin: "2px 0", opacity: 0.9 },
  contactLine: { marginTop: "15px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" },
  cardActions: { marginTop: "15px", display: "flex", justifyContent: "flex-end" },
  deleteBtn: { background: "none", border: "none", color: "#fff", cursor: "pointer", opacity: 0.7 },
  modalBackdrop: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 10000 },
  modalContainer: { background: "#fff", width: "90%", maxWidth: "420px", borderRadius: "25px", padding: "25px" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" },
  modalTitle: { fontSize: "1.2rem", color: "#333", margin: 0, fontWeight: "bold" },
  closeBtn: { background: "none", border: "none", cursor: "pointer", color: "#999" },
  formBody: { display: "flex", flexDirection: "column", gap: "12px" },
  label: { fontSize: "0.85rem", fontWeight: "bold", color: "#555", marginBottom: "5px", display: "block" },
  input: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd", fontSize: "0.95rem", width: "100%", boxSizing: "border-box" },
  inputRow: { display: "flex", gap: "15px" },
  saveBtn: { background: "#a78bfa", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }
};

export default Addresses;