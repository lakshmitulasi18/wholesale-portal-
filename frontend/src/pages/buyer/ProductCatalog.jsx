import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

const ProductCatalog = () => {
  const navigate = useNavigate();
  const { addItem, updateQty, getQty, cartItems } = useCart();
  const totalCount = cartItems.reduce((a, b) => a + b.qty, 0);
  const { toggleFavorite, isFavorite, favorites } = useFavorites();

  const [activeCategory, setActiveCategory] = useState("all");
  const [products, setProducts] = useState([]);

  // FETCH PRODUCTS
  useEffect(() => {
    fetch("http://127.0.0.1:5050/api/products/")
      .then(res => res.json())
      .then(data => {
        console.log("Products:", data);
        setProducts(data);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  const categories = [
    { id: "all", label: "All Products" },
    { id: "rice", label: "Rice & Grains" },
    { id: "oil", label: "Cooking Oils" },
    { id: "spices", label: "Spices & Others" },
    { id: "pulses", label: "Pulses" },
    { id: "flour", label: "Atta & Flour" },
    { id: "organic", label: "Organic Selection" }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(to right, #f472b6, #a78bfa, #f472b6)",
      paddingTop: "90px"
    }}>

      {/* HEADER */}
      <header style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        background: "#fff",
        padding: "10px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        height: "70px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate(-1)}
            style={{
              background: "#f1f5f9",
              border: "none",
              borderRadius: "50%",
              width: "35px",
              height: "35px",
              cursor: "pointer"
            }}>
            ←
          </button>

          <div style={{ fontSize: "20px", fontWeight: "900" }}>
            🏭 WholeSale <span style={{ color: '#f472b6' }}>Portal</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "5px" }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "15px",
                border: "none",
                background: activeCategory === c.id ? "#a78bfa" : "#f1f5f9",
                color: activeCategory === c.id ? "#fff" : "#475569",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "11px"
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button onClick={() => navigate("/buyer/cart")}
          style={{
            background: "#a78bfa",
            color: "#fff",
            padding: "8px 15px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold"
          }}>
          🛒 Cart: {totalCount}
        </button>

        <button onClick={() => navigate("/buyer/favorites")}
          style={{
            background: "#f1f5f9",
            border: "none",
            borderRadius: "8px",
            padding: "8px 12px",
            fontWeight: "700",
            color: "#ef4444"
          }}>
          ❤️ Favorites: {favorites.length}
        </button>
      </header>

      {/* PRODUCT GRID */}
      <div style={{ padding: "15px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(245px, 1fr))",
          gap: "15px",
          maxWidth: "1400px",
          margin: "0 auto"
        }}>
          {products.map((p) => (
            <div key={p.id} style={{
              position: "relative",
              background: "#fff",
              borderRadius: "15px",
              padding: "15px",
              textAlign: "center",
              boxShadow: "0 8px 15px rgba(0,0,0,0.05)"
            }}>

              <button onClick={() => toggleFavorite(p)}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  padding: "6px"
                }}>
                <Heart size={16}
                  color={isFavorite(p.id) ? "red" : "#64748b"}
                  fill={isFavorite(p.id) ? "red" : "none"} />
              </button>

              <div style={{ height: "180px", marginBottom: "10px" }}>
                <img
                  src={p.image_url || "https://via.placeholder.com/150"}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain"
                  }}
                />
              </div>

              <h3>{p.name}</h3>
              <div style={{ fontWeight: "800", fontSize: "18px" }}>
                ₹{Number(p.price).toLocaleString()}
              </div>

              {(() => {
                const qty = getQty(p.id);
                return qty === 0 ? (
                  <button onClick={() => addItem(p)}>Add to Cart</button>
                ) : (
                  <div>
                    <button onClick={() => updateQty(p.id, -1)}>-</button>
                    {qty}
                    <button onClick={() => updateQty(p.id, 1)}>+</button>
                  </div>
                );
              })()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
