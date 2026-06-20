import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;

      if (role === "Admin") navigate("/admin");
      else if (role === "Manager") navigate("/manager");
      else if (role === "Instructor") navigate("/instructor");
      else navigate("/student");

    } catch (err) {

      setError(err.response?.data?.message || "Login failed. Please try again.");

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="auth-container">

      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="form-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>

      <p>
        New User? <Link to="/register">Register</Link>
      </p>

    </div>
  );
}

export default Login;
