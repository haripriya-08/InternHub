import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./Auth.css";

export default function Register() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(roleParam === "admin" ? "admin" : "intern");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    if (roleParam === "admin") setRole("admin");
  }, [roleParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
        role: roleParam === "admin" ? "admin" : role,
      });
      login(data.token, data.user);
      const target = data.user.role === "admin" ? "/admin" : "/intern";
      window.location.href = target;
      return;
    } catch (err) {
      const msg = err.response?.data?.message;
      const networkMsg =
        !err.response && err.message ? "Cannot reach server. Is the backend running on port 5000?" : null;
      setError(msg || networkMsg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="auth-logo">InternHub</Link>
        <h1>Create account</h1>
        <p className="auth-subtitle">
          {roleParam === "admin" ? "Register as employer" : "Join as intern or employer"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}

          {roleParam !== "admin" && (
            <div className="auth-role-toggle">
              <button
                type="button"
                className={`role-btn ${role === "intern" ? "active" : ""}`}
                onClick={() => setRole("intern")}
              >
                Intern
              </button>
              <button
                type="button"
                className={`role-btn ${role === "admin" ? "active" : ""}`}
                onClick={() => setRole("admin")}
              >
                Employer
              </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
            autoComplete="name"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="auth-input"
            autoComplete="new-password"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Creating account…" : "Register"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
