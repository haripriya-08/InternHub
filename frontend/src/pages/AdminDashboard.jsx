import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./AdminDashboard.css";

const statusColors = {
  pending: { bg: "rgba(234, 179, 8, 0.2)", color: "#facc15" },
  accepted: { bg: "rgba(34, 197, 94, 0.2)", color: "#4ade80" },
  rejected: { bg: "rgba(239, 68, 68, 0.2)", color: "#f87171" },
};

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [internships, setInternships] = useState([]);
  const [tab, setTab] = useState("post");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    stipend: "",
    duration: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/employer/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [appRes, internRes] = await Promise.all([
          API.get("/applications"),
          API.get("/internships"),
        ]);
        setApplications(appRes.data);
        setInternships(internRes.data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/employer/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, user, navigate]);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post("/internships", form);
      setForm({ title: "", company: "", location: "", description: "", stipend: "", duration: "" });
      const res = await API.get("/internships");
      setInternships(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create internship.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateStatus = async (appId, status) => {
    try {
      await API.patch(`/applications/${appId}`, { status });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status } : a))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update.");
    }
  };

  if (loading) {
    return (
      <div className="admin-dash">
        <div className="admin-loading">Loading…</div>
      </div>
    );
  }

  return (
    <div className="admin-dash">
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/employer" className="dash-logo">InternHub</Link>
          <nav className="dash-nav">
            <span className="dash-user">Employer: {user?.name}</span>
            <button onClick={handleLogout} className="dash-logout">Logout</button>
          </nav>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${tab === "applications" ? "active" : ""}`}
            onClick={() => setTab("applications")}
          >
            Applications
          </button>
          <button
            className={`admin-tab ${tab === "post" ? "active" : ""}`}
            onClick={() => setTab("post")}
          >
            Post Job
          </button>
          <button
            className={`admin-tab ${tab === "jobs" ? "active" : ""}`}
            onClick={() => setTab("jobs")}
          >
            My Jobs
          </button>
        </div>

        {tab === "applications" && (
          <motion.section
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>All Applications</h2>
            {applications.length === 0 ? (
              <p className="admin-empty">No applications yet.</p>
            ) : (
              <div className="admin-app-list">
                {applications.map((app) => {
                  const style = statusColors[app.status] || statusColors.pending;
                  return (
                    <div key={app._id} className="admin-app-card">
                      <div className="admin-app-head">
                        <div>
                          <strong>{app.intern?.name}</strong> ({app.intern?.email})
                        </div>
                        <span
                          style={{
                            background: style.bg,
                            color: style.color,
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
                      <p className="admin-app-role">
                        Applied for: <strong>{app.internship?.title}</strong> at {app.internship?.company}
                      </p>
                      {app.status === "pending" && (
                        <div className="admin-app-actions">
                          <button
                            className="admin-btn accept"
                            onClick={() => updateStatus(app._id, "accepted")}
                          >
                            Accept
                          </button>
                          <button
                            className="admin-btn reject"
                            onClick={() => updateStatus(app._id, "rejected")}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        )}

        {tab === "post" && (
          <motion.section
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>Post New Internship</h2>
            <form onSubmit={handleCreateJob} className="admin-form">
              <input
                type="text"
                placeholder="Job title"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                required
                className="admin-input"
              />
              <input
                type="text"
                placeholder="Company name"
                value={form.company}
                onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                required
                className="admin-input"
              />
              <input
                type="text"
                placeholder="Location (e.g. Remote, Bangalore)"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                required
                className="admin-input"
              />
              <input
                type="text"
                placeholder="Stipend (optional)"
                value={form.stipend}
                onChange={(e) => setForm((f) => ({ ...f, stipend: e.target.value }))}
                className="admin-input"
              />
              <input
                type="text"
                placeholder="Duration (optional)"
                value={form.duration}
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                className="admin-input"
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                required
                rows={4}
                className="admin-textarea"
              />
              <button type="submit" className="admin-submit" disabled={submitting}>
                {submitting ? "Posting…" : "Post Internship"}
              </button>
            </form>
          </motion.section>
        )}

        {tab === "jobs" && (
          <motion.section
            className="admin-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2>Your Posted Jobs</h2>
            {internships.length === 0 ? (
              <p className="admin-empty">You haven't posted any internships yet.</p>
            ) : (
              <div className="dash-grid">
                {internships.map((job) => (
                  <div key={job._id} className="intern-card">
                    <h3>{job.title}</h3>
                    <p className="intern-company">{job.company}</p>
                    <p className="intern-location">{job.location}</p>
                    <p className="intern-desc">{job.description?.slice(0, 80)}…</p>
                  </div>
                ))}
              </div>
            )}
          </motion.section>
        )}
      </main>
    </div>
  );
}
