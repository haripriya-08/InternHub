import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import "../Auth.css";

export default function InternLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      if (data.user.role === "admin") {
        setError("This is the Intern sign-in. Use Employer sign-in for company accounts.");
        setLoading(false);
        return;
      }
      login(data.token, data.user);
      window.location.href = "/intern";
    } catch (err) {
      const msg = err.response?.data?.message;
      const networkMsg = !err.response && err.message
        ? "Cannot reach server. Is the backend running?"
        : null;
      setError(msg || networkMsg || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card auth-card--intern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="auth-logo">InternHub</Link>
        <p className="auth-badge">For Interns</p>
        <h1>Sign in to your account</h1>
        <p className="auth-subtitle">Find and apply for internships</p>

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
          Don't have an account? <Link to="/intern/register">Register as Intern</Link>
        </p>
        <p className="auth-back">
          <Link to="/">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
