import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Student",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {

      await api.post("/auth/register", form);

      setSuccess("Registration successful! Redirecting to login...");

      setTimeout(() => navigate("/"), 1200);

    } catch (err) {

      setError(err.response?.data?.message || "Registration failed. Please try again.");

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="auth-container">

      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          required
          onChange={handleChange}
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          required
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          required
          minLength={6}
          onChange={handleChange}
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
        >
          <option>Student</option>
          <option>Instructor</option>
          <option>Manager</option>
          <option>Admin</option>
        </select>

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/">Login</Link>
      </p>

    </div>
  );
}

export default Register;
