import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
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
      <h1>Manager Dashboard</h1>
      <p style={{ color: "#6b7280", marginTop: "4px", fontSize: "14px" }}>
        Dashboard reports, user activity and overall system status.
      </p>

      {error && <p className="form-error" style={{ marginTop: "16px" }}>{error}</p>}

      {!stats ? (
        <p style={{ marginTop: "20px" }}>Loading...</p>
      ) : (
        <>
          {/* Summary Stats */}
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
          <div className="card">
            <h3>Users by Role</h3>
            <div style={{ marginTop: "16px" }}>
              {stats.usersByRole.map((r) => {
                const pct = Math.round((r.count / stats.totalUsers) * 100) || 0;
                const palette = roleColors[r.role] || { bg: "#f3f4f6", color: "#374151" };
                return (
                  <div
                    key={r.role}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      padding: "12px 0",
                      borderBottom: "1px solid #f3f4f6",
                    }}
                  >
                    <span
                      style={{
                        minWidth: "90px",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textAlign: "center",
                        background: palette.bg,
                        color: palette.color,
                      }}
                    >
                      {r.role}
                    </span>
                    <div style={{ flex: 1, background: "#f3f4f6", borderRadius: "4px", height: "10px" }}>
                      <div
                        style={{
                          width: `${pct}%`,
                          height: "100%",
                          background: palette.color,
                          borderRadius: "4px",
                        }}
                      />
                    </div>
                    <span style={{ minWidth: "60px", textAlign: "right", fontWeight: "700", fontSize: "14px" }}>
                      {r.count} <span style={{ color: "#9ca3af", fontWeight: "400" }}>({pct}%)</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Login Statistics */}
          <div className="card">
            <h3>Login Statistics</h3>
            <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px" }}>
              <div
                style={{
                  padding: "16px",
                  background: "#f0fdf4",
                  borderRadius: "8px",
                  borderLeft: "4px solid #16a34a",
                }}
              >
                <p style={{ color: "#6b7280", fontSize: "12px" }}>Total Login Events</p>
                <p style={{ fontWeight: "700", fontSize: "1.5rem", marginTop: "4px" }}>{stats.totalLogins}</p>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "#eff6ff",
                  borderRadius: "8px",
                  borderLeft: "4px solid #2563eb",
                }}
              >
                <p style={{ color: "#6b7280", fontSize: "12px" }}>Registered Users</p>
                <p style={{ fontWeight: "700", fontSize: "1.5rem", marginTop: "4px" }}>{stats.totalUsers}</p>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "#fefce8",
                  borderRadius: "8px",
                  borderLeft: "4px solid #ca8a04",
                }}
              >
                <p style={{ color: "#6b7280", fontSize: "12px" }}>Avg Logins / User</p>
                <p style={{ fontWeight: "700", fontSize: "1.5rem", marginTop: "4px" }}>
                  {stats.totalUsers > 0
                    ? (parseInt(stats.totalLogins) / parseInt(stats.totalUsers)).toFixed(1)
                    : "0"}
                </p>
              </div>
              <div
                style={{
                  padding: "16px",
                  background: "#fdf2f8",
                  borderRadius: "8px",
                  borderLeft: "4px solid #9333ea",
                }}
              >
                <p style={{ color: "#6b7280", fontSize: "12px" }}>Active Rate</p>
                <p style={{ fontWeight: "700", fontSize: "1.5rem", marginTop: "4px" }}>
                  {stats.totalUsers > 0
                    ? Math.round((parseInt(stats.activeUsers) / parseInt(stats.totalUsers)) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Manager Access info */}
          <div className="card">
            <h3>Manager Access</h3>
            <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>
              As a Manager, you have read access to dashboard analytics including user counts,
              role distribution, and login statistics. For user management and role assignments,
              please contact an Admin.
            </p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default ManagerDashboard;
