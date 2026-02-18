import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./InternshipDetails.css";

const internships = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova",
    location: "Remote",
    stipend: "₹10,000/month",
    duration: "3 Months",
    description:
      "Work on real-world React applications. Improve UI/UX and collaborate with backend developers."
  },
  {
    id: 2,
    title: "Backend Developer Intern",
    company: "CodeCraft",
    location: "Bangalore",
    stipend: "₹12,000/month",
    duration: "6 Months",
    description:
      "Build REST APIs using Node.js and MongoDB. Work on authentication and database optimization."
  },
  {
    id: 3,
    title: "UI/UX Design Intern",
    company: "Designify",
    location: "Remote",
    stipend: "₹8,000/month",
    duration: "4 Months",
    description:
      "Design beautiful user interfaces using Figma. Work closely with developers."
  }
];

function InternshipDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const internship = internships.find(
    (intern) => intern.id === parseInt(id)
  );

  if (!internship) {
    return <h2 style={{ textAlign: "center" }}>Internship Not Found</h2>;
  }

  const handleApply = () => {
    alert("Application Submitted Successfully!");
    navigate("/internships");
  };

  return (
    <div className="details-container">
      <div className="details-card">
        <h1>{internship.title}</h1>
        <h3>{internship.company}</h3>
        <p><strong>Location:</strong> {internship.location}</p>
        <p><strong>Stipend:</strong> {internship.stipend}</p>
        <p><strong>Duration:</strong> {internship.duration}</p>
        <p className="description">{internship.description}</p>

        <button onClick={handleApply}>Apply Now</button>
      </div>
    </div>
  );
}

export default InternshipDetails;
