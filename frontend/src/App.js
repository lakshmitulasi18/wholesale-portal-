import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { FavoritesProvider } from "./context/FavoritesContext";

/* ================= PUBLIC ================= */
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

/* ================= BUYER ================= */
import BuyerLayout from "./pages/buyer/BuyerLayout";
import BuyerDashboard from "./pages/buyer/Dashboard";
import ProductCatalog from "./pages/buyer/ProductCatalog";
import OrdersPage from "./pages/buyer/Orders";
import Cart from "./pages/buyer/Cart";
import Favorites from "./pages/buyer/Favorites";
import Addresses from "./pages/buyer/Addresses";
import Checkout from "./pages/buyer/Checkout";
import OrderSuccess from "./pages/buyer/OrderSuccess";
import OrderDetails from "./pages/buyer/OrderDetails";

/* ================= SUPPLIER ================= */
import SupplierDashboardHub from "./pages/supplier/SupplierDashboardHub";
import SupplierAddProduct from "./pages/supplier/AddProduct";
import SupplierInventory from "./pages/supplier/Inventory";
import SupplierOrders from "./pages/supplier/ordersReceived";
import SupplierInvoices from "./pages/supplier/Invoices";
import SupplierProfile from "./pages/supplier/Profile";

/* ================= ADMIN ================= */
import AdminDashboardHub from "./pages/admin/AdminDashboardHub";
import UserManagement from "./pages/admin/UserManagement";
import SupplierVerification from "./pages/admin/SupplierVerification";
import ProductApproval from "./pages/admin/ProductApproval";
import OrderDisputes from "./pages/admin/OrderDisputes";
import PlatformAnalytics from "./pages/admin/PlatformAnalytics";

/* ================= ROLE CHECK ================= */
const getRole = () => sessionStorage.getItem("ROLE");

const BuyerRoute = ({ children }) =>
  getRole() === "buyer" ? children : <Navigate to="/login" replace />;

const SupplierRoute = ({ children }) =>
  getRole() === "supplier" ? children : <Navigate to="/login" replace />;

const AdminRoute = ({ children }) =>
  getRole() === "admin" ? children : <Navigate to="/login" replace />;

function App() {
  return (
    <BrowserRouter>
      <FavoritesProvider>
        <Routes>

          {/* ROOT REDIRECT */}
          <Route
            path="/"
            element={
              <Navigate
                to={
                  getRole() === "buyer"
                    ? "/buyer"
                    : getRole() === "supplier"
                    ? "/supplier"
                    : getRole() === "admin"
                    ? "/admin/dashboard"
                    : "/home"
                }
                replace
              />
            }
          />

          {/* PUBLIC */}
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* BUYER */}
          <Route path="/buyer" element={<BuyerRoute><BuyerLayout /></BuyerRoute>}>
            <Route index element={<BuyerDashboard />} />
            <Route path="products" element={<ProductCatalog />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="cart" element={<Cart />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="order-success" element={<OrderSuccess />} />
          </Route>

          {/* SUPPLIER */}
          <Route path="/supplier" element={<SupplierRoute><SupplierDashboardHub /></SupplierRoute>} />
          <Route path="/supplier/add-product" element={<SupplierRoute><SupplierAddProduct /></SupplierRoute>} />
          <Route path="/supplier/inventory" element={<SupplierRoute><SupplierInventory /></SupplierRoute>} />
          <Route path="/supplier/orders" element={<SupplierRoute><SupplierOrders /></SupplierRoute>} />
          <Route path="/supplier/invoices" element={<SupplierRoute><SupplierInvoices /></SupplierRoute>} />
          <Route path="/supplier/profile" element={<SupplierRoute><SupplierProfile /></SupplierRoute>} />

          {/* ADMIN */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardHub /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/suppliers" element={<AdminRoute><SupplierVerification /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><ProductApproval /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><OrderDisputes /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><PlatformAnalytics /></AdminRoute>} />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </FavoritesProvider>
    </BrowserRouter>
  );
}

export default App;