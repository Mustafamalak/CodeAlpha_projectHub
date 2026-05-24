import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import {
    Folder,
    CheckSquare,
    Clock,
    AlertTriangle,
    AlertCircle,
    ArrowRight,
    Plus,
    FolderPlus,
    Activity,
    UserCheck,
    CheckCircle2
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await api.get("/tasks/dashboard/summary");
                setSummary(data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || "Failed to load dashboard metrics.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Format Date string helper
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <main className="page dashboard-page-loading">
                <Loader text="Loading your dashboard summary..." />
            </main>
        );
    }

    if (error) {
        return (
            <main className="page dashboard-page-error">
                <div className="container">
                    <div className="form-error" style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
                        <h3 style={{ marginBottom: "10px" }}>Error Loading Dashboard</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="page dashboard-page">
            <div className="container">
                {/* Welcome Header */}
                <header className="dashboard-header">
                    <div>
                        <span className="badge">Workspace Dashboard</span>
                        <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
                        <p className="dashboard-subtitle">
                            {user?.position ? `${user.position} • ` : ""}Manage and track your project assignments.
                        </p>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-actions">
                        <Link to="/projects" className="btn btn-primary dash-action-btn">
                            <FolderPlus size={16} />
                            <span>Create Project</span>
                        </Link>
                        <Link to="/my-tasks" className="btn btn-secondary dash-action-btn">
                            <CheckSquare size={16} />
                            <span>View My Tasks</span>
                        </Link>
                    </div>
                </header>

                {/* Summary Metrics Grid */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon-wrapper blue">
                            <Folder size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Total Projects</span>
                            <span className="stat-value">{summary?.totalProjects || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper indigo">
                            <CheckSquare size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Total Tasks</span>
                            <span className="stat-value">{summary?.totalTasks || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper slate">
                            <Activity size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Todo Tasks</span>
                            <span className="stat-value">{summary?.todoTasks || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper amber">
                            <Clock size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">In Progress</span>
                            <span className="stat-value">{summary?.inProgressTasks || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper green">
                            <CheckCircle2 size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Done Tasks</span>
                            <span className="stat-value">{summary?.doneTasks || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper red">
                            <AlertCircle size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">High Priority</span>
                            <span className="stat-value">{summary?.highPriorityTasks || 0}</span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-wrapper rose">
                            <AlertTriangle size={20} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Overdue Tasks</span>
                            <span className="stat-value">{summary?.overdueTasks || 0}</span>
                        </div>
                    </div>
                </div>

                {/* Two-Column Section: Projects & Tasks */}
                <div className="dashboard-columns">
                    {/* Left Column: Recent Projects */}
                    <div className="dashboard-column-item">
                        <div className="section-header-flex">
                            <h2 className="section-title-alt">Recent Projects</h2>
                            <Link to="/projects" className="view-all-link">
                                <span>All Projects</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="list-container">
                            {summary?.recentProjects && summary.recentProjects.length > 0 ? (
                                summary.recentProjects.map((project) => (
                                    <div key={project._id} className="item-row card">
                                        <div className="item-row-info">
                                            <h3 className="item-row-name">{project.name}</h3>
                                            <span className="item-row-sub">{project.category}</span>
                                        </div>
                                        <div className="item-row-badges">
                                            <span className={`badge-priority ${project.priority.toLowerCase()}`}>
                                                {project.priority}
                                            </span>
                                            <Link to={`/projects/${project._id}`} className="item-row-link">
                                                <ArrowRight size={16} />
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-small card">
                                    <Folder size={24} className="empty-state-icon" />
                                    <h4>No projects active</h4>
                                    <p>You have not joined any project workspaces yet.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Recent Tasks */}
                    <div className="dashboard-column-item">
                        <div className="section-header-flex">
                            <h2 className="section-title-alt">Recent Tasks</h2>
                            <Link to="/my-tasks" className="view-all-link">
                                <span>My Tasks</span>
                                <ArrowRight size={14} />
                            </Link>
                        </div>

                        <div className="list-container">
                            {summary?.recentTasks && summary.recentTasks.length > 0 ? (
                                summary.recentTasks.map((task) => (
                                    <div key={task._id} className="item-row card">
                                        <div className="item-row-info">
                                            <h3 className="item-row-name">{task.title}</h3>
                                            <span className="item-row-sub">{task.project?.name || "No Project"}</span>
                                        </div>
                                        <div className="item-row-badges">
                                            <span className={`badge-priority ${task.priority.toLowerCase()}`}>
                                                {task.priority}
                                            </span>
                                            <span className={`badge-status ${task.status.replace(" ", "").toLowerCase()}`}>
                                                {task.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-state-small card">
                                    <CheckSquare size={24} className="empty-state-icon" />
                                    <h4>No tasks assigned</h4>
                                    <p>You have no current task assignments.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Dashboard;
