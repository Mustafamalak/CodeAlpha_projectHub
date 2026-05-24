import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import TaskCard from "../components/TaskCard.jsx";
import {
    ChevronLeft,
    Clock,
    Plus,
    UserPlus,
    UserMinus,
    Edit3,
    Trash2,
    Save,
    X,
    Folder,
    AlertCircle,
    User
} from "lucide-react";
import "./ProjectDetails.css";

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();

    // Data states
    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit Project states
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDesc, setEditDesc] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editPriority, setEditPriority] = useState("Medium");
    const [editDeadline, setEditDeadline] = useState("");
    const [editError, setEditError] = useState("");

    // Add Member states
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [memberError, setMemberError] = useState("");
    const [memberSuccess, setMemberSuccess] = useState("");
    const [addingMember, setAddingMember] = useState(false);

    // Create Task form states
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [taskDesc, setTaskDesc] = useState("");
    const [taskAssignee, setTaskAssignee] = useState("");
    const [taskPriority, setTaskPriority] = useState("Medium");
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskFormError, setTaskFormError] = useState("");
    const [taskFormSuccess, setTaskFormSuccess] = useState("");
    const [creatingTask, setCreatingTask] = useState(false);

    // Load initial project and tasks
    const loadProjectData = async () => {
        try {
            setError("");
            // Fetch project details
            const projectRes = await api.get(`/projects/${id}`);
            setProject(projectRes.data.project);

            // Set editing initial states
            setEditName(projectRes.data.project.name);
            setEditDesc(projectRes.data.project.description);
            setEditCategory(projectRes.data.project.category || "");
            setEditPriority(projectRes.data.project.priority || "Medium");
            if (projectRes.data.project.deadline) {
                setEditDeadline(new Date(projectRes.data.project.deadline).toISOString().split("T")[0]);
            }

            // Fetch project tasks
            const tasksRes = await api.get(`/tasks/project/${id}`);
            setTasks(tasksRes.data.tasks || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load project details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjectData();
    }, [id]);

    // Handle Project Update
    const handleUpdateProject = async (e) => {
        e.preventDefault();
        setEditError("");

        if (!editName.trim() || !editDesc.trim() || !editDeadline) {
            setEditError("Name, description, and deadline are required.");
            return;
        }

        try {
            const { data } = await api.put(`/projects/${id}`, {
                name: editName.trim(),
                description: editDesc.trim(),
                category: editCategory.trim() || undefined,
                priority: editPriority,
                deadline: editDeadline,
            });

            setProject(data.project);
            setIsEditingProject(false);
        } catch (err) {
            setEditError(err.response?.data?.message || "Failed to update project.");
        }
    };

    // Handle Project Deletion
    const handleDeleteProject = async () => {
        if (!window.confirm("Are you absolutely sure you want to delete this project and all associated tasks?")) {
            return;
        }

        try {
            await api.delete(`/projects/${id}`);
            navigate("/projects");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete project.");
        }
    };

    // Handle Add Member
    const handleAddMember = async (e) => {
        e.preventDefault();
        setMemberError("");
        setMemberSuccess("");

        if (!newMemberEmail.trim()) return;

        setAddingMember(true);
        try {
            const { data } = await api.post(`/projects/${id}/members`, {
                email: newMemberEmail.trim(),
            });

            setProject(data.project);
            setNewMemberEmail("");
            setMemberSuccess("Member added successfully!");
        } catch (err) {
            setMemberError(err.response?.data?.message || "Failed to add member.");
        } finally {
            setAddingMember(false);
        }
    };

    // Handle Remove Member
    const handleRemoveMember = async (memberId) => {
        if (!window.confirm("Are you sure you want to remove this member from the project? This will unassign them from all project tasks.")) {
            return;
        }

        try {
            const { data } = await api.delete(`/projects/${id}/members/${memberId}`);
            setProject(data.project);
            // Refresh tasks since assignments changed to null
            const tasksRes = await api.get(`/tasks/project/${id}`);
            setTasks(tasksRes.data.tasks || []);
        } catch (err) {
            setMemberError(err.response?.data?.message || "Failed to remove member.");
        }
    };

    // Handle Create Task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        setTaskFormError("");
        setTaskFormSuccess("");

        if (!taskTitle.trim() || !taskDueDate) {
            setTaskFormError("Task title and due date are required.");
            return;
        }

        if (taskTitle.trim().length < 3) {
            setTaskFormError("Task title must be at least 3 characters.");
            return;
        }

        setCreatingTask(true);
        try {
            await api.post("/tasks", {
                title: taskTitle.trim(),
                description: taskDesc.trim() || undefined,
                project: id,
                assignedTo: taskAssignee || undefined,
                priority: taskPriority,
                dueDate: taskDueDate,
            });

            setTaskFormSuccess("Task created successfully!");
            setTaskTitle("");
            setTaskDesc("");
            setTaskAssignee("");
            setTaskPriority("Medium");
            setTaskDueDate("");
            setShowTaskForm(false);

            // Refresh tasks list
            const tasksRes = await api.get(`/tasks/project/${id}`);
            setTasks(tasksRes.data.tasks || []);
        } catch (err) {
            setTaskFormError(err.response?.data?.message || "Failed to create task.");
        } finally {
            setCreatingTask(false);
        }
    };

    // Handle Task Update (Status, Priority, Assignee)
    const handleUpdateTask = async (taskId, updatedFields) => {
        try {
            const { data } = await api.put(`/tasks/${taskId}`, updatedFields);
            // Update task in local state array
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === taskId ? data.task : t))
            );
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to update task.");
        }
    };

    // Handle Task Deletion
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks((prevTasks) => prevTasks.filter((t) => t._id !== taskId));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to delete task.");
        }
    };

    // Handle Add Comment to Task
    const handleAddTaskComment = async (taskId, commentText) => {
        try {
            const { data } = await api.post(`/tasks/${taskId}/comments`, {
                text: commentText,
            });
            // Update task with new comments in state
            setTasks((prevTasks) =>
                prevTasks.map((t) => (t._id === taskId ? data.task : t))
            );
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Failed to post comment.");
        }
    };

    // Date formatting helper
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
            <main className="page project-details-loading">
                <Loader text="Loading project workspace..." />
            </main>
        );
    }

    if (error || !project) {
        return (
            <main className="page project-details-error">
                <div className="container">
                    <Link to="/projects" className="back-link">
                        <ChevronLeft size={16} />
                        <span>Back to Projects</span>
                    </Link>
                    <div className="form-error" style={{ margin: "20px 0", textAlign: "center" }}>
                        <h3>Project Load Failure</h3>
                        <p>{error || "Project workspace not found."}</p>
                    </div>
                </div>
            </main>
        );
    }

    // Role checks
    const projectOwnerId = project.owner?._id || project.owner;
    const isOwner = projectOwnerId?.toString() === currentUser?.id?.toString() || projectOwnerId?.toString() === currentUser?._id?.toString();

    // Group tasks by Kanban column
    const todoTasks = tasks.filter((t) => t.status === "Todo");
    const inProgressTasks = tasks.filter((t) => t.status === "In Progress");
    const doneTasks = tasks.filter((t) => t.status === "Done");

    return (
        <main className="page project-details-page">
            <div className="container">
                {/* Back Link */}
                <Link to="/projects" className="back-link">
                    <ChevronLeft size={16} />
                    <span>Back to Projects</span>
                </Link>

                {/* Edit project toggled vs display header */}
                {isEditingProject ? (
                    <div className="card edit-project-section" style={{ padding: "32px", marginBottom: "40px" }}>
                        <div className="create-card-header" style={{ marginBottom: "20px" }}>
                            <h3>Edit Project Details</h3>
                        </div>

                        <form onSubmit={handleUpdateProject} className="create-project-form">
                            <div className="form-group">
                                <label className="form-label">Project Name</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="input"
                                    value={editDesc}
                                    onChange={(e) => setEditDesc(e.target.value)}
                                    rows="3"
                                    required
                                    style={{ resize: "none" }}
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Category</label>
                                <input
                                    type="text"
                                    className="input"
                                    value={editCategory}
                                    onChange={(e) => setEditCategory(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Priority</label>
                                <select
                                    className="input"
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value)}
                                    required
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Deadline Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={editDeadline}
                                    onChange={(e) => setEditDeadline(e.target.value)}
                                    required
                                />
                            </div>

                            {editError && <div className="form-error">{editError}</div>}

                            <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                                <button type="submit" className="btn btn-primary" style={{ padding: "10px 20px" }}>
                                    <Save size={16} style={{ marginRight: "6px" }} />
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditingProject(false)}
                                    style={{ padding: "10px 20px" }}
                                >
                                    <X size={16} style={{ marginRight: "6px" }} />
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <header className="project-detail-header">
                        <div style={{ flex: "1", minWidth: "280px" }}>
                            <div className="project-badges">
                                <span className="badge">{project.category || "General"}</span>
                                <span className={`badge-priority ${project.priority?.toLowerCase()}`}>
                                    {project.priority} Priority
                                </span>
                            </div>
                            <h1 className="project-detail-title">{project.name}</h1>
                            <p className="project-detail-desc">{project.description}</p>
                            <div className="project-meta-summary" style={{ marginTop: "16px", display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "14px", color: "#64748b", fontWeight: "700" }}>
                                <span>Owner: <strong>{project.owner?.name}</strong></span>
                                <span>Due: <strong>{formatDate(project.deadline)}</strong></span>
                                <span>Members: <strong>{project.members?.length || 0}</strong></span>
                            </div>

                            {/* Owner Specific Controls */}
                            {isOwner && (
                                <div className="owner-project-controls" style={{ marginTop: "20px", display: "flex", gap: "12px" }}>
                                    <button
                                        onClick={() => setIsEditingProject(true)}
                                        className="btn btn-secondary"
                                        style={{ padding: "8px 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
                                    >
                                        <Edit3 size={14} />
                                        <span>Edit Details</span>
                                    </button>
                                    <button
                                        onClick={handleDeleteProject}
                                        className="btn btn-secondary"
                                        style={{ padding: "8px 14px", fontSize: "13px", color: "#be123c", borderColor: "#fecdd3", display: "flex", alignItems: "center", gap: "6px" }}
                                    >
                                        <Trash2 size={14} />
                                        <span>Delete Workspace</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Members Panel */}
                        <div className="members-panel card" style={{ padding: "24px", minWidth: "280px" }}>
                            <span className="members-title">Workspace Members</span>
                            <div className="members-avatars-flex" style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "16px 0" }}>
                                {project.members?.map((m) => (
                                    <div key={m._id} className="member-avatar-wrapper-inner" title={`${m.name} (${m.position || "Member"})`}>
                                        <img src={m.avatar} alt={m.name} className="member-avatar-item-details" />
                                        {isOwner && m._id !== projectOwnerId && (
                                            <button
                                                className="remove-member-small-btn"
                                                onClick={() => handleRemoveMember(m._id)}
                                                title={`Remove ${m.name}`}
                                            >
                                                <UserMinus size={10} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Member form for Owner */}
                            {isOwner && (
                                <form onSubmit={handleAddMember} className="add-member-form">
                                    <input
                                        type="email"
                                        className="input"
                                        placeholder="Add member by email..."
                                        value={newMemberEmail}
                                        onChange={(e) => setNewMemberEmail(e.target.value)}
                                        required
                                        disabled={addingMember}
                                        style={{ padding: "8px 12px", fontSize: "12px", borderRadius: "10px" }}
                                    />
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={addingMember || !newMemberEmail.trim()}
                                        style={{ padding: "8px 12px", borderRadius: "10px", fontSize: "12px" }}
                                    >
                                        Add
                                    </button>
                                </form>
                            )}
                            {memberError && <div className="form-error" style={{ fontSize: "11px", padding: "8px 10px", marginTop: "8px" }}>{memberError}</div>}
                            {memberSuccess && <div className="form-success" style={{ fontSize: "11px", padding: "8px 10px", marginTop: "8px", background: "#ecfdf5", color: "#047857", borderRadius: "10px", fontWeight: "750" }}>{memberSuccess}</div>}
                        </div>
                    </header>
                )}

                {/* Task Creator & Kanban Row */}
                <div className="tasks-board-section">
                    <div className="section-header-flex" style={{ marginBottom: "24px" }}>
                        <h2 className="section-title-alt" style={{ fontSize: "22px" }}>Tasks Board</h2>
                        <button
                            onClick={() => setShowTaskForm(!showTaskForm)}
                            className="btn btn-primary"
                            style={{ padding: "10px 18px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
                        >
                            <Plus size={16} />
                            <span>New Task</span>
                        </button>
                    </div>

                    {/* Inline Task Form */}
                    {showTaskForm && (
                        <div className="card create-task-section card-form-expand" style={{ padding: "32px", marginBottom: "32px" }}>
                            <h3>Create New Task</h3>
                            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>Set objectives and assign to project members.</p>
                            <form onSubmit={handleCreateTask} className="create-project-form">
                                <div className="form-group">
                                    <label className="form-label">Task Title <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        type="text"
                                        className="input"
                                        placeholder="e.g. Set up auth routes"
                                        value={taskTitle}
                                        onChange={(e) => setTaskTitle(e.target.value)}
                                        required
                                        disabled={creatingTask}
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea
                                        className="input"
                                        placeholder="Describe the scope of work..."
                                        rows="2"
                                        value={taskDesc}
                                        onChange={(e) => setTaskDesc(e.target.value)}
                                        disabled={creatingTask}
                                        style={{ resize: "none" }}
                                    ></textarea>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Assignee</label>
                                    <select
                                        className="input"
                                        value={taskAssignee}
                                        onChange={(e) => setTaskAssignee(e.target.value)}
                                        disabled={creatingTask}
                                    >
                                        <option value="">Unassigned</option>
                                        {project.members?.map((m) => (
                                            <option key={m._id} value={m._id}>
                                                {m.name} ({m.position || "Member"})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Priority <span style={{ color: "#ef4444" }}>*</span></label>
                                    <select
                                        className="input"
                                        value={taskPriority}
                                        onChange={(e) => setTaskPriority(e.target.value)}
                                        required
                                        disabled={creatingTask}
                                    >
                                        <option value="Low">Low</option>
                                        <option value="Medium">Medium</option>
                                        <option value="High">High</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Due Date <span style={{ color: "#ef4444" }}>*</span></label>
                                    <input
                                        type="date"
                                        className="input"
                                        value={taskDueDate}
                                        onChange={(e) => setTaskDueDate(e.target.value)}
                                        required
                                        disabled={creatingTask}
                                    />
                                </div>

                                {taskFormError && <div className="form-error">{taskFormError}</div>}
                                {taskFormSuccess && <div className="form-success" style={{ padding: "10px 14px", background: "#ecfdf5", color: "#047857", borderRadius: "10px" }}>{taskFormSuccess}</div>}

                                <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
                                    <button type="submit" className="btn btn-primary" disabled={creatingTask} style={{ padding: "10px 20px" }}>
                                        Create Task
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowTaskForm(false)}
                                        style={{ padding: "10px 20px" }}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Kanban Columns */}
                    <div className="kanban-board">
                        {/* Todo Column */}
                        <div className="kanban-column">
                            <div className="column-header">
                                <div className="column-title-wrapper">
                                    <span className="column-indicator todo"></span>
                                    <h3 className="column-name">To Do</h3>
                                    <span className="column-count">{todoTasks.length}</span>
                                </div>
                            </div>
                            <div className="column-tasks">
                                {todoTasks.length > 0 ? (
                                    todoTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            projectMembers={project.members || []}
                                            onUpdate={handleUpdateTask}
                                            onDelete={handleDeleteTask}
                                            onAddComment={handleAddTaskComment}
                                            currentUserId={currentUser?.id || currentUser?._id}
                                            projectOwnerId={projectOwnerId}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-column-card">
                                        <Folder size={18} />
                                        <span>No tasks pending</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* In Progress Column */}
                        <div className="kanban-column">
                            <div className="column-header">
                                <div className="column-title-wrapper">
                                    <span className="column-indicator progress"></span>
                                    <h3 className="column-name">In Progress</h3>
                                    <span className="column-count">{inProgressTasks.length}</span>
                                </div>
                            </div>
                            <div className="column-tasks">
                                {inProgressTasks.length > 0 ? (
                                    inProgressTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            projectMembers={project.members || []}
                                            onUpdate={handleUpdateTask}
                                            onDelete={handleDeleteTask}
                                            onAddComment={handleAddTaskComment}
                                            currentUserId={currentUser?.id || currentUser?._id}
                                            projectOwnerId={projectOwnerId}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-column-card">
                                        <Folder size={18} />
                                        <span>No tasks in progress</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Done Column */}
                        <div className="kanban-column">
                            <div className="column-header">
                                <div className="column-title-wrapper">
                                    <span className="column-indicator done"></span>
                                    <h3 className="column-name">Done</h3>
                                    <span className="column-count">{doneTasks.length}</span>
                                </div>
                            </div>
                            <div className="column-tasks">
                                {doneTasks.length > 0 ? (
                                    doneTasks.map((task) => (
                                        <TaskCard
                                            key={task._id}
                                            task={task}
                                            projectMembers={project.members || []}
                                            onUpdate={handleUpdateTask}
                                            onDelete={handleDeleteTask}
                                            onAddComment={handleAddTaskComment}
                                            currentUserId={currentUser?.id || currentUser?._id}
                                            projectOwnerId={projectOwnerId}
                                        />
                                    ))
                                ) : (
                                    <div className="empty-column-card">
                                        <Folder size={18} />
                                        <span>No completed tasks</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProjectDetails;
