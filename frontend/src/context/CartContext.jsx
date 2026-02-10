import { createContext, useContext, useState, useEffect, useMemo } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [coupon, setCoupon] = useState(null); // e.g. "SAVE10"
  useEffect(() => {
    if (cartItems.length === 0) {
      setCoupon(null);
    }
  }, [cartItems]);


  const addItem = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, qty: p.qty + delta } : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  const getQty = (id) =>
    cartItems.find((p) => p.id === id)?.qty || 0;

  const subtotal = useMemo(
    () => cartItems.reduce((s, i) => s + i.price * i.qty, 0),
    [cartItems]
  );
  const discount = useMemo(() => {
    if (coupon === "SAVE10") return subtotal * 0.1;
    return 0;
  }, [coupon, subtotal]);

  const tax = subtotal * 0.05;
  const shipping = subtotal >= 5000 || subtotal === 0 ? 0 : 250;
  const total = subtotal + tax + shipping - discount;
  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
  };


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addItem,
        updateQty,
        getQty,
        coupon,
        setCoupon,
        subtotal,
        discount,
        tax,
        shipping,
        total,
        clearCart,
      }}
    >

      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
