import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import "../Auth.css";

export default function EmployerRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
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
        role: "admin",
      });
      login(data.token, data.user);
      window.location.href = "/employer";
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
        className="auth-card auth-card--employer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/" className="auth-logo">InternHub</Link>
        <p className="auth-badge auth-badge--employer">For Employers</p>
        <h1>Create company account</h1>
        <p className="auth-subtitle">Post internships and hire talent</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="auth-error">{error}</div>}
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="auth-input"
            autoComplete="name"
          />
          <input
            type="text"
            placeholder="Company name (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="auth-input"
          />
          <input
            type="email"
            placeholder="Work email"
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
          <button type="submit" className="auth-btn auth-btn--employer" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/employer/login">Sign In</Link>
        </p>
        <p className="auth-back">
          <Link to="/">← Back to home</Link>
        </p>
      </motion.div>
    </div>
  );
}
