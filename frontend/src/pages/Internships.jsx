import React, { useEffect, useState } from "react";
import "./Internships.css";
import { motion } from "framer-motion";

function Internships() {
  const [internships, setInternships] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("internId")) {
      window.location.href = "/";
    }

    fetch("http://localhost:3000/api/internships")
      .then((res) => res.json())
      .then((data) => setInternships(data))
      .catch((err) => console.error(err));
  }, []);

  const filtered = internships.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("internId");
    window.location.href = "/";
  };

  return (
    <div className="internship-container">
      <div className="top-bar">
        <h1>Explore Internships</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search internships..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="card-grid">
        {filtered.map((internship, index) => (
          <motion.div
            className="internship-card"
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <img
              src="https://source.unsplash.com/400x250/?technology,office"
              alt="internship"
            />
            <div className="card-content">
              <h2>{internship.title}</h2>
              <p><strong>Company:</strong> {internship.company}</p>
              <p><strong>Location:</strong> {internship.location}</p>
              <button className="apply-btn">Apply Now</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Internships;
