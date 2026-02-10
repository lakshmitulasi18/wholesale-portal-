import { NavLink } from "react-router-dom";

const SidebarBuyer = () => (
  <aside>
    <NavLink to="/buyer/dashboard">Dashboard</NavLink>
    <NavLink to="/buyer/catalog">Catalog</NavLink>
    <NavLink to="/buyer/cart">Cart</NavLink>
    <NavLink to="/buyer/orders">Orders</NavLink>
    <NavLink to="/buyer/favorites">Favorites</NavLink>
    <NavLink to="/buyer/addresses">Addresses</NavLink>
  </aside>
);

export default SidebarBuyer;
