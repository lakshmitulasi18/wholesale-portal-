import { createContext, useContext, useEffect, useState } from "react";

const OrdersContext = createContext();

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("BUYER_ORDERS");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("BUYER_ORDERS", JSON.stringify(orders));
  }, [orders]);

  const addOrder = (order) => {
    setOrders((prev) => [order, ...prev]); // latest first
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);

  return (
    <OrdersContext.Provider value={{ orders, addOrder, getOrderById }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => useContext(OrdersContext);
