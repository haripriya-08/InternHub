import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import "./InternshipDetails.css";

export default function InternshipDetail() {
  const { id } = useParams();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [applied, setApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [coverMessage, setCoverMessage] = useState("");

  useEffect(() => {
    if (!token || user?.role !== "intern") {
      navigate("/intern/login");
      return;
    }
    const fetchJob = async () => {
      try {
        const res = await API.get(`/internships/${id}`);
        setInternship(res.data);
      } catch {
        setInternship(null);
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, token, user, navigate]);

  useEffect(() => {
    if (!token || !id) return;
    API.get("/applications/me")
      .then((res) => {
        const found = res.data.some((a) => a.internship?._id === id);
        setApplied(found);
      })
      .catch(() => {});
  }, [id, token]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (applied || applying) return;
    setApplyError("");
    setApplying(true);
    try {
      await API.post("/applications", { internshipId: id, coverMessage });
      setApplied(true);
    } catch (err) {
      const msg = err.response?.data?.message;
      const networkMsg = !err.response && err.message
        ? "Cannot reach server. Make sure the backend is running."
        : null;
      setApplyError(msg || networkMsg || "Failed to apply. Try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="details-container">
        <div className="details-loading">Loading…</div>
      </div>
    );
  }

  if (!internship) {
    return (
      <div className="details-container">
        <div className="details-card">
          <h2>Internship not found</h2>
          <Link to="/intern">Back to listings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="details-container">
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/intern" className="dash-logo">InternHub</Link>
          <nav className="dash-nav">
            <span className="dash-user">Hi, {user?.name}</span>
            <Link to="/intern/applications" className="dash-link">My Applications</Link>
            <button onClick={() => { logout(); window.location.href = "/"; }} className="dash-logout">
              Logout
            </button>
          </nav>
        </div>
      </header>

      <motion.div
        className="details-card detail-page"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link to="/intern" className="details-back">← Back to internships</Link>
        <h1>{internship.title}</h1>
        <h3>{internship.company}</h3>
        <div className="details-meta">
          <p><strong>Location:</strong> {internship.location}</p>
          {internship.stipend && <p><strong>Stipend:</strong> {internship.stipend}</p>}
          {internship.duration && <p><strong>Duration:</strong> {internship.duration}</p>}
        </div>
        <p className="description">{internship.description}</p>

        {applied ? (
          <div className="details-applied">You have applied for this role. Check &quot;My Applications&quot; to track status.</div>
        ) : (
          <form onSubmit={handleApply} className="details-apply-form">
            {applyError && <div className="auth-error">{applyError}</div>}
            <label>
              Cover message (optional)
              <textarea
                className="details-textarea"
                value={coverMessage}
                onChange={(e) => setCoverMessage(e.target.value)}
                placeholder="Why do you want this internship?"
                rows={3}
              />
            </label>
            <button type="submit" className="details-apply-btn" disabled={applying}>
              {applying ? "Submitting…" : "Apply Now"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
