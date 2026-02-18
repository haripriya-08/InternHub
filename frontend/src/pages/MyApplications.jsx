import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./InternDashboard.css";

const statusColors = {
  pending: { bg: "rgba(234, 179, 8, 0.2)", color: "#facc15" },
  accepted: { bg: "rgba(34, 197, 94, 0.2)", color: "#4ade80" },
  rejected: { bg: "rgba(239, 68, 68, 0.2)", color: "#f87171" },
};

export default function MyApplications() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== "intern") {
      navigate("/intern/login");
      return;
    }
    API.get("/applications/me")
      .then((res) => setApplications(res.data))
      .catch(() => navigate("/intern/login"))
      .finally(() => setLoading(false));
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="intern-dash">
        <div className="dash-loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="intern-dash">
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/intern" className="dash-logo">InternHub</Link>
          <nav className="dash-nav">
            <span className="dash-user">Hi, {user?.name}</span>
            <Link to="/intern" className="dash-link">Browse Internships</Link>
            <button onClick={handleLogout} className="dash-logout">Logout</button>
          </nav>
        </div>
      </header>

      <main className="dash-main">
        <h1 className="dash-title">My Applications</h1>
        <p className="dash-subtitle">Track status of your applications.</p>

        <div className="dash-grid">
          {applications.map((app, index) => {
            const job = app.internship;
            const statusStyle = statusColors[app.status] || statusColors.pending;
            if (!job) return null;
            return (
              <motion.div
                key={app._id}
                className="intern-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="intern-card-header">
                  <h3>{job.title}</h3>
                  <span
                    style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: "0.25rem 0.6rem",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      textTransform: "capitalize",
                    }}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="intern-company">{job.company}</p>
                <p className="intern-location">{job.location}</p>
                <Link to={`/intern/job/${job._id}`} className="intern-apply-btn" style={{ marginTop: "0.5rem" }}>
                  View Details
                </Link>
              </motion.div>
            );
          })}
        </div>

        {applications.length === 0 && (
          <p className="dash-empty">
            You haven't applied to any internships yet.{" "}
            <Link to="/intern" style={{ color: "var(--accent)" }}>Browse openings</Link>.
          </p>
        )}
      </main>
    </div>
  );
}
