import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        "/users/dashboard/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard stats");
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <h1>Admin Dashboard</h1>

      {error && <p className="form-error">{error}</p>}

      {!stats ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="dashboard-grid">

            <div className="card">
              <h3>Total Users</h3>
              <h2>{stats.totalUsers}</h2>
            </div>

            <div className="card">
              <h3>Active Users</h3>
              <h2>{stats.activeUsers}</h2>
            </div>

            <div className="card">
              <h3>Total Logins</h3>
              <h2>{stats.totalLogins}</h2>
            </div>

          </div>

          <div className="card">
            <h3>Users By Role</h3>

            {stats.usersByRole.map((role) => (
              <p key={role.role}>
                {role.role} : {role.count}
              </p>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default AdminDashboard;
