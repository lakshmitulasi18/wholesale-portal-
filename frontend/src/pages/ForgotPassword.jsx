import React, { useState, useEffect } from 'react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [strength, setStrength] = useState('');
  const [serverOtp, setServerOtp] = useState('');

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const checkStrength = (pwd) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (pwd.length === 0) return setStrength('');
    if (!strongRegex.test(pwd)) return setStrength('Weak password');
    if (pwd.length < 12) return setStrength('Medium strength');
    setStrength('Strong password');
  };

  /* ===== STEP 1: SEND OTP ===== */
  const handleSendOTP = async () => {
    setError('');
    setSuccess('');

    try {
      const res = await fetch("http://127.0.0.1:5050/api/auth/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send OTP");
        return;
      }

      setStep(2);
      setTimeLeft(120);
      setSuccess("OTP sent! Check backend terminal.");

    } catch (err) {
      setError("Backend connection failed");
    }
  };

  /* ===== STEP 2: VERIFY OTP (frontend check) ===== */
  const handleVerifyOTP = () => {
    if (!otpInput) {
      setError("Enter OTP");
      return;
    }

    setStep(3);
    setError('');
    setSuccess("OTP verified. Enter new password.");
  };

  /* ===== STEP 3: RESET PASSWORD ===== */
  const handleResetPassword = async () => {
    setError('');
    setSuccess('');

    if (strength === 'Weak password') {
      return setError("Password too weak!");
    }

    try {
      const res = await fetch("http://127.0.0.1:5050/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          otp: otpInput,
          new_password: password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Reset failed");
        return;
      }

      setSuccess("Password reset successful! Redirecting...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);

    } catch (err) {
      setError("Backend connection failed");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Your Password</h2>
        <p style={styles.subtitle}>Follow the steps to recover access</p>

        {step === 1 && (
          <>
            <input
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button style={styles.button} onClick={handleSendOTP}>
              Send OTP
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <input
              style={styles.input}
              placeholder="Enter OTP"
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
            />
            <div style={styles.timer}>OTP expires in {timeLeft}s</div>
            <button style={styles.button} onClick={handleVerifyOTP}>
              Verify OTP
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              style={styles.input}
              placeholder="New Password"
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                checkStrength(e.target.value);
              }}
            />
            {strength && <div style={styles.strength}>{strength}</div>}
            <button style={styles.button} onClick={handleResetPassword}>
              Reset Password
            </button>
          </>
        )}

        {error && <div style={styles.errorBox}>{error}</div>}
        {success && <div style={styles.successBox}>{success}</div>}
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'linear-gradient(135deg, #4f46e5, #9333ea)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  card: {
    width: 380,
    background: '#ffffff',
    padding: 35,
    borderRadius: 16,
    boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
    textAlign: 'center'
  },
  title: {
    marginBottom: 5,
    fontSize: 24,
    fontWeight: 700,
    color: '#1e293b'
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 20
  },
  input: {
    width: '100%',
    height: 48,
    marginTop: 12,
    padding: '0 14px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    outline: 'none'
  },
  button: {
    width: '100%',
    height: 48,
    marginTop: 15,
    background: '#4f46e5',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    borderRadius: 8,
    cursor: 'pointer'
  },
  timer: {
    marginTop: 8,
    fontSize: 12,
    color: '#ef4444'
  },
  strength: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 600,
    color: '#4f46e5'
  },
  errorBox: {
    marginTop: 15,
    padding: 10,
    borderRadius: 6,
    background: '#fee2e2',
    color: '#b91c1c',
    fontSize: 13
  },
  successBox: {
    marginTop: 15,
    padding: 10,
    borderRadius: 6,
    background: '#dcfce7',
    color: '#166534',
    fontSize: 13
  }
};

export default ForgotPassword;
