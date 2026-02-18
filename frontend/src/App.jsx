import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import InternLogin from "./pages/intern/InternLogin";
import InternRegister from "./pages/intern/InternRegister";
import EmployerLogin from "./pages/employer/EmployerLogin";
import EmployerRegister from "./pages/employer/EmployerRegister";
import InternDashboard from "./pages/InternDashboard";
import MyApplications from "./pages/MyApplications";
import InternshipDetail from "./pages/InternshipDetail";
import AdminDashboard from "./pages/AdminDashboard";

function ProtectedIntern({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-dark)", color: "var(--text-muted)" }}>
        Loading…
      </div>
    );
  }
  if (!token) return <Navigate to="/intern/login" replace />;
  if (!user || user.role !== "intern") {
    return <Navigate to={user?.role === "admin" ? "/employer" : "/intern/login"} replace />;
  }
  return children;
}

function ProtectedEmployer({ children }) {
  const { user, token, loading } = useAuth();
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-dark)", color: "var(--text-muted)" }}>
        Loading…
      </div>
    );
  }
  if (!token) return <Navigate to="/employer/login" replace />;
  if (!user || user.role !== "admin") {
    return <Navigate to={user?.role === "intern" ? "/intern" : "/employer/login"} replace />;
  }
  return children;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Navigate to="/intern/login" replace />} />
      <Route path="/register" element={<Navigate to="/intern/register" replace />} />
      <Route path="/admin" element={<Navigate to="/employer" replace />} />

      <Route path="/intern/login" element={<InternLogin />} />
      <Route path="/intern/register" element={<InternRegister />} />
      <Route path="/intern" element={<ProtectedIntern><InternDashboard /></ProtectedIntern>} />
      <Route path="/intern/applications" element={<ProtectedIntern><MyApplications /></ProtectedIntern>} />
      <Route path="/intern/job/:id" element={<ProtectedIntern><InternshipDetail /></ProtectedIntern>} />

      <Route path="/employer/login" element={<EmployerLogin />} />
      <Route path="/employer/register" element={<EmployerRegister />} />
      <Route path="/employer" element={<ProtectedEmployer><AdminDashboard /></ProtectedEmployer>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
