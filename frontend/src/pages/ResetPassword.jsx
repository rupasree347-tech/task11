import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [token, setToken] = useState(searchParams.get("token") || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });

      setMessage(res.data.message || "Password reset successful.");

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid or expired reset token."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Reset Token"
          value={token}
          required
          onChange={(e) => setToken(e.target.value)}
        />

        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          required
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <p>
        <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
}

export default ResetPassword;
