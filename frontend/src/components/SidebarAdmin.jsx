import { Link } from "react-router-dom";

const SidebarAdmin = () => {
  return (
    <aside className="sidebar">
      <h3>Admin Panel</h3>
      <nav>
        <Link to="/admin/dashboard">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/orders">Orders</Link>
        <Link to="/admin/product-approval">Product Approval</Link>
        <Link to="/admin/supplier-verification">Supplier Verification</Link>
        <Link to="/admin/analytics">Analytics</Link>
        <Link to="/admin/settings">Settings</Link>
      </nav>
    </aside>
  );
};

export default SidebarAdmin;
