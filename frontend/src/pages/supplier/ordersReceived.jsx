import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ShoppingCart, Search, 
  CheckCircle, Truck, Clock, Eye, X 
} from "lucide-react";

const OrdersReceived = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // UPDATED ORDERS LIST (All products from inventory added)
  const orders = [
    { 
      id: "ORD-9910",
      buyer: "Sri Lakshmi Traders",
      items: "Iodized Salt (50kg x10), Premium Toor Dal (30kg x5), Red Chilli Powder (5kg x3)",
      date: "2026-01-20",
      status: "Processing",
      total: 12500
    },
    { 
      id: "ORD-9911",
      buyer: "RK Wholesale Store",
      items: "Sunflower Oil (15L x8), Turmeric (10kg x4), Raw Rice (5kg x6)",
      date: "2026-01-21",
      status: "Shipped",
      total: 8400
    },
    { 
      id: "ORD-9912",
      buyer: "Siva General Stores",
      items: "Wheat (5kg x20), Wheat Atta (10kg x15), Maida Flour (10kg x10)",
      date: "2026-01-21",
      status: "Pending",
      total: 45000
    },
    { 
      id: "ORD-9913",
      buyer: "Venkata Kirana",
      items: "Organic Rice (5kg x5), Organic Toor Dal (5kg x5)",
      date: "2026-01-21",
      status: "Delivered",
      total: 3200
    }
  ];

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    order.buyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <ShoppingCart size={22} color="#347d73" />
          <h2 style={styles.headerTitle}>Orders Received</h2>
        </div>
        
        <div style={styles.searchBox}>
          <Search size={16} color="#64748b" />
          <input 
            placeholder="Search Order ID..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order ID</th>
              <th style={styles.th}>Buyer Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Total Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} style={styles.tr}>
                <td style={styles.tdId}>{order.id}</td>
                <td style={styles.tdBuyer}>{order.buyer}</td>
                <td style={styles.td}>{order.date}</td>
                <td style={styles.tdAmount}>₹{order.total.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: order.status === "Delivered" ? "#dcfce7" : order.status === "Shipped" ? "#e0f2fe" : "#fef3c7",
                    color: order.status === "Delivered" ? "#166534" : order.status === "Shipped" ? "#0369a1" : "#92400e"
                  }}>
                    {order.status === "Delivered" ? <CheckCircle size={12} /> : order.status === "Shipped" ? <Truck size={12} /> : <Clock size={12} />}
                    {order.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.viewBtn} onClick={() => setSelectedOrder(order)}>
                    <Eye size={14} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3>Order Details: {selectedOrder.id}</h3>
              <button style={styles.closeBtn} onClick={() => setSelectedOrder(null)}>
                <X size={20}/>
              </button>
            </div>
            <div style={styles.modalBody}>
              <p><strong>Buyer:</strong> {selectedOrder.buyer}</p>
              <p><strong>Date:</strong> {selectedOrder.date}</p>
              <p><strong>Items List:</strong> {selectedOrder.items}</p>
              <p><strong>Grand Total:</strong> ₹{selectedOrder.total.toLocaleString()}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
            </div>
            <button style={styles.printBtn} onClick={() => window.print()}>
              Print Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* STYLES */
const styles = {
  container: { height: '100%', width: '100%', display: 'flex', flexDirection: 'column', background: '#fcf6f1', overflow: 'hidden', position: 'relative' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', marginBottom: '20px' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerTitle: { fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 },
  backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
  searchBox: { display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0 12px', gap: '8px', width: '250px' },
  searchInput: { border: 'none', outline: 'none', padding: '8px 0', fontSize: '14px', width: '100%' },
  tableWrapper: { flex: 1, background: '#fff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '16px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px', fontSize: '14px', color: '#334155' },
  tdId: { padding: '16px', fontWeight: 'bold', color: '#347d73' },
  tdBuyer: { padding: '16px', fontWeight: 'bold', color: '#1e293b' },
  tdAmount: { padding: '16px', fontWeight: '800', color: '#1e293b' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' },
  viewBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: '#347d73', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: "12px", fontWeight: "700" },

  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modal: { background: '#fff', padding: '30px', borderRadius: '16px', width: '450px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', marginBottom: '20px' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  modalBody: { lineHeight: '2', color: '#334155' },
  printBtn: { width: '100%', marginTop: '20px', padding: '12px', background: '#347d73', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }
};

export default OrdersReceived;
