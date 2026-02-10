import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Search, Trash2, UserX, UserCheck, UserPlus
} from "lucide-react";

const API = "http://localhost:5050/api/admin";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [addModal, setAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "buyer"
  });

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios.get(`${API}/users`)
      .then(res => {
        console.log("Users from backend:", res.data);
        setUsers(res.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  /* ================= SAFE FILTER ================= */
  const filteredUsers = users.filter(u =>
    (
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase())
    ) &&
    (roleFilter === "All" || (u.role || "").toLowerCase() === roleFilter.toLowerCase()) &&
    (statusFilter === "All" || u.status === statusFilter)
  );

  /* ================= ACTIONS ================= */
  const toggleStatus = id => {
    axios.put(`${API}/toggle-user-status/${id}`)
      .then(() => fetchUsers());
  };

  const deleteUser = id => {
    if (window.confirm("Delete this user?")) {
      axios.delete(`${API}/delete-user/${id}`)
        .then(() => fetchUsers());
    }
  };

  /* ================= ADD USER ================= */
  const addUser = () => {
    if (!newUser.name || !newUser.email) {
      alert("Fill all fields");
      return;
    }

    axios.post(`${API}/add-user`, newUser)
      .then(() => {
        alert("User added successfully");
        fetchUsers();
        setNewUser({ name: "", email: "", role: "buyer" });
        setAddModal(false);
      })
      .catch(err => {
        console.log(err);
        alert("Error saving user");
      });
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>User Management</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select onChange={e => setRoleFilter(e.target.value)}>
          <option>All</option>
          <option>buyer</option>
          <option>supplier</option>
          <option>admin</option>
        </select>

        <select onChange={e => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Active</option>
          <option>Blocked</option>
        </select>

        <button onClick={() => setAddModal(true)}>
          <UserPlus size={16} /> Add User
        </button>
      </div>

      {loading && <p>Loading users...</p>}

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td>
                <button onClick={() => toggleStatus(u.id)}>
                  {u.status === "Blocked"
                    ? <UserCheck size={14} />
                    : <UserX size={14} />}
                </button>

                <button onClick={() => deleteUser(u.id)}>
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ADD USER MODAL */}
      {addModal && (
        <div style={{
          background: "#00000055",
          position: "fixed",
          inset: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <div style={{ background: "#fff", padding: 20 }}>
            <h3>Add User</h3>

            <input
              placeholder="Name"
              value={newUser.name}
              onChange={e => setNewUser({ ...newUser, name: e.target.value })}
            />

            <input
              placeholder="Email"
              value={newUser.email}
              onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            />

            <select
              value={newUser.role}
              onChange={e => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="buyer">Buyer</option>
              <option value="supplier">Supplier</option>
              <option value="admin">Admin</option>
            </select>

            <button onClick={addUser}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
