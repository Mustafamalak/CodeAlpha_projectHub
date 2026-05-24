import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { Folder, CheckSquare, Clock, AlertTriangle, ArrowRight } from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <main className="page dashboard-page">
            <div className="container">
                <header className="dashboard-header">
                    <div>
                        <span className="badge">Overview</span>
                        <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
                        <p className="dashboard-subtitle">
                            Here is what's happening with your projects and tasks today.
                        </p>
                    </div>
                </header>

                {/* Dashboard Stats */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon-wrapper blue">
                            <Folder size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Active Projects</span>
                            <span className="stat-value">4</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper indigo">
                            <CheckSquare size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Tasks Assigned</span>
                            <span className="stat-value">3</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper orange">
                            <Clock size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">In Progress</span>
                            <span className="stat-value">0</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper red">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Overdue Tasks</span>
                            <span className="stat-value">0</span>
                        </div>
                    </div>
                </div>

                {/* Recent Projects Section */}
                <section className="dashboard-section">
                    <div className="section-header-flex">
                        <h2 className="section-title-alt">Recent Projects</h2>
                        <Link to="/projects" className="view-all-link">
                            <span>View All Projects</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="projects-grid-alt">
                        <div className="project-card-alt card">
                            <div className="project-card-header">
                                <span className="project-category">Web Development</span>
                                <span className="badge-priority high">High</span>
                            </div>
                            <h3 className="project-card-title">Ecommerce Redesign</h3>
                            <p className="project-card-desc">
                                Overhaul of the main consumer store frontend and checkout system.
                            </p>
                            <Link to="/projects/1" className="btn btn-secondary project-card-btn">
                                Open Project
                            </Link>
                        </div>

                        <div className="project-card-alt card">
                            <div className="project-card-header">
                                <span className="project-category">Artificial Intelligence</span>
                                <span className="badge-priority high">High</span>
                            </div>
                            <h3 className="project-card-title">AI Meeting Summarizer</h3>
                            <p className="project-card-desc">
                                Transcription and automated action items microservice.
                            </p>
                            <Link to="/projects/2" className="btn btn-secondary project-card-btn">
                                Open Project
                            </Link>
                        </div>

                        <div className="project-card-alt card">
                            <div className="project-card-header">
                                <span className="project-category">Mobile App</span>
                                <span className="badge-priority medium">Medium</span>
                            </div>
                            <h3 className="project-card-title">Campus Team Finder</h3>
                            <p className="project-card-desc">
                                Social matchmaking portal for hackathons and group studies.
                            </p>
                            <Link to="/projects/3" className="btn btn-secondary project-card-btn">
                                Open Project
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default Dashboard;
