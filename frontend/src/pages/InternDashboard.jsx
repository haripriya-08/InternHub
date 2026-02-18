import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./InternDashboard.css";

export default function InternDashboard() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || user?.role !== "intern") {
      navigate("/intern/login");
      return;
    }
    const fetchData = async () => {
      try {
        const [internshipsRes, applicationsRes] = await Promise.all([
          API.get("/internships"),
          API.get("/applications/me"),
        ]);
        setInternships(internshipsRes.data);
        setApplications(applicationsRes.data);
      } catch (err) {
        if (err.response?.status === 401) navigate("/intern/login");
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

  const appliedIds = new Set(applications.map((a) => a.internship?._id));

  const filtered = internships.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.company?.toLowerCase().includes(search.toLowerCase())
  );

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
            <Link to="/intern" className="dash-link">Dashboard</Link>
            <Link to="/intern/applications" className="dash-link">My Applications</Link>
            <span className="dash-user">Hi, {user?.name}</span>
            <button onClick={handleLogout} className="dash-logout">Logout</button>
          </nav>
        </div>
      </header>

      <main className="dash-main">
        <div className="profile-card">
          <h2 className="profile-title">My Profile</h2>
          <p><strong>{user?.name}</strong></p>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-role">Intern</p>
        </div>
        <h1 className="dash-title">Explore Internships</h1>
        <p className="dash-subtitle">Apply to roles and track your applications.</p>

        <input
          type="text"
          placeholder="Search by title or company..."
          className="dash-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="dash-grid">
          {filtered.map((job, index) => (
            <motion.div
              key={job._id}
              className="intern-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <div className="intern-card-header">
                <h3>{job.title}</h3>
                {job.stipend && <span className="intern-stipend">{job.stipend}</span>}
              </div>
              <p className="intern-company">{job.company}</p>
              <p className="intern-location">{job.location}</p>
              <p className="intern-desc">{job.description?.slice(0, 100)}…</p>
              {appliedIds.has(job._id) ? (
                <span className="intern-applied">Applied</span>
              ) : (
                <Link to={`/intern/job/${job._id}`} className="intern-apply-btn">Apply Now</Link>
              )}
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="dash-empty">No internships match your search.</p>
        )}
      </main>
    </div>
  );
}
