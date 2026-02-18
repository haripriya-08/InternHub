import { useEffect, useState } from "react";

function Dashboard() {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/internships")
      .then(res => res.json())
      .then(data => setInternships(data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Available Internships</h1>

      <div style={styles.grid}>
        {internships.map((item) => (
          <div key={item._id} style={styles.card}>
            <h2>{item.title}</h2>
            <p><b>Company:</b> {item.company}</p>
            <p><b>Location:</b> {item.location}</p>
            <p><b>Stipend:</b> ₹{item.stipend}</p>
            <button style={styles.button}>Apply</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    padding: "40px",
  },
  heading: {
    color: "white",
    textAlign: "center",
    marginBottom: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
    transition: "0.3s",
  },
  button: {
    marginTop: "10px",
    padding: "10px",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Dashboard;
