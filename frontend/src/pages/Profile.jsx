import { useEffect, useState } from "react";
import api from "../services/api";
import DashboardLayout from "../components/DashboardLayout";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      <h1>User Profile</h1>

      {error && <p className="form-error">{error}</p>}

      {!user ? (
        <p>Loading...</p>
      ) : (
        <div className="card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p>
            <strong>Last Login:</strong>{" "}
            {user.last_login
              ? new Date(user.last_login).toLocaleString()
              : "First login"}
          </p>
          <p><strong>Account Status:</strong> {user.status}</p>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Profile;
