import { useState } from "react";

export default function Login() {
  const [role, setRole] = useState("buyer");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "" });

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "" }), 3000);
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!identifier || !password) {
      return showToast("Please enter email and password", "error");
    }

    try {
      const res = await fetch("http://127.0.0.1:5050/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: identifier.trim(),
          password: password
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      /* ✅ SAVE USER DATA */
      sessionStorage.setItem("ROLE", data.user.role);
      sessionStorage.setItem("NAME", data.user.name);
      sessionStorage.setItem("EMAIL", data.user.email);
      sessionStorage.setItem("USER_ID", data.user.id);

      showToast("Login Success", "success");

      /* ✅ ROLE BASED REDIRECT */
      setTimeout(() => {
        if (data.user.role === "buyer") {
          window.location.href = "/buyer";
        }
        else if (data.user.role === "supplier") {
          window.location.href = "/supplier";
        }
        else if (data.user.role === "admin") {
          window.location.href = "/admin/dashboard";
        }
      }, 1000);

    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <>
      <style>{`
        body { 
          margin: 0; padding: 0; min-height: 100vh;
          font-family: 'Inter', sans-serif;
          background: linear-gradient(135deg, #a78bfa, #f472b6);
          display: flex; justify-content: center; align-items: center;
        }
        .login-card { 
          display: flex; max-width: 1000px; width: 90%; min-height: 500px;
          background: white; border-radius: 40px;
          overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15);
        }
        .left-panel { 
          flex: 1; background: #1e293b; color: white; padding: 60px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .right-panel { 
          flex: 1; padding: 50px;
          display: flex; flex-direction: column; justify-content: center;
        }
        .role-selector { 
          display: flex; justify-content: space-around; margin-bottom: 40px;
        }
        .role-tab { 
          background: none; border: none; font-weight: 600;
          cursor: pointer; color: #64748b;
          padding: 10px 20px; border-radius: 12px;
        }
        .role-tab.active { background: #8b5cf6; color: white; }
        .form-group { margin-bottom: 20px; }
        label { 
          display: block; font-weight: 700;
          color: #1e293b; margin-bottom: 8px;
        }
        .input-field { 
          width: 100%; height: 55px;
          border: 2px solid #f1f5f9; border-radius: 15px;
          padding: 0 20px; font-size: 16px;
        }
        .submit-btn { 
          width: 100%; height: 60px;
          background: #1e293b; color: white;
          border: none; border-radius: 18px;
          font-size: 18px; font-weight: 700;
          cursor: pointer; margin-top: 15px;
        }
        .links-row { 
          display: flex; justify-content: space-between;
          margin-top: 20px; font-size: 13px;
        }
        .links-row a { 
          color: #8b5cf6; cursor: pointer;
          text-decoration: none;
        }
        .toast { 
          position: fixed; top: 20px; right: 20px;
          padding: 15px 25px; border-radius: 12px;
          color: white; font-weight: 600;
        }
        .success { background: #10b981; }
        .error { background: #ef4444; }
      `}</style>

      <div className="login-card">
        <div className="left-panel">
          <h1>Welcome Back!</h1>
          <p>Secure login to manage your wholesale business.</p>
        </div>

        <div className="right-panel">
          <div className="role-selector">
            {["buyer", "supplier", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                className={`role-tab ${role === r ? "active" : ""}`}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                className="input-field"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button className="submit-btn">Login</button>
          </form>

          <div className="links-row">
            <a href="/register">New User? Create Account</a>
            <a href="/forgot-password">Forgot Password?</a>
          </div>
        </div>
      </div>

      {toast.msg && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
