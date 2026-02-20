import React, { useEffect, useState } from "react";
import API from "../services/api";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const internId = localStorage.getItem("internId");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get(`/intern/dashboard/${internId}`);
        setApplications(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchApplications();
  }, [internId]);

  return (
    <div style={styles.container}>
      <h1>Your Applications</h1>

      {applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app._id} style={styles.card}>
            <h3>{app.internshipId.title}</h3>
            <p>{app.internshipId.company}</p>
            <p>{app.internshipId.location}</p>
          </div>
        ))
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    padding: "40px",
    background: "#f3f4f6",
    fontFamily: "Poppins"
  },
  card: {
    background: "white",
    padding: "20px",
    marginBottom: "15px",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
  }
};

export default Dashboard;
