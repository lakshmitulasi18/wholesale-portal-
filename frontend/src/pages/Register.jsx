import { useState } from "react";

const API_URL = "http://127.0.0.1:5050/api/auth/register";

export default function Register() {
  const [role, setRole] = useState("buyer");
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    userId: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [strength, setStrength] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "" });

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phonePattern = /^[6-9]\d{9}$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  const checkStrength = (p) => {
    if (p.length === 0) return setStrength("");
    if (p.length < 8 || !passwordPattern.test(p)) return setStrength("weak");
    if (p.length < 12) return setStrength("medium");
    setStrength("strong");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "password") checkStrength(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, businessName, email, phone, password, confirmPassword } = form;

    if (!name || !email || !phone || !password)
      return showToast("Required fields missing", "error");

    if (role === "supplier" && !businessName)
      return showToast("Business name required", "error");

    if (!emailPattern.test(email))
      return showToast("Invalid email", "error");

    if (!phonePattern.test(phone))
      return showToast("Invalid phone", "error");

    if (!passwordPattern.test(password))
      return showToast("Password must contain upper, lower, number & symbol", "error");

    if (password !== confirmPassword)
      return showToast("Passwords mismatch", "error");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: role,
          phone: phone,
          company_name: role === "supplier" ? businessName : null
        })
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Account created successfully!", "success");
        setTimeout(() => window.location.replace("/login"), 1500);
      } else {
        showToast(data.message || "Registration failed", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error. Try again later.", "error");
    }
  };

  return (
    <>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{
          font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background:#f1f5f9; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:20px;
        }
        .register-container{
          max-width:900px; width:100%; display:flex; background:white; 
          border-radius:20px; overflow:hidden; box-shadow:0 10px 25px rgba(0,0,0,0.1);
        }
        .left-panel{
          flex:0.8; background:#1e293b; padding:40px; color:white; display:flex; flex-direction:column; justify-content:center;
        }
        .right-panel{ flex:1.2; padding:30px 40px; }
        .role-selector{ display:flex; gap:10px; margin-bottom:20px; }
        .role-btn{
          flex:1; padding:10px; border:1px solid #e2e8f0; background:none; cursor:pointer; border-radius:8px; font-weight:600;
        }
        .role-btn.active{ background:#8b5cf6; color:white; border-color:#8b5cf6; }
        .form-row{ display:flex; gap:15px; }
        .form-group{ flex:1; margin-bottom:12px; }
        .control-label{ font-size:12px; font-weight:700; color:#475569; margin-bottom:4px; display:block; }
        .input-field{
          width:100%; height:40px; border-radius:8px; border:1px solid #cbd5e1; padding:0 12px; font-size:14px;
        }
        .input-field:focus{ border-color:#8b5cf6; outline:none; }
        .submit-btn{
          width:100%; padding:12px; border:none; border-radius:8px; background:#1e293b; color:white; font-weight:700; cursor:pointer; margin-top:10px;
        }
        .strength{ height:4px; background:#e2e8f0; margin-top:5px; border-radius:2px; }
        .strength span{ display:block; height:100%; transition:0.3s; }
        .weak{ background:#ef4444; width:33%; }
        .medium{ background:#f59e0b; width:66%; }
        .strong{ background:#22c55e; width:100%; }
        .login-link{ text-align:center; margin-top:15px; font-size:13px; color:#64748b; }
        .login-link a{ color:#7c3aed; text-decoration:none; font-weight:700; }
        .toast{
          position:fixed; top:20px; right:20px; padding:12px 20px; border-radius:8px; color:white; font-size:14px; z-index:100;
        }
        .toast.success{ background:#10b981; }
        .toast.error{ background:#ef4444; }
        @media(max-width:768px){
          .register-container{ flex-direction:column; }
          .left-panel{ padding:30px; }
        }
      `}</style>

      <div className="register-container">
        <div className="left-panel">
          <h2>Wholesale Portal</h2>
          <p style={{fontSize:'14px', marginTop:'10px', opacity:0.8}}>Start your trading journey with us.</p>
        </div>

        <div className="right-panel">
          <div className="role-selector">
            {["buyer", "supplier"].map(r => (
              <button key={r} className={`role-btn ${role === r ? "active" : ""}`} onClick={() => setRole(r)}>
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="control-label">FULL NAME</label>
              <input name="name" className="input-field" onChange={handleChange} value={form.name} />
            </div>

            {role === "supplier" && (
              <div className="form-group">
                <label className="control-label">BUSINESS NAME</label>
                <input name="businessName" className="input-field" onChange={handleChange} value={form.businessName} />
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label className="control-label">EMAIL</label>
                <input type="email" name="email" className="input-field" onChange={handleChange} value={form.email} />
              </div>
              <div className="form-group">
                <label className="control-label">PHONE</label>
                <input type="tel" name="phone" className="input-field" onChange={handleChange} value={form.phone} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="control-label">PASSWORD</label>
                <input type="password" name="password" className="input-field" onChange={handleChange} value={form.password} />
                <div className="strength"><span className={strength}></span></div>
              </div>
              <div className="form-group">
                <label className="control-label">CONFIRM</label>
                <input type="password" name="confirmPassword" className="input-field" onChange={handleChange} value={form.confirmPassword} />
              </div>
            </div>

            <button className="submit-btn">Register Now</button>
          </form>

          <div className="login-link">
            Already registered? <a href="/login">Login</a>
          </div>
        </div>
      </div>

      {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}