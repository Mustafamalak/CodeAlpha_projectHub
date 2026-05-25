import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { KanbanSquare, ArrowRight } from "lucide-react";
import "./Auth.css";

const Signup = () => {
  const { user, signup, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [position, setPosition] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPosition = position.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (cleanName.length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (cleanPosition && cleanPosition.length < 2) {
      setError("Position must be at least 2 characters");
      return;
    }

    try {
      await signup({
        name: cleanName,
        email: cleanEmail,
        password,
        position: cleanPosition || "Team Member",
      });

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Registration failed. Please check your details and try again."
      );
    }
  };

  return (
    <main className="page auth-page">
      <div className="card auth-card">
        <div className="auth-header">
          <div className="auth-logo-wrapper">
            <KanbanSquare size={32} />
          </div>
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">
            Get started with ProjectHub today
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name <span style={{ color: "#ef4444" }}>*</span>
            </label>

            <input
              type="text"
              id="name"
              name="name"
              className="input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span style={{ color: "#ef4444" }}>*</span>
            </label>

            <input
              type="email"
              id="email"
              name="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="position">
              Job Position
            </label>

            <input
              type="text"
              id="position"
              name="position"
              className="input"
              placeholder="e.g. Frontend Developer"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password <span style={{ color: "#ef4444" }}>*</span>
            </label>

            <input
              type="password"
              id="password"
              name="password"
              className="input"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary auth-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Sign Up</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account? </span>
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default Signup;