import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { KanbanSquare, ArrowRight } from "lucide-react";
import "./Auth.css";

const Signup = () => {
    const { signup, loading } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [position, setPosition] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (name.trim().length < 2) {
            setError("Name must be at least 2 characters long.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        try {
            await signup({
                name,
                email,
                password,
                position: position || undefined,
            });
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. User may already exist.");
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
                    <p className="auth-subtitle">Get started with ProjectHub today</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">
                            Full Name <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
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
                            Job Position (Optional)
                        </label>
                        <select
                            id="position"
                            className="input"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            disabled={loading}
                            style={{ appearance: "none" }}
                        >
                            <option value="">Select your position</option>
                            <option value="Project Manager">Project Manager</option>
                            <option value="Frontend Developer">Frontend Developer</option>
                            <option value="Backend Developer">Backend Developer</option>
                            <option value="UI/UX Designer">UI/UX Designer</option>
                            <option value="QA Engineer">QA Engineer</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">
                            Password <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            type="password"
                            id="password"
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
