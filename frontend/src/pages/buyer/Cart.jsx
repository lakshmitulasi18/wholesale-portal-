import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import {
  Trash2, Plus, Minus, ArrowLeft, ShoppingBag, Truck,
  ShieldCheck, Ticket, ChevronRight, CheckCircle2,
  Info, CreditCard
} from "lucide-react";

const Cart = () => {

  const navigate = useNavigate();

  const {
    updateQty,
    subtotal,
    tax,
    shipping,
    total,
    discount,
    setCoupon,
  } = useCart();

  // BACKEND CART STATE
  const [cartItems, setCartItems] = useState([]);

  // FETCH FROM FLASK BACKEND
  useEffect(() => {
    fetch("http://127.0.0.1:5050/api/cart")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          id: item.id,
          name: "Product " + item.product_id,
          category: "Wholesale Item",
          price: 100,
          qty: item.quantity,
          img: "https://via.placeholder.com/110"
        }));
        setCartItems(formatted);
      })
      .catch(err => console.log("Cart fetch error:", err));
  }, []);

  const FREE_SHIP_LIMIT = 5000;
  const progressToFreeShip = Math.min((subtotal / FREE_SHIP_LIMIT) * 100, 100);

  const [promoInput, setPromoInput] = useState("");

  const applyPromo = () => {
    if (promoInput.toUpperCase() === "SAVE10") {
      setCoupon("SAVE10");
      alert("Success: 10% Coupon Applied!");
    } else {
      alert("Error: Invalid Promo Code");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.glassHeader}>
        <div style={{ fontSize: "24px", fontWeight: "bold" }}>🏭 Wholesale Portal</div>
        <div style={styles.stepperContainer}>
          <div style={styles.step}><CheckCircle2 size={16} /> Cart</div>
          <div style={styles.line}></div>
          <div style={{ ...styles.step, opacity: 0.6 }}><Truck size={16} /> Shipping</div>
          <div style={styles.line}></div>
          <div style={{ ...styles.step, opacity: 0.6 }}><CreditCard size={16} /> Payment</div>
        </div>
      </header>

      <div style={styles.container}>
        <div style={styles.layout}>

          <div style={styles.mainContent}>
            <header style={styles.header}>
              <button onClick={() => navigate(-1)} style={styles.backLink}>
                <ArrowLeft size={18} /> Continue Sourcing
              </button>
              <h1 style={styles.pageTitle}>Your Procurement Cart</h1>
            </header>

            <div style={styles.glassCard}>
              <div style={styles.meterInfo}>
                <Truck size={20} color="#fff" />
                <span>
                  {subtotal >= FREE_SHIP_LIMIT
                    ? "🎉 Free Wholesale Shipping Unlocked!"
                    : `Add ₹${(FREE_SHIP_LIMIT - subtotal).toLocaleString()} more for Free Shipping`}
                </span>
              </div>
              <div style={styles.progressBarBg}>
                <div style={{ ...styles.progressBarFill, width: `${progressToFreeShip}%` }}></div>
              </div>
            </div>

            {cartItems.length > 0 ? cartItems.map(item => (
              <div key={item.id} style={styles.itemCard}>
                <img src={item.img} alt={item.name} style={styles.productImg} />
                <div style={styles.productDetails}>
                  <div style={styles.productHeader}>
                    <div>
                      <span style={styles.categoryBadge}>{item.category}</span>
                      <h3 style={styles.productName}>{item.name}</h3>
                    </div>
                    <button
                      onClick={() => updateQty(item.id, -item.qty)}
                      style={styles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div style={styles.productFooter}>
                    <div style={styles.qtyContainer}>
                      <button onClick={() => updateQty(item.id, -1)} style={styles.qtyBtn}><Minus size={14} /></button>
                      <span style={styles.qtyText}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} style={styles.qtyBtn}><Plus size={14} /></button>
                    </div>
                    <div style={styles.priceInfo}>
                      <span style={styles.unitPrice}>₹{item.price}/unit</span>
                      <span style={styles.rowTotal}>₹{(item.price * item.qty).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div style={styles.emptyContainer}>
                <ShoppingBag size={80} color="rgba(255,255,255,0.5)" />
                <h2 style={{ marginTop: '20px' }}>Your cart is currently empty</h2>
                <button onClick={() => navigate('/products')} style={styles.browseBtn}>Browse Catalog</button>
              </div>
            )}
          </div>

          <aside style={styles.sidebar}>
            <div style={styles.summaryCard}>
              <h2 style={styles.summaryTitle}>Bill Summary</h2>

              <div style={styles.billRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>

              <div style={styles.billRow}>
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  GST (5%) <Info size={12} style={{ marginLeft: '4px' }} />
                </span>
                <span>₹{tax.toLocaleString()}</span>
              </div>

              <div style={styles.billRow}>
                <span>Logistics</span>
                <span style={{ color: shipping === 0 ? '#10b981' : '#fff' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>

              {discount > 0 && (
                <div style={{ ...styles.billRow, color: '#10b981', fontWeight: 'bold' }}>
                  <span>Coupon Discount (SAVE10)</span>
                  <span>-₹{discount.toLocaleString()}</span>
                </div>
              )}

              <div style={styles.promoWrapper}>
                <div style={styles.promoInputGroup}>
                  <Ticket size={18} color="rgba(255,255,255,0.6)" />
                  <input
                    placeholder="Enter Code (SAVE10)"
                    style={styles.promoInput}
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                  />
                  <button onClick={applyPromo} style={styles.applyBtn}>Apply</button>
                </div>
              </div>

              <div style={styles.totalBox}>
                <div style={styles.totalLabel}>Payable Amount</div>
                <div style={styles.totalPrice}>₹{total.toLocaleString()}</div>
              </div>

              <button
                style={styles.checkoutBtn}
                onClick={() => navigate("/buyer/checkout")}
              >
                Checkout Now <ChevronRight size={20} />
              </button>

              <div style={styles.trustFooter}>
                <div style={styles.trustItem}><ShieldCheck size={14} /> Secure Payment</div>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

/* ---------- STYLES (UNCHANGED) ---------- */
const styles = {
  pageWrapper:{minHeight:"100vh",background:"linear-gradient(135deg,#f472b6,#a78bfa,#f472b6)",fontFamily:"'Inter', sans-serif",color:"#fff",paddingBottom:"60px"},
  glassHeader:{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(10px)",padding:"20px 40px",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 4px 20px rgba(0,0,0,0.1)",marginBottom:"30px"},
  stepperContainer:{display:"flex",alignItems:"center",gap:"15px"},
  step:{display:"flex",alignItems:"center",gap:"8px",fontWeight:"800",fontSize:"0.85rem"},
  line:{width:"40px",height:"2px",background:"rgba(255,255,255,0.2)"},
  container:{maxWidth:"1400px",margin:"0 auto",padding:"0 20px"},
  layout:{display:"grid",gridTemplateColumns:"1fr 420px",gap:"40px"},
  mainContent:{display:"flex",flexDirection:"column",gap:"20px"},
  header:{marginBottom:"10px"},
  backLink:{background:"none",border:"none",color:"#fff",fontWeight:"700",cursor:"pointer",display:"flex",alignItems:"center",gap:"8px"},
  pageTitle:{fontSize:"2.8rem",fontWeight:"900",margin:"10px 0"},
  glassCard:{background:"rgba(255,255,255,0.2)",backdropFilter:"blur(15px)",padding:"20px",borderRadius:"20px",border:"1px solid rgba(255,255,255,0.3)"},
  meterInfo:{display:"flex",alignItems:"center",gap:"10px",marginBottom:"10px",fontWeight:"700"},
  progressBarBg:{height:"8px",background:"rgba(255,255,255,0.2)",borderRadius:"4px",overflow:"hidden"},
  progressBarFill:{height:"100%",background:"#fff",borderRadius:"4px",transition:"0.4s ease"},
  itemCard:{display:"flex",gap:"20px",background:"#fff",padding:"20px",borderRadius:"25px",color:"#1e293b",boxShadow:"0 10px 30px rgba(0,0,0,0.1)"},
  productImg:{width:"110px",height:"110px",borderRadius:"15px",objectFit:"contain",background:"#f8fafc"},
  productDetails:{flex:1,display:"flex",flexDirection:"column",justifyContent:"space-between"},
  productHeader:{display:"flex",justifyContent:"space-between",alignItems:"start"},
  categoryBadge:{fontSize:"0.65rem",fontWeight:"900",color:"#a78bfa",letterSpacing:"1px"},
  productName:{fontSize:"1.2rem",fontWeight:"800",margin:"4px 0"},
  removeBtn:{background:"#fee2e2",border:"none",color:"#ef4444",padding:"8px",borderRadius:"10px",cursor:"pointer"},
  productFooter:{display:"flex",justifyContent:"space-between",alignItems:"center"},
  qtyContainer:{display:"flex",alignItems:"center",gap:"12px",background:"#f1f5f9",padding:"6px 12px",borderRadius:"12px"},
  qtyBtn:{background:"none",border:"none",cursor:"pointer",color:"#64748b"},
  qtyText:{fontWeight:"900",fontSize:"1rem"},
  priceInfo:{textAlign:"right"},
  unitPrice:{display:"block",fontSize:"0.75rem",color:"#64748b",fontWeight:"600"},
  rowTotal:{fontSize:"1.4rem",fontWeight:"900",color:"#1e293b"},
  sidebar:{position:"sticky",top:"20px"},
  summaryCard:{background:"rgba(255,255,255,0.15)",backdropFilter:"blur(25px)",padding:"35px",borderRadius:"35px",border:"1px solid rgba(255,255,255,0.2)"},
  summaryTitle:{fontSize:"1.6rem",fontWeight:"900",marginBottom:"25px"},
  billRow:{display:"flex",justifyContent:"space-between",marginBottom:"15px",fontSize:"1rem",opacity:0.9},
  promoWrapper:{margin:"25px 0"},
  promoInputGroup:{display:"flex",alignItems:"center",gap:"10px",background:"rgba(255,255,255,0.1)",padding:"12px 15px",borderRadius:"15px"},
  promoInput:{background:"none",border:"none",color:"#fff",outline:"none",flex:1,fontSize:"0.9rem"},
  applyBtn:{background:"none",border:"none",color:"#fff",fontWeight:"800",cursor:"pointer",textDecoration:"underline"},
  totalBox:{borderTop:"1px solid rgba(255,255,255,0.2)",paddingTop:"25px",marginBottom:"30px"},
  totalLabel:{fontSize:"0.8rem",opacity:0.7,textTransform:"uppercase"},
  totalPrice:{fontSize:"2.6rem",fontWeight:"900"},
  checkoutBtn:{width:"100%",background:"#fff",color:"#a78bfa",border:"none",padding:"20px",borderRadius:"20px",fontSize:"1.2rem",fontWeight:"900",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"12px"},
  trustFooter:{display:"flex",justifyContent:"center",gap:"20px",marginTop:"25px",opacity:0.6,fontSize:"0.75rem"},
  emptyContainer:{textAlign:"center",padding:"100px 20px"},
  browseBtn:{marginTop:"25px",padding:"12px 30px",background:"#fff",color:"#a78bfa",border:"none",borderRadius:"12px",fontWeight:"800"}
};

export default Cart;
