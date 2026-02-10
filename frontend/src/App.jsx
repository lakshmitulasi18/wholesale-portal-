import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import BuyerDashboard from "./pages/BuyerDashboard";
import SupplierDashboard from "./pages/SupplierDashboard";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
