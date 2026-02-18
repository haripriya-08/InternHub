import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./Auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login(data.token, data.user);
      const target =
        data.user.role === "admin"
          ? "/admin"
          : redirect && redirect !== "/admin"
            ? redirect
            : "/intern";
      window.location.href = target;
      return;
    } catch (err) {
      const msg = err.response?.data?.message;
      const networkMsg =
        !err.response && err.message ? "Cannot reach server. Is the backend running on port 5000?" : null;
      setError(msg || networkMsg || "Login failed. Please try again.");
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
        <h1>Welcome back</h1>
        <p className="auth-subtitle">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
            autoComplete="current-password"
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
