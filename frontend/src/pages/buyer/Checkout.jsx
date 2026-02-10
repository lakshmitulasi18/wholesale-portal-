import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { CheckCircle2, CreditCard, Truck, MapPin, Lock, ArrowLeft, ChevronRight } from "lucide-react";

const CheckoutPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", address: "",
    cardNumber: "", expiry: "", cvv: ""
  });

  const navigate = useNavigate();
  const { cartItems, subtotal, tax, shipping, discount, total, clearCart } = useCart();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const steps = [
    { id: 1, name: "Shipping", icon: <Truck size={16} /> },
    { id: 2, name: "Payment", icon: <CreditCard size={16} /> },
    { id: 3, name: "Review", icon: <CheckCircle2 size={16} /> }
  ];

  // ✅ IMPROVED PLACE ORDER FUNCTION
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const userId = parseInt(sessionStorage.getItem("USER_ID"));

    if (!userId) {
      alert("Session expired. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5050/api/orders/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user_id: userId,
          total_amount: total,
          items: cartItems.map(item => ({
            id: item.id,
            qty: item.qty || item.quantity,
            price: item.price
          }))
        })
      });

      const result = await response.json();
      console.log("ORDER API RESPONSE:", result);

      if (response.ok) {
        clearCart();
        navigate("/buyer/order-success", { state: { orderId: result.order_id } });
      } else {
        alert(result.error || result.message || "Order failed");
      }

    } catch (error) {
      console.error("ORDER ERROR:", error);
      alert("Server error placing order");
    }
  };

  return (
    <div style={styles.page}>
      <nav style={styles.navbar}>
        <div style={styles.navContent}>
          <div style={styles.logo}>GROCERY<span style={{ color: '#d84315' }}>WHOLESALE</span></div>
          <div style={styles.secureBadgeTop}><Lock size={12} /> Secure</div>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.stepper}>
          {steps.map((s, idx) => (
            <React.Fragment key={s.id}>
              <div style={{ ...styles.step, opacity: step >= s.id ? 1 : 0.5 }}>
                <div style={{
                  ...styles.stepIcon,
                  backgroundColor: step >= s.id ? "#d84315" : "#fce4e0",
                  color: step >= s.id ? "#fff" : "#9a7d76"
                }}>
                  {step > s.id ? <CheckCircle2 size={16} /> : s.icon}
                </div>
                <span style={styles.stepName}>{s.name}</span>
              </div>
              {idx < steps.length - 1 && <div style={styles.stepLine} />}
            </React.Fragment>
          ))}
        </div>

        <div style={styles.mainLayout}>
          <div style={styles.formSection}>
            {step === 1 && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}><MapPin size={20} /> Shipping</h2>
                <div style={styles.grid}>
                  <input style={styles.input} name="firstName" placeholder="First Name" onChange={handleInputChange} />
                  <input style={styles.input} name="lastName" placeholder="Last Name" onChange={handleInputChange} />
                  <input style={{ ...styles.input, gridColumn: 'span 2' }} name="address" placeholder="Business Address" onChange={handleInputChange} />
                </div>
                <button style={styles.primaryBtn} onClick={() => setStep(2)}>Next: Payment <ChevronRight size={16} /></button>
              </div>
            )}

            {step === 2 && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}><CreditCard size={20} /> Payment</h2>
                <div style={styles.grid}>
                  <input style={{ ...styles.input, gridColumn: 'span 2' }} name="cardNumber" placeholder="Card Number" onChange={handleInputChange} />
                  <input style={styles.input} name="expiry" placeholder="MM/YY" onChange={handleInputChange} />
                  <input style={styles.input} name="cvv" placeholder="CVV" onChange={handleInputChange} />
                </div>
                <div style={styles.btnGroup}>
                  <button style={styles.secondaryBtn} onClick={() => setStep(1)}><ArrowLeft size={14} /> Back</button>
                  <button style={styles.primaryBtn} onClick={() => setStep(3)}>Review Order</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={styles.card}>
                <h2 style={styles.sectionTitle}><CheckCircle2 size={20} /> Review</h2>
                <div style={styles.reviewBox}>
                  <p><strong>Deliver to:</strong> {formData.firstName} {formData.lastName}</p>
                  <p style={{ fontSize: '0.9rem', color: '#8d6e63' }}>{formData.address}</p>
                </div>
                <div style={styles.btnGroup}>
                  <button style={styles.secondaryBtn} onClick={() => setStep(2)}>Edit</button>
                  <button style={{ ...styles.primaryBtn, backgroundColor: "#065f46" }} onClick={handlePlaceOrder}>
                    Confirm Order ₹{total.toLocaleString()}
                  </button>
                </div>
              </div>
            )}
          </div>

          <aside style={styles.summaryCard}>
            <h3 style={styles.summaryTitle}>Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} style={styles.miniItem}>
                <span>{item.name} x{item.qty || item.quantity}</span>
                <span>₹{(item.price * (item.qty || item.quantity)).toLocaleString()}</span>
              </div>
            ))}
            <div style={styles.divider} />
            <div style={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
            <div style={styles.summaryRow}><span>GST</span><span>₹{tax.toLocaleString()}</span></div>
            <div style={styles.totalRow}><span>Total</span><span>₹{total.toLocaleString()}</span></div>
          </aside>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { backgroundColor: '#fdf2f0', minHeight: '100vh', color: '#5d4037', fontFamily: "sans-serif" },
  navbar: { backgroundColor: '#fffaf9', height: '60px', borderBottom: '1px solid #fce4e0', display: 'flex', alignItems: 'center' },
  navContent: { width: '90%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { fontWeight: '800', fontSize: '1.1rem' },
  secureBadgeTop: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#065f46', fontWeight: 'bold' },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '30px 20px' },
  stepper: { display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '30px', gap: '10px' },
  step: { display: 'flex', alignItems: 'center', gap: '8px' },
  stepIcon: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  stepLine: { width: '40px', height: '2px', backgroundColor: '#fce4e0' },
  stepName: { fontSize: '0.85rem', fontWeight: 'bold' },
  mainLayout: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' },
  card: { backgroundColor: '#fffaf9', padding: '25px', borderRadius: '20px', border: '1px solid #fce4e0' },
  sectionTitle: { fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: '#4e342e' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' },
  input: { backgroundColor: '#fdf2f0', border: '1px solid #fce4e0', borderRadius: '10px', padding: '12px', outline: 'none', width: '100%' },
  primaryBtn: { width: '100%', backgroundColor: '#4e342e', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' },
  secondaryBtn: { backgroundColor: 'transparent', border: '1px solid #fce4e0', padding: '14px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' },
  btnGroup: { display: 'flex', gap: '10px' },
  summaryCard: { backgroundColor: '#fce4e0', padding: '25px', borderRadius: '20px', height: 'fit-content' },
  summaryTitle: { fontSize: '1.1rem', marginBottom: '15px', fontWeight: '800' },
  miniItem: { display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '10px' },
  divider: { height: '1px', backgroundColor: '#f8bbd0', margin: '15px 0' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: '800', marginTop: '15px', paddingTop: '15px', borderTop: '1px dashed #f8bbd0' },
  reviewBox: { backgroundColor: '#fdf2f0', padding: '15px', borderRadius: '12px', marginBottom: '20px' }
};

export default CheckoutPage;