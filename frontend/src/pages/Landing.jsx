import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <Link to="/" className="logo">InternHub</Link>
        <div className="nav-links">
          <Link to="/intern/login">Intern Sign In</Link>
          <Link to="/employer/login">Employer Sign In</Link>
        </div>
      </nav>

      <main className="landing-hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Find internships or hire talent</h1>
          <p>InternHub connects students with companies. Choose your path below.</p>
        </motion.div>
      </main>

      <section className="landing-choices">
        <h2>I want to...</h2>
        <div className="choices-grid">
          <motion.div
            className="choice-card choice-card--intern"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <span className="choice-icon">🎓</span>
            <h3>Find an internship</h3>
            <p>I'm a student or candidate looking for internships.</p>
            <div className="choice-actions">
              <Link to="/intern/register" className="choice-btn choice-btn--primary">Create account</Link>
              <Link to="/intern/login" className="choice-btn choice-btn--ghost">Sign in</Link>
            </div>
          </motion.div>
          <motion.div
            className="choice-card choice-card--employer"
            whileHover={{ y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <span className="choice-icon">🏢</span>
            <h3>Hire interns</h3>
            <p>I'm a company or employer and want to post jobs.</p>
            <div className="choice-actions">
              <Link to="/employer/register" className="choice-btn choice-btn--employer">Create company account</Link>
              <Link to="/employer/login" className="choice-btn choice-btn--ghost">Employer sign in</Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="landing-features">
        <h2>Why InternHub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎯</span>
            <h3>Curated listings</h3>
            <p>Hand-picked internships from verified companies.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Quick apply</h3>
            <p>One-click applications. Track status in your dashboard.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🏢</span>
            <h3>For employers</h3>
            <p>Post roles and manage applicants from one place.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <p>© InternHub. For interns and employers.</p>
      </footer>
    </div>
  );
}
