import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function ManagerDashboard() {
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
      <h1>Manager Dashboard</h1>

      {error && <p className="form-error">{error}</p>}

      <div className="card">
        <h3>Manager Access</h3>
        <p>
          Managers can view dashboard reports, user activity and overall
          system status.
        </p>
      </div>

      {stats && (
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
      )}
    </DashboardLayout>
  );
}

export default ManagerDashboard;
