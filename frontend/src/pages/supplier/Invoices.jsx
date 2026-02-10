import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, FileText, Download, 
  Search, CheckCircle, Clock 
} from "lucide-react";

const Invoices = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const invoices = [
    { id: "INV-8821", buyer: "Sri Lakshmi Traders", date: "2026-01-15", amount: 45000, status: "Paid" },
    { id: "INV-8822", buyer: "RK Wholesale Store", date: "2026-01-18", amount: 12500, status: "Pending" },
    { id: "INV-8823", buyer: "Siva General Stores", date: "2026-01-20", amount: 89000, status: "Paid" },
    { id: "INV-8824", buyer: "Venkata Kirana", date: "2026-01-21", amount: 5500, status: "Pending" }
  ];

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    inv.buyer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadPDF = (invoice) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Invoice - ${invoice.id}</title></head>
        <body style="font-family: sans-serif; padding: 40px;">
          <h1 style="color: #347d73;">Wholesale Portal Invoice</h1>
          <hr/>
          <p><strong>Invoice ID:</strong> ${invoice.id}</p>
          <p><strong>Buyer:</strong> ${invoice.buyer}</p>
          <p><strong>Date:</strong> ${invoice.date}</p>
          <p><strong>Amount:</strong> ₹${invoice.amount.toLocaleString()}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
          <br/><br/>
          <p><em>Thank you for your business!</em></p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
          </button>
          <FileText size={22} color="#347d73" />
          <h2 style={styles.headerTitle}>Billing & Invoices</h2>
        </div>
        
        <div style={styles.searchBox}>
          <Search size={16} color="#64748b" />
          <input 
            placeholder="Search Invoice or Buyer..." 
            style={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* INVOICE TABLE */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Invoice ID</th>
              <th style={styles.th}>Buyer Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.map((inv) => (
              <tr key={inv.id} style={styles.tr}>
                <td style={styles.tdId}>{inv.id}</td>
                <td style={styles.tdBuyer}>{inv.buyer}</td>
                <td style={styles.td}>{inv.date}</td>
                <td style={styles.tdAmount}>₹{inv.amount.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: inv.status === "Paid" ? "#dcfce7" : "#fef3c7",
                    color: inv.status === "Paid" ? "#166534" : "#92400e"
                  }}>
                    {inv.status === "Paid" ? <CheckCircle size={12} /> : <Clock size={12} />}
                    {inv.status}
                  </span>
                </td>
                <td style={styles.td}>
                  <button style={styles.downloadBtn} onClick={() => handleDownloadPDF(inv)}>
                    <Download size={14} /> PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredInvoices.length === 0 && (
          <div style={styles.noData}>No invoices found.</div>
        )}
      </div>
    </div>
  );
};

/* --- CLEAN STYLES (No Overlapping) --- */
const styles = {
  container: { 
    height: '100%', 
    width: '100%', 
    display: 'flex', 
    flexDirection: 'column', 
    background: '#fcf6f1', 
    overflow: 'hidden',
    position: 'relative' // అక్షరాలు వెనక్కి వెళ్లకుండా చూస్తుంది
  },
  header: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '10px 0',
    marginBottom: '20px'
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  headerTitle: { fontSize: '20px', fontWeight: '800', color: '#1e293b', margin: 0 },
  backBtn: { background: '#fff', border: '1px solid #e2e8f0', padding: '8px', borderRadius: '8px', cursor: 'pointer' },
  searchBox: { 
    display: 'flex', 
    alignItems: 'center', 
    background: '#fff', 
    border: '1px solid #e2e8f0', 
    borderRadius: '8px', 
    padding: '0 12px', 
    gap: '8px',
    width: '280px'
  },
  searchInput: { border: 'none', outline: 'none', padding: '8px 0', fontSize: '14px', width: '100%' },
  tableWrapper: { 
    flex: 1, 
    background: '#fff', 
    borderRadius: '12px', 
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
    overflowY: 'auto' // కేవలం టేబుల్ మాత్రమే స్క్రోల్ అవుతుంది
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { textAlign: 'left', padding: '16px', background: '#f8fafc', borderBottom: '2px solid #e2e8f0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase' },
  tr: { borderBottom: '1px solid #f1f5f9' },
  td: { padding: '16px', fontSize: '14px', color: '#334155' },
  tdId: { padding: '16px', fontWeight: 'bold', color: '#347d73' },
  tdBuyer: { padding: '16px', fontWeight: 'bold', color: '#1e293b' },
  tdAmount: { padding: '16px', fontWeight: '800', color: '#1e293b' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '800', display: 'inline-flex', alignItems: 'center', gap: '5px' },
  downloadBtn: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px', 
    background: '#347d73', 
    color: '#fff', 
    border: 'none', 
    padding: '6px 12px', 
    borderRadius: '6px', 
    cursor: 'pointer', 
    fontSize: "12px", 
    fontWeight: "700" 
  },
  noData: { padding: '40px', textAlign: 'center', color: '#64748b' }
};

export default Invoices;