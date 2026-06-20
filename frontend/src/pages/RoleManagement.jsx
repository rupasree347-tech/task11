import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

const ROLES = ["Admin", "Manager", "Instructor", "Student"];

function authHeader() {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
}

function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users", authHeader());
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role }, authHeader());
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const status = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await api.put(`/users/${id}`, { status }, authHeader());
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;

    try {
      await api.delete(`/users/${id}`, authHeader());
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <DashboardLayout>
      <h1>Role Management</h1>

      <div className="card">
        <h3>Access Levels</h3>

        <table className="data-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Access</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Admin</td>
              <td>Full Access</td>
            </tr>
            <tr>
              <td>Manager</td>
              <td>Dashboard Access</td>
            </tr>
            <tr>
              <td>Instructor</td>
              <td>Student Records</td>
            </tr>
            <tr>
              <td>Student</td>
              <td>Personal Profile</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="card">
        <h3>Users</h3>

        {error && <p className="form-error">{error}</p>}

        {loading ? (
          <p>Loading users...</p>
        ) : (
          <div className="table-scroll">
            <table className="data-table">
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
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.id, e.target.value)
                        }
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        className="status-btn"
                        onClick={() =>
                          handleStatusToggle(u.id, u.status)
                        }
                      >
                        {u.status}
                      </button>
                    </td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(u.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RoleManagement;
