import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      <h1>Student Dashboard</h1>

      {error && <p className="form-error" style={{ marginTop: "16px" }}>{error}</p>}

      {!user ? (
        <p style={{ marginTop: "20px" }}>Loading...</p>
      ) : (
        <>
          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "#1f2937",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "700",
                flexShrink: 0,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ marginBottom: "4px" }}>{user.name}</h2>
              <p style={{ color: "#6b7280", fontSize: "14px" }}>{user.email}</p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: "6px",
                  padding: "3px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: "#dbeafe",
                  color: "#1e40af",
                }}
              >
                {user.role}
              </span>
            </div>
          </div>

          <h3 style={{ marginTop: "24px", marginBottom: "4px" }}>Personal Information</h3>

          <div className="dashboard-grid" style={{ marginTop: "12px" }}>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "6px" }}>Full Name</p>
              <p style={{ fontWeight: "600" }}>{user.name}</p>
            </div>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "6px" }}>Email Address</p>
              <p style={{ fontWeight: "600" }}>{user.email}</p>
            </div>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "6px" }}>Role</p>
              <p style={{ fontWeight: "600" }}>{user.role}</p>
            </div>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "6px" }}>Account Status</p>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: user.status === "Active" ? "#d1fae5" : "#fee2e2",
                  color: user.status === "Active" ? "#065f46" : "#991b1b",
                }}
              >
                {user.status}
              </span>
            </div>
            <div className="card" style={{ marginTop: 0 }}>
              <p style={{ color: "#6b7280", fontSize: "13px", marginBottom: "6px" }}>Last Login</p>
              <p style={{ fontWeight: "600" }}>
                {user.last_login
                  ? new Date(user.last_login).toLocaleString()
                  : "First login"}
              </p>
            </div>
          </div>

          <div className="card" style={{ marginTop: "20px" }}>
            <h3>Student Access</h3>
            <p style={{ color: "#6b7280", marginTop: "8px", fontSize: "14px" }}>
              As a student, you can view your personal profile and track your account activity.
              For course-related queries, please contact your instructor.
            </p>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}

export default StudentDashboard;
