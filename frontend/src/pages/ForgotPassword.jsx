import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/forgot-password", { email });

      setMessage(res.data.message || "Reset token generated.");

      // The backend currently returns the reset token directly in the
      // response (instead of emailing it) so it can be used in this demo.
      // In production this token would only ever be sent via email.
      if (res.data.resetToken) {
        setTimeout(() => {
          navigate(`/reset-password?token=${res.data.resetToken}`);
        }, 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>

      <p className="auth-helper-text">
        Enter the email associated with your account and we'll generate a
        password reset link.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p>
        Remembered your password? <Link to="/">Back to Login</Link>
      </p>
    </div>
  );
}

export default ForgotPassword;
