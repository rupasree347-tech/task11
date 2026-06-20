import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function InstructorDashboard() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter only Student role
      const studentList = res.data.users.filter((u) => u.role === "Student");
      setStudents(studentList);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load student records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusToggle = async (student) => {
    const newStatus = student.status === "Active" ? "Inactive" : "Active";
    try {
      const token = localStorage.getItem("token");
      await api.put(
        `/users/${student.id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccessMsg(`${student.name}'s status updated to ${newStatus}`);
      setTimeout(() => setSuccessMsg(""), 3000);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update status");
    }
  };

  return (
    <DashboardLayout>
      <h1>Instructor Dashboard</h1>

      <div className="dashboard-grid" style={{ marginTop: "20px" }}>
        <div className="card" style={{ marginTop: 0 }}>
          <h3>Total Students</h3>
          <h2 style={{ fontSize: "2rem", marginTop: "8px" }}>{students.length}</h2>
        </div>
        <div className="card" style={{ marginTop: 0 }}>
          <h3>Active Students</h3>
          <h2 style={{ fontSize: "2rem", marginTop: "8px" }}>
            {students.filter((s) => s.status === "Active").length}
          </h2>
        </div>
        <div className="card" style={{ marginTop: 0 }}>
          <h3>Inactive Students</h3>
          <h2 style={{ fontSize: "2rem", marginTop: "8px" }}>
            {students.filter((s) => s.status === "Inactive").length}
          </h2>
        </div>
      </div>

      {error && <p className="form-error" style={{ marginTop: "16px" }}>{error}</p>}
      {successMsg && <p className="form-success" style={{ marginTop: "16px" }}>{successMsg}</p>}

      <div className="card">
        <h3>Student Records</h3>
        <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
          Manage and view all enrolled student records
        </p>

        {loading ? (
          <p style={{ marginTop: "16px" }}>Loading student records...</p>
        ) : students.length === 0 ? (
          <p style={{ marginTop: "16px", color: "#6b7280" }}>No student records found.</p>
        ) : (
          <div className="table-scroll" style={{ marginTop: "16px" }}>
            <table className="data-table">
              <thead>
                <tr style={{ background: "#f9fafb" }}>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Last Login</th>
                  <th>Enrolled On</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <span
                        style={{
                          padding: "3px 10px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          background: student.status === "Active" ? "#d1fae5" : "#fee2e2",
                          color: student.status === "Active" ? "#065f46" : "#991b1b",
                        }}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td>
                      {student.last_login
                        ? new Date(student.last_login).toLocaleString()
                        : "Never"}
                    </td>
                    <td>
                      {student.created_at
                        ? new Date(student.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td>
                      <button
                        className="status-btn"
                        style={{
                          background: student.status === "Active" ? "#fee2e2" : "#d1fae5",
                          color: student.status === "Active" ? "#991b1b" : "#065f46",
                        }}
                        onClick={() => handleStatusToggle(student)}
                      >
                        {student.status === "Active" ? "Deactivate" : "Activate"}
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

export default InstructorDashboard;
