import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { KanbanSquare, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import api from "../api/axios.js";
import "./Auth.css";

const ResetPassword = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { token } = useParams();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate("/dashboard", { replace: true });
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setSuccess(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Password reset failed. The token may be invalid or expired."
            );
        } finally {
            setLoading(false);
        }
    };

    // ── Success state ──
    if (success) {
        return (
            <main className="page auth-page">
                <div className="card auth-card">
                    <div className="auth-header">
                        <div className="auth-logo-wrapper" style={{ background: "rgba(5,150,105,0.08)", color: "#059669" }}>
                            <CheckCircle2 size={32} />
                        </div>
                        <h2 className="auth-title">Password updated!</h2>
                        <p className="auth-subtitle">
                            Your password has been reset successfully. You can now log in with your new password.
                        </p>
                    </div>

                    <Link
                        to="/login"
                        className="btn btn-primary auth-btn"
                        style={{ marginTop: "8px" }}
                    >
                        <span>Go to Login</span>
                        <ArrowRight size={16} />
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="page auth-page">
            <div className="card auth-card">
                <div className="auth-header">
                    <div className="auth-logo-wrapper">
                        <KanbanSquare size={32} />
                    </div>
                    <h2 className="auth-title">Set new password</h2>
                    <p className="auth-subtitle">
                        Create a strong password for your account.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* New Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="new-password">
                            New Password
                        </label>
                        <div className="input-icon-wrap input-icon-right">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="new-password"
                                className="input input-with-icon-right"
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                autoFocus
                            />
                            <button
                                type="button"
                                className="input-icon-btn"
                                onClick={() => setShowPassword((p) => !p)}
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {/* Strength indicator */}
                        {password.length > 0 && (
                            <div className="password-strength-row">
                                <div className="strength-bars">
                                    <div className={`strength-bar ${password.length >= 1 ? "active weak" : ""}`} />
                                    <div className={`strength-bar ${password.length >= 6 ? "active medium" : ""}`} />
                                    <div className={`strength-bar ${password.length >= 10 ? "active strong" : ""}`} />
                                </div>
                                <span className="strength-label">
                                    {password.length < 6 ? "Too short" : password.length < 10 ? "Good" : "Strong"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label className="form-label" htmlFor="confirm-password">
                            Confirm New Password
                        </label>
                        <div className="input-icon-wrap input-icon-right">
                            <input
                                type={showConfirm ? "text" : "password"}
                                id="confirm-password"
                                className="input input-with-icon-right"
                                placeholder="Re-enter your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="input-icon-btn"
                                onClick={() => setShowConfirm((p) => !p)}
                                tabIndex={-1}
                            >
                                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                        {confirmPassword && password !== confirmPassword && (
                            <p className="input-hint error">Passwords do not match.</p>
                        )}
                        {confirmPassword && password === confirmPassword && password.length >= 6 && (
                            <p className="input-hint success">Passwords match ✓</p>
                        )}
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <button
                        type="submit"
                        className="btn btn-primary auth-btn"
                        disabled={loading || password !== confirmPassword || password.length < 6}
                    >
                        {loading ? (
                            <span>Resetting password...</span>
                        ) : (
                            <>
                                <span>Reset Password</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    <Link to="/forgot-password" className="auth-link">
                        ← Request a new token
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default ResetPassword;
