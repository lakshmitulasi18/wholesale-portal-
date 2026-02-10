import React from 'react';
import { Link } from 'react-router-dom';

const WholesalePortal = () => {
  return (
    <div className="portal-container">
      {/* Background Shapes for the animated effect */}
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      {/* NEW: Dedicated Top Header Banner */}
      <header className="top-brand-header">
        WHOLESALE PORTAL
      </header>

      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero-section">
        <div className="hero-card">
          <h1 className="hero-title">
            Revolutionize Your <br />
            Wholesale Business
          </h1>
          <p className="hero-subtitle">
            The ultimate ecosystem for buyers and suppliers to connect, trade, and 
            grow together in one secure platform.
          </p>
          <div className="button-group">
            <Link to="/login" className="btn btn-login">
              LOGIN PORTAL
            </Link>
            <Link to="/register" className="btn btn-join">
              JOIN REVOLUTION
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="features-section">
        <div className="feature-card">
          <div className="feature-header">
            <span className="feature-icon">📦</span>
            <h3>Bulk Sourcing</h3>
          </div>
          <p>Explore thousands of wholesale products with real-time inventory.</p>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <span className="feature-icon">📊</span>
            <h3>Supplier Tools</h3>
          </div>
          <p>Manage products, orders, and invoices easily.</p>
        </div>

        <div className="feature-card">
          <div className="feature-header">
            <span className="feature-icon">🛡️</span>
            <h3>Secure Trading</h3>
          </div>
          <p>Role-based authentication keeps transactions safe.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Wholesale Portal • Empowering Wholesale Commerce</p>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800;900&display=swap');

        .portal-container {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: linear-gradient(135deg, #a78bfa 0%, #d946ef 100%);
          color: white;
          position: relative;
          overflow-x: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        /* Top Header Style */
        .top-brand-header {
          width: 100%;
          text-align: center;
          padding: 20px 0;
          font-size: 2.5rem;
          font-weight: 900;
          letter-spacing: 6px;
          text-transform: uppercase;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 100;
          text-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .background-shapes .shape {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          filter: blur(40px);
          z-index: 0;
        }

        .shape-1 { width: 400px; height: 400px; top: -100px; right: -100px; }
        .shape-2 { width: 300px; height: 300px; bottom: 10%; left: -80px; }

        .navbar {
          width: 100%;
          padding: 20px 0;
          display: flex;
          justify-content: center;
          z-index: 10;
        }

        .logo {
          font-weight: 800;
          font-size: 1.2rem;
          letter-spacing: 1px;
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0.8;
        }

        .hero-section {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 60px 20px;
          z-index: 10;
        }

        .hero-card {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 40px;
          padding: 60px 40px;
          max-width: 850px;
          text-align: center;
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.2);
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: 25px;
        }

        .hero-subtitle {
          font-size: 1.3rem;
          opacity: 0.95;
          margin-bottom: 40px;
        }

        .btn {
          display: inline-block;
          text-decoration: none;
          padding: 20px 45px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .btn:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }
        .btn-login { background: white; color: #9333ea; }
        .btn-join { background: #ec4899; color: white; }

        .features-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          width: 90%;
          max-width: 1200px;
          padding: 40px 0 100px;
          z-index: 10;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 30px;
          padding: 40px;
          text-align: center;
        }

        .footer {
          width: 100%;
          padding: 40px;
          text-align: center;
          background: rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        @media (max-width: 768px) {
          .top-brand-header { font-size: 1.6rem; letter-spacing: 2px; }
          .hero-title { font-size: 2.5rem; }
          .button-group { flex-direction: column; }
        }
      `}</style>
    </div>
  );
};

export default WholesalePortal;