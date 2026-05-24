import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const Placeholder = ({ title }) => {
  return (
    <main className="page">
      <section className="container card" style={{ padding: "34px" }}>
        <span className="badge">ProjectHub</span>

        <h1
          style={{
            marginTop: "14px",
            fontSize: "46px",
            letterSpacing: "-0.06em",
          }}
        >
          {title}
        </h1>

        <p style={{ marginTop: "10px", color: "#64748b", lineHeight: "1.7" }}>
          This page will be completed in the next step.
        </p>
      </section>
    </main>
  );
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Placeholder title="Home Page" />} />
      <Route path="/login" element={<Placeholder title="Login Page" />} />
      <Route path="/signup" element={<Placeholder title="Signup Page" />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Placeholder title="Dashboard Page" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <Placeholder title="Projects Page" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <Placeholder title="Project Details Page" />
          </ProtectedRoute>
        }
      />

      <Route
        path="/my-tasks"
        element={
          <ProtectedRoute>
            <Placeholder title="My Tasks Page" />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;