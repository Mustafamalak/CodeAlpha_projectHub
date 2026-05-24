import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FolderPlus, CheckSquare, TrendingUp, MessageSquare, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import "./Home.css";

const Home = () => {
    const { user } = useAuth();

    return (
        <main className="page home-page">
            <section className="container hero-section">
                <div className="hero-badge">
                    <Zap size={14} className="hero-badge-icon" />
                    <span>ProjectHub Version 1.0</span>
                </div>

                <h1 className="hero-title">
                    Manage projects, tasks and teams in{" "}
                    <span className="gradient-text">one clean workspace.</span>
                </h1>

                <p className="hero-subtitle">
                    Create projects, delegate work, monitor real-time task statuses, and discuss details with comment threads. Built with modern, glassmorphic clarity to keep teams aligned.
                </p>

                <div className="hero-ctas">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="btn btn-primary hero-btn">
                                <span>Go to Dashboard</span>
                                <ArrowRight size={16} />
                            </Link>
                            <Link to="/projects" className="btn btn-secondary hero-btn">
                                <span>View Projects</span>
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/signup" className="btn btn-primary hero-btn">
                                <span>Get Started</span>
                                <ArrowRight size={16} />
                            </Link>
                            <Link to="/login" className="btn btn-secondary hero-btn">
                                <span>Login</span>
                            </Link>
                        </>
                    )}
                </div>

                <div className="hero-dashboard-preview card">
                    <div className="preview-header">
                        <div className="preview-dots">
                            <span className="preview-dot red"></span>
                            <span className="preview-dot yellow"></span>
                            <span className="preview-dot green"></span>
                        </div>
                        <div className="preview-url">projecthub.app/dashboard</div>
                    </div>
                    <div className="preview-body">
                        <div className="preview-sidebar">
                            <div className="preview-side-item active"></div>
                            <div className="preview-side-item"></div>
                            <div className="preview-side-item"></div>
                        </div>
                        <div className="preview-main">
                            <div className="preview-cards">
                                <div className="preview-mini-card">
                                    <div className="preview-mini-title"></div>
                                    <div className="preview-mini-bar"></div>
                                </div>
                                <div className="preview-mini-card">
                                    <div className="preview-mini-title"></div>
                                    <div className="preview-mini-bar"></div>
                                </div>
                                <div className="preview-mini-card">
                                    <div className="preview-mini-title"></div>
                                    <div className="preview-mini-bar"></div>
                                </div>
                            </div>
                            <div className="preview-graph"></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="container features-section">
                <div className="section-header">
                    <span className="badge">Robust Platform</span>
                    <h2 className="section-title">Everything you need to ship projects faster</h2>
                </div>

                <div className="features-grid">
                    <div className="feature-card card">
                        <div className="feature-icon-wrapper blue">
                            <FolderPlus className="feature-icon" size={24} />
                        </div>
                        <h3 className="feature-card-title">Create Projects</h3>
                        <p className="feature-card-desc">
                            Group tasks logically into dedicated projects. Set categories, priorities, and clear deadlines.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="feature-icon-wrapper indigo">
                            <CheckSquare className="feature-icon" size={24} />
                        </div>
                        <h3 className="feature-card-title">Assign Tasks</h3>
                        <p className="feature-card-desc">
                            Delegate responsibilities. Assign tasks to specific project members to maintain individual accountability.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="feature-icon-wrapper cyan">
                            <TrendingUp className="feature-icon" size={24} />
                        </div>
                        <h3 className="feature-card-title">Track Progress</h3>
                        <p className="feature-card-desc">
                            Move tasks across status columns (Todo, In Progress, Done) and monitor live completion percentages.
                        </p>
                    </div>

                    <div className="feature-card card">
                        <div className="feature-icon-wrapper purple">
                            <MessageSquare className="feature-icon" size={24} />
                        </div>
                        <h3 className="feature-card-title">Collaborate with Comments</h3>
                        <p className="feature-card-desc">
                            Ask questions, provide status updates, and discuss details instantly inside nested task comments.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="home-footer">
                <div className="container footer-container">
                    <div className="footer-brand">
                        <KanbanSquare size={20} className="navbar-logo" />
                        <span>ProjectHub</span>
                    </div>
                    <p>© 2026 CodeAlpha ProjectHub. Built for high performance teams.</p>
                </div>
            </footer>
        </main>
    );
};

export default Home;
