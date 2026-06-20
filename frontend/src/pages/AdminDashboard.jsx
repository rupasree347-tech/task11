import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const [statsRes, usersRes] = await Promise.all([
        api.get("/users/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setStats(statsRes.data);
      // Show 5 most recent users
      const sorted = [...usersRes.data.users].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setRecentUsers(sorted.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleColors = {
    Admin: { bg: "#ede9fe", color: "#5b21b6" },
    Manager: { bg: "#dbeafe", color: "#1e40af" },
    Instructor: { bg: "#fef9c3", color: "#854d0e" },
    Student: { bg: "#d1fae5", color: "#065f46" },
  };

  return (
    <DashboardLayout>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
        Full system overview — manage users, roles, and monitor activity.
      </p>

      {error && <p className="form-error" style={{ marginTop: "16px" }}>{error}</p>}

      {!stats ? (
        <p style={{ marginTop: "20px" }}>Loading...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="dashboard-grid" style={{ marginTop: "20px" }}>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>Total Users</p>
              <h2 style={{ fontSize: "2.2rem", marginTop: "6px" }}>{stats.totalUsers}</h2>
            </div>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>Active Users</p>
              <h2 style={{ fontSize: "2.2rem", marginTop: "6px", color: "#16a34a" }}>
                {stats.activeUsers}
              </h2>
            </div>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>Total Logins</p>
              <h2 style={{ fontSize: "2.2rem", marginTop: "6px", color: "#2563eb" }}>
                {stats.totalLogins}
              </h2>
            </div>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px" }}>Inactive Users</p>
              <h2 style={{ fontSize: "2.2rem", marginTop: "6px", color: "#dc2626" }}>
                {parseInt(stats.totalUsers) - parseInt(stats.activeUsers)}
              </h2>
            </div>
          </div>

          {/* Users by Role */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", flexWrap: "wrap" }}>
            <div className="card">
              <h3>User Distribution by Role</h3>
              <div style={{ marginTop: "16px" }}>
                {stats.usersByRole.map((r) => {
                  const pct = Math.round((r.count / stats.totalUsers) * 100) || 0;
                  const palette = roleColors[r.role] || { bg: "#f3f4f6", color: "#374151" };
                  return (
                    <div key={r.role} style={{ marginBottom: "14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            fontWeight: "600",
                            background: palette.bg,
                            color: palette.color,
                          }}
                        >
                          {r.role}
                        </span>
                        <span style={{ fontWeight: "700" }}>{r.count} ({pct}%)</span>
                      </div>
                      <div style={{ background: "#f3f4f6", borderRadius: "4px", height: "8px" }}>
                        <div
                          style={{
                            width: `${pct}%`,
                            height: "100%",
                            background: palette.color,
                            borderRadius: "4px",
                            transition: "width 0.4s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Login Statistics */}
            <div className="card">
              <h3>Login Statistics</h3>
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#6b7280" }}>Total Login Events</span>
                  <span style={{ fontWeight: "700" }}>{stats.totalLogins}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#6b7280" }}>Total Registered Users</span>
                  <span style={{ fontWeight: "700" }}>{stats.totalUsers}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <span style={{ color: "#6b7280" }}>Active Sessions</span>
                  <span style={{ fontWeight: "700", color: "#16a34a" }}>{stats.activeUsers}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
                  <span style={{ color: "#6b7280" }}>Avg Logins / User</span>
                  <span style={{ fontWeight: "700" }}>
                    {stats.totalUsers > 0
                      ? (parseInt(stats.totalLogins) / parseInt(stats.totalUsers)).toFixed(1)
                      : "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Recently Registered Users</h3>
              <Link
                to="/role-management"
                style={{
                  padding: "7px 14px",
                  background: "#1f2937",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "13px",
                }}
              >
                Manage All Users →
              </Link>
            </div>
            <div className="table-scroll" style={{ marginTop: "14px" }}>
              <table className="data-table">
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => {
                    const palette = roleColors[u.role] || { bg: "#f3f4f6", color: "#374151" };
                    return (
                      <tr key={u.id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>
                          <span
                            style={{
                              padding: "2px 10px",
                              borderRadius: "10px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: palette.bg,
                              color: palette.color,
                            }}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>
                          <span
                            style={{
                              padding: "2px 10px",
                              borderRadius: "10px",
                              fontSize: "12px",
                              fontWeight: "600",
                              background: u.status === "Active" ? "#d1fae5" : "#fee2e2",
                              color: u.status === "Active" ? "#065f46" : "#991b1b",
                            }}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td>{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
