import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { KanbanSquare, Menu, X, LogOut } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate("/");
    };

    const closeMobileMenu = () => {
        setMobileOpen(false);
    };

    // Helper to get first name
    const getFirstName = (fullName) => {
        if (!fullName) return "";
        return fullName.split(" ")[0];
    };

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
                    <KanbanSquare className="navbar-logo" size={26} />
                    <span>ProjectHub</span>
                </Link>

                <div className="navbar-menu">
                    <ul className={`navbar-links ${mobileOpen ? "mobile-open" : ""}`}>
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`
                                }
                                onClick={closeMobileMenu}
                                end
                            >
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`
                                }
                                onClick={closeMobileMenu}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/projects"
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`
                                }
                                onClick={closeMobileMenu}
                            >
                                Projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/my-tasks"
                                className={({ isActive }) =>
                                    `navbar-link ${isActive ? "active" : ""}`
                                }
                                onClick={closeMobileMenu}
                            >
                                My Tasks
                            </NavLink>
                        </li>

                        {/* Mobile action buttons inside mobile list */}
                        <div className="navbar-actions">
                            {user ? (
                                <>
                                    <div className="navbar-user">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="navbar-avatar"
                                        />
                                        <span className="navbar-username">
                                            {getFirstName(user.name)}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="btn btn-secondary"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            padding: "8px 14px",
                                        }}
                                    >
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="btn btn-secondary"
                                        style={{ padding: "8px 16px" }}
                                        onClick={closeMobileMenu}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="btn btn-primary"
                                        style={{ padding: "8px 16px" }}
                                        onClick={closeMobileMenu}
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </ul>

                    {/* Standard actions for desktop */}
                    <div
                        className="navbar-actions"
                        style={{ display: mobileOpen ? "none" : "flex" }}
                    >
                        {user ? (
                            <>
                                <div className="navbar-user">
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="navbar-avatar"
                                    />
                                    <span className="navbar-username">
                                        {getFirstName(user.name)}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                        padding: "8px 14px",
                                    }}
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="btn btn-secondary"
                                    style={{ padding: "8px 16px" }}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="btn btn-primary"
                                    style={{ padding: "8px 16px" }}
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="navbar-toggle"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
