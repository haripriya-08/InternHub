import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import "../Auth.css";

export default function InternRegister() {
  const [name, setName] = useState("");
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
      const { data } = await API.post("/auth/register", {
        name,
        email,
        password,
        role: "intern",
      });
      login(data.token, data.user);
      window.location.href = "/intern";
    } catch (err) {
      const msg = err.response?.data?.message;
      const networkMsg = !err.response && err.message
        ? "Cannot reach server. Is the backend running?"
        : null;
      setError(msg || networkMsg || "Registration failed. Please try again.");
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
        <h1>Create your account</h1>
        <p className="auth-subtitle">Start applying for internships today</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
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
          Already have an account? <Link to="/intern/login">Sign In</Link>
        </p>
        <p className="auth-back">
          <Link to="/">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
