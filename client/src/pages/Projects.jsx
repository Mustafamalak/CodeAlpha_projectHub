import { useState, useEffect } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import ProjectCard from "../components/ProjectCard.jsx";
import { Search, Filter, FolderPlus, HelpCircle } from "lucide-react";
import "./Projects.css";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter and search states
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");

    // Create project form states
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [deadline, setDeadline] = useState("");
    const [formError, setFormError] = useState("");
    const [formSuccess, setFormSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Fetch projects from backend
    const fetchProjects = async () => {
        try {
            const { data } = await api.get("/projects");
            setProjects(data.projects || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load project workspaces.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    // Handle Project Creation
    const handleCreateProject = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        if (!name.trim() || !description.trim() || !deadline) {
            setFormError("Project name, description, and deadline are required.");
            return;
        }

        if (name.trim().length < 3) {
            setFormError("Project name must be at least 3 characters.");
            return;
        }

        if (description.trim().length < 8) {
            setFormError("Description must be at least 8 characters.");
            return;
        }

        if (!["Low", "Medium", "High"].includes(priority)) {
            setFormError("Priority must be Low, Medium, or High.");
            return;
        }

        setSubmitting(true);
        try {
            await api.post("/projects", {
                name: name.trim(),
                description: description.trim(),
                category: category.trim() || undefined,
                priority,
                deadline,
            });

            setFormSuccess("Project created successfully!");
            // Reset form
            setName("");
            setDescription("");
            setCategory("");
            setPriority("Medium");
            setDeadline("");

            // Reload list
            fetchProjects();
        } catch (err) {
            setFormError(err.response?.data?.message || "Failed to create project.");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter projects locally
    const filteredProjects = projects.filter((project) => {
        const matchesSearch =
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (project.category && project.category.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPriority =
            priorityFilter === "All" || project.priority === priorityFilter;

        return matchesSearch && matchesPriority;
    });

    if (loading) {
        return (
            <main className="page projects-page-loading">
                <Loader text="Loading your projects..." />
            </main>
        );
    }

    return (
        <main className="page projects-page">
            <div className="container">
                {/* Header */}
                <header className="projects-header">
                    <div>
                        <span className="badge font-bold">Workspace Directory</span>
                        <h1 className="projects-title">Projects</h1>
                        <p className="projects-subtitle">
                            Collaborate, manage tasks, and coordinate with team members.
                        </p>
                    </div>
                </header>

                <div className="projects-layout">
                    {/* Left Side: Directory & Filters */}
                    <div className="projects-main">
                        <div className="search-filters-card card">
                            <div className="search-box">
                                <Search className="search-icon" size={18} />
                                <input
                                    type="text"
                                    className="input search-input"
                                    placeholder="Search by name, description, category..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="filter-box">
                                <Filter size={16} className="filter-icon" />
                                <span className="filter-label">Priority:</span>
                                <select
                                    className="input filter-select"
                                    value={priorityFilter}
                                    onChange={(e) => setPriorityFilter(e.target.value)}
                                    style={{ padding: "8px 12px", width: "auto" }}
                                >
                                    <option value="All">All Priorities</option>
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                        </div>

                        {/* Projects list */}
                        {error ? (
                            <div className="form-error" style={{ margin: "20px 0" }}>{error}</div>
                        ) : filteredProjects.length > 0 ? (
                            <div className="projects-grid">
                                {filteredProjects.map((project) => (
                                    <ProjectCard key={project._id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-projects card">
                                <HelpCircle size={44} className="empty-icon" />
                                <h3>No projects found</h3>
                                <p>Try adjusting your search filters or start by creating a new project space.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Side: Create Project Sidebar Form */}
                    <div className="projects-sidebar">
                        <div className="card create-project-card">
                            <div className="create-card-header">
                                <div className="create-icon-wrapper">
                                    <FolderPlus size={20} />
                                </div>
                                <h3>New Project</h3>
                            </div>
                            <p className="create-card-subtitle">Create a new workspace for your team.</p>

                            <form className="create-project-form" onSubmit={handleCreateProject}>
                                <div className="form-group">
                                    <label className="form-label" htmlFor="proj-name">
                                        Project Name <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="proj-name"
                                        className="input"
                                        placeholder="e.g. Website Overhaul"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="proj-desc">
                                        Description <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <textarea
                                        id="proj-desc"
                                        className="input"
                                        placeholder="Summarize the core objectives..."
                                        rows="3"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                        disabled={submitting}
                                        style={{ resize: "none" }}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="proj-cat">
                                        Category
                                    </label>
                                    <input
                                        type="text"
                                        id="proj-cat"
                                        className="input"
                                        placeholder="e.g. Development, Marketing"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        disabled={submitting}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="proj-priority">
                                        Priority <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <select
                                        id="proj-priority"
                                        className="input"
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        required
                                        disabled={submitting}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label" htmlFor="proj-deadline">
                                        Deadline Date <span style={{ color: "#ef4444" }}>*</span>
                                    </label>
                                    <input
                                        type="date"
                                        id="proj-deadline"
                                        className="input"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        required
                                        disabled={submitting}
                                    />
                                </div>

                                {formError && <div className="form-error">{formError}</div>}
                                {formSuccess && (
                                    <div className="form-success" style={{ marginTop: "16px", padding: "12px 14px", background: "#ecfdf5", color: "#047857", borderRadius: "12px", fontSize: "14px", fontWeight: "750" }}>
                                        {formSuccess}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary create-btn"
                                    disabled={submitting}
                                    style={{ marginTop: "10px" }}
                                >
                                    {submitting ? "Creating..." : "Create Project"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Projects;
