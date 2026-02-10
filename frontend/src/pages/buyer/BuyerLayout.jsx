import { Outlet } from "react-router-dom";
import { CartProvider } from "../../context/CartContext";
import { OrdersProvider } from "../../context/OrdersContext";

const BuyerLayout = () => {
  return (
    <OrdersProvider>
      <CartProvider>
        <div style={{ minHeight: "100vh", width: "100%" }}>
          <Outlet />
        </div>
      </CartProvider>
    </OrdersProvider>
  );
};

export default BuyerLayout;