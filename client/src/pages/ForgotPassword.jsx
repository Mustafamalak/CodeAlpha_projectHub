import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { KanbanSquare, Mail, ArrowRight, Copy, CheckCheck, AlertTriangle } from "lucide-react";
import api from "../api/axios.js";
import "./Auth.css";

const ForgotPassword = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1: email submitted → Step 2: token shown
    const [step, setStep] = useState(1);
    const [resetToken, setResetToken] = useState("");
    const [copied, setCopied] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate("/dashboard", { replace: true });
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/auth/forgot-password", {
                email: email.trim(),
            });

            if (data.found && data.resetToken) {
                setResetToken(data.resetToken);
                setStep(2);
            } else {
                // Email not found — show generic success (no enumeration)
                setStep(2);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!resetToken) return;
        navigator.clipboard.writeText(resetToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    return (
        <main className="page auth-page">
            <div className="card auth-card">
                <div className="auth-header">
                    <div className="auth-logo-wrapper">
                        <KanbanSquare size={32} />
                    </div>
                    <h2 className="auth-title">
                        {step === 1 ? "Forgot password?" : "Check your email"}
                    </h2>
                    <p className="auth-subtitle">
                        {step === 1
                            ? "Enter your account email and we'll generate a reset token."
                            : "Your password reset token is ready."}
                    </p>
                </div>

                {/* ── Step 1: Email form ── */}
                {step === 1 && (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="forgot-email">
                                Email Address
                            </label>
                            <div className="input-icon-wrap">
                                <Mail size={16} className="input-icon" />
                                <input
                                    type="email"
                                    id="forgot-email"
                                    className="input input-with-icon"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {error && <div className="form-error">{error}</div>}

                        <button
                            type="submit"
                            className="btn btn-primary auth-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <span>Generating token...</span>
                            ) : (
                                <>
                                    <span>Send Reset Token</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {/* ── Step 2: Token display ── */}
                {step === 2 && (
                    <div className="forgot-result">
                        {resetToken ? (
                            <>
                                <div className="forgot-demo-notice">
                                    <AlertTriangle size={14} className="forgot-notice-icon" />
                                    <span>
                                        <strong>Demo mode:</strong> In production, this token
                                        would be sent to your email. Copy it to reset your password.
                                    </span>
                                </div>

                                <div className="forgot-token-box">
                                    <p className="forgot-token-label">Your reset token</p>
                                    <div className="forgot-token-value-row">
                                        <code className="forgot-token-value">{resetToken}</code>
                                        <button
                                            onClick={handleCopy}
                                            className="forgot-copy-btn"
                                            title="Copy token"
                                        >
                                            {copied ? (
                                                <CheckCheck size={16} className="copy-icon-done" />
                                            ) : (
                                                <Copy size={16} />
                                            )}
                                        </button>
                                    </div>
                                    <p className="forgot-token-expiry">⏱ Expires in 1 hour</p>
                                </div>

                                <Link
                                    to={`/reset-password/${resetToken}`}
                                    className="btn btn-primary auth-btn"
                                    style={{ marginTop: "8px" }}
                                >
                                    <span>Reset My Password</span>
                                    <ArrowRight size={16} />
                                </Link>
                            </>
                        ) : (
                            <div className="forgot-generic-msg">
                                <p>
                                    If an account with <strong>{email}</strong> exists, a reset
                                    token has been generated. Please check your email.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div className="auth-footer" style={{ marginTop: step === 2 ? "20px" : undefined }}>
                    <Link to="/login" className="auth-link">
                        ← Back to Login
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ForgotPassword;
