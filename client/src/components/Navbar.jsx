import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { KanbanSquare, Menu, X, LogOut, LayoutDashboard, Folder, CheckSquare, Home } from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    // Add scroll shadow
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getFirstName = (fullName) => {
        if (!fullName) return "";
        return fullName.split(" ")[0];
    };

    return (
        <nav className={`navbar${scrolled ? " navbar-scrolled" : ""}`}>
            <div className="container navbar-container">
                {/* Brand */}
                <Link to="/" className="navbar-brand">
                    <KanbanSquare className="navbar-logo" size={24} />
                    <span>ProjectHub</span>
                </Link>

                {/* Desktop nav links — only shown on desktop */}
                <ul className="navbar-links">
                    <li>
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `navbar-link${isActive ? " active" : ""}`
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    {user && (
                        <>
                            <li>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `navbar-link${isActive ? " active" : ""}`
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/projects"
                                    className={({ isActive }) =>
                                        `navbar-link${isActive ? " active" : ""}`
                                    }
                                >
                                    Projects
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/my-tasks"
                                    className={({ isActive }) =>
                                        `navbar-link${isActive ? " active" : ""}`
                                    }
                                >
                                    My Tasks
                                </NavLink>
                            </li>
                        </>
                    )}
                </ul>

                {/* Desktop actions — only one set, always visible on desktop */}
                <div className="navbar-actions">
                    {user ? (
                        <>
                            <div className="navbar-user">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="navbar-avatar"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                            e.target.nextSibling.style.display = "flex";
                                        }}
                                    />
                                ) : null}
                                <div className="navbar-avatar-fallback">
                                    {getInitials(user.name)}
                                </div>
                                <span className="navbar-username">
                                    {getFirstName(user.name)}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary navbar-logout-btn"
                                title="Logout"
                            >
                                <LogOut size={15} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-secondary navbar-auth-btn">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-primary navbar-auth-btn">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Hamburger — mobile only */}
                <button
                    className="navbar-toggle"
                    onClick={() => setMobileOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileOpen && (
                <div className="mobile-drawer">
                    <nav className="mobile-nav-links">
                        <NavLink
                            to="/"
                            end
                            className={({ isActive }) =>
                                `mobile-nav-link${isActive ? " active" : ""}`
                            }
                        >
                            <Home size={17} />
                            Home
                        </NavLink>
                        {user && (
                            <>
                                <NavLink
                                    to="/dashboard"
                                    className={({ isActive }) =>
                                        `mobile-nav-link${isActive ? " active" : ""}`
                                    }
                                >
                                    <LayoutDashboard size={17} />
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    to="/projects"
                                    className={({ isActive }) =>
                                        `mobile-nav-link${isActive ? " active" : ""}`
                                    }
                                >
                                    <Folder size={17} />
                                    Projects
                                </NavLink>
                                <NavLink
                                    to="/my-tasks"
                                    className={({ isActive }) =>
                                        `mobile-nav-link${isActive ? " active" : ""}`
                                    }
                                >
                                    <CheckSquare size={17} />
                                    My Tasks
                                </NavLink>
                            </>
                        )}
                    </nav>

                    <div className="mobile-drawer-actions">
                        {user ? (
                            <>
                                <div className="mobile-user-info">
                                    <div className="navbar-avatar-fallback mobile-avatar">
                                        {getInitials(user.name)}
                                    </div>
                                    <div>
                                        <p className="mobile-user-name">{user.name}</p>
                                        <p className="mobile-user-pos">{user.position || user.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="btn btn-secondary mobile-logout"
                                >
                                    <LogOut size={15} />
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn btn-secondary mobile-auth-btn">
                                    Login
                                </Link>
                                <Link to="/signup" className="btn btn-primary mobile-auth-btn">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
