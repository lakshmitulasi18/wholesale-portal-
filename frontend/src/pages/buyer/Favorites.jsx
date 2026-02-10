import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart, Trash2, ShoppingCart, ArrowLeft,
  Star, Package, BarChart3, ChevronRight
} from "lucide-react";

const FavoritesPage = () => {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  /* ================= FETCH FAVORITES FROM BACKEND ================= */
  useEffect(() => {
    fetch("http://127.0.0.1:5050/api/favorites")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          id: item.id,
          name: "Product " + item.product_id,
          category: "Wholesale Item",
          price: 100,
          rating: 4.5,
          img: "https://via.placeholder.com/200"
        }));
        setFavorites(formatted);
      })
      .catch(err => console.log("Favorites fetch error:", err));
  }, []);

  /* ================= CHECK CART ================= */
  const isInCart = (id) => cartItems.some(item => item.id === id);

  /* ================= REMOVE FAVORITE ================= */
  const removeFromFavorites = (id) => {
    fetch(`http://127.0.0.1:5050/api/favorites/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setFavorites(prev => prev.filter(item => item.id !== id));
      })
      .catch(err => console.log(err));
  };

  /* ================= MOVE TO CART ================= */
  const moveToCart = (item) => {
    fetch("http://127.0.0.1:5050/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_id: item.id,
        quantity: 1
      })
    })
      .then(res => res.json())
      .then(() => {
        setCartItems(prev => [...prev, item]);
      });
  };

  /* ================= ADD ALL TO CART ================= */
  const addAllToCart = () => {
    favorites.forEach(item => {
      if (!isInCart(item.id)) {
        moveToCart(item);
      }
    });
  };

  return (
    <div style={styles.pageWrapper}>
      <header style={styles.glassHeader}>
        <div style={styles.logoGroup}>
          <Package size={28} color="#fff" />
          <div style={{ fontSize: "24px", fontWeight: "900" }}>
            WHOLESALE PORTAL
          </div>
        </div>

        <div style={styles.navActions}>
          <button onClick={() => navigate("/products")} style={styles.navBtn}>
            Catalog
          </button>
          <button onClick={() => navigate("/cart")} style={styles.navBtn}>
            Cart
          </button>
        </div>
      </header>

      <div style={styles.container}>
        <header style={styles.pageHeader}>
          <button onClick={() => navigate(-1)} style={styles.backLink}>
            <ArrowLeft size={18}/> Back
          </button>

          <h1 style={styles.pageTitle}>
            Saved Procurement 
            <Heart size={28} fill="#fff" style={{marginLeft:10}}/>
          </h1>

          {favorites.length > 0 && (
            <button onClick={addAllToCart} style={styles.addAllBtn}>
              Add All to Cart
            </button>
          )}

          <p style={styles.subtitle}>
            Manage your recurring wholesale items and bulk-add to cart.
          </p>
        </header>

        {favorites.length > 0 ? (
          <div style={styles.grid}>
            {favorites.map(item => (
              <div key={item.id} style={styles.favoriteCard}>
                <div style={styles.imageBox}>
                  <img src={item.img} alt={item.name} style={styles.productImg} />

                  <button
                    style={styles.removeFloatingBtn}
                    onClick={() => removeFromFavorites(item.id)}
                  >
                    <Trash2 size={18} color="#ef4444" />
                  </button>
                </div>

                <div style={styles.cardContent}>
                  <span style={styles.categoryBadge}>{item.category}</span>
                  <h3 style={styles.productName}>{item.name}</h3>

                  <div style={styles.statsRow}>
                    <div style={styles.rating}>
                      <Star size={14} fill="#fbbf24" color="#fbbf24"/> {item.rating}
                    </div>
                    <div style={styles.stock}>
                      <BarChart3 size={14}/> In Stock
                    </div>
                  </div>

                  <div style={styles.priceRow}>
                    <span style={styles.priceLabel}>Bulk Price</span>
                    <span style={styles.priceValue}>₹{item.price}</span>
                  </div>

                  <div style={styles.actionGroup}>
                    <button
                      onClick={() => !isInCart(item.id) && moveToCart(item)}
                      style={styles.cartBtn}
                    >
                      <ShoppingCart size={18} />
                      Add to Cart
                    </button>

                    <button
                      style={styles.detailsBtn}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      View <ChevronRight size={16}/>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={styles.emptyContainer}>
            <div style={styles.emptyGlass}>
              <Heart size={80} color="rgba(255,255,255,0.3)" />
              <h2>Your favorites list is empty</h2>
              <button onClick={() => navigate('/products')} style={styles.browseBtn}>
                Browse Catalog
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= SAME STYLES ================= */
const styles = {
  pageWrapper: {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #f472b6, #a78bfa, #f472b6)",
    fontFamily: "'Inter', sans-serif",
    color: "#fff",
    paddingBottom: "80px",
    overflowX: "hidden"
  },
  glassHeader: {
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(15px)",
    padding: "20px 4%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px"
  },
  logoGroup: { display: "flex", alignItems: "center", gap: "15px" },
  navActions: { display: "flex", gap: "25px" },
  navBtn: {
    background: "none",
    border: "none",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer"
  },
  container: { width: "100%", padding: "0 4%" },
  pageHeader: { marginBottom: "40px" },
  backLink: {
    background: "none",
    border: "none",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  pageTitle: {
    fontSize: "3rem",
    fontWeight: "900",
    display: "flex",
    alignItems: "center"
  },
  subtitle: { opacity: 0.8 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: "30px"
  },
  favoriteCard: {
    background: "#fff",
    borderRadius: "35px",
    overflow: "hidden",
    color: "#1e293b"
  },
  imageBox: {
    height: "220px",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  productImg: { maxWidth: "100%", maxHeight: "100%" },
  removeFloatingBtn: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "15px"
  },
  cardContent: { padding: "25px" },
  categoryBadge: { fontSize: "0.7rem", fontWeight: "900", color: "#a78bfa" },
  productName: { fontSize: "1.4rem", fontWeight: "800" },
  statsRow: { display: "flex", gap: "20px", marginBottom: "15px" },
  priceRow: {
    background: "#f1f5f9",
    padding: "15px",
    borderRadius: "20px",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px"
  },
  actionGroup: { display: "flex", gap: "10px" },
  cartBtn: {
    flex: 2,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "15px",
    borderRadius: "18px",
    fontWeight: "800"
  },
  detailsBtn: {
    flex: 1,
    background: "#f1f5f9",
    border: "none",
    padding: "15px",
    borderRadius: "18px"
  },
  emptyContainer: { display: "flex", justifyContent: "center" },
  emptyGlass: {
    background: "rgba(255,255,255,0.15)",
    padding: "80px",
    borderRadius: "50px",
    textAlign: "center"
  },
  browseBtn: {
    padding: "15px 40px",
    background: "#fff",
    color: "#a78bfa",
    border: "none",
    borderRadius: "20px",
    fontWeight: "900"
  },
  addAllBtn: {
    marginTop: "20px",
    padding: "14px 30px",
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "16px",
    fontWeight: "900"
  }
};

export default FavoritesPage;
