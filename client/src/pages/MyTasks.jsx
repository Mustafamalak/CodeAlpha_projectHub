import { useState, useEffect, useCallback } from "react";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import {
    Clock,
    MessageSquare,
    AlertTriangle,
    Sparkles,
    Search,
    ChevronDown,
    Send,
} from "lucide-react";
import "./MyTasks.css";

const MyTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filters
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    // Per-task comment box state
    const [commentBoxOpen, setCommentBoxOpen] = useState({});
    const [commentText, setCommentText] = useState({});
    const [commentPosting, setCommentPosting] = useState({});

    const fetchMyTasks = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const { data } = await api.get("/tasks/my-tasks");
            setTasks(data.tasks || data || []);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to load your tasks.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyTasks();
    }, [fetchMyTasks]);

    // Update task status or priority inline
    const handleUpdateTask = async (taskId, field, value) => {
        try {
            await api.put(`/tasks/${taskId}`, { [field]: value });
            setTasks((prev) =>
                prev.map((t) => (t._id === taskId ? { ...t, [field]: value } : t))
            );
        } catch (err) {
            console.error("Update failed:", err);
        }
    };

    // Post comment
    const handlePostComment = async (taskId) => {
        const text = (commentText[taskId] || "").trim();
        if (!text) return;
        setCommentPosting((prev) => ({ ...prev, [taskId]: true }));
        try {
            const { data } = await api.post(`/tasks/${taskId}/comments`, { text });
            setTasks((prev) =>
                prev.map((t) => (t._id === taskId ? { ...t, comments: data.comments } : t))
            );
            setCommentText((prev) => ({ ...prev, [taskId]: "" }));
        } catch (err) {
            console.error("Comment failed:", err);
        } finally {
            setCommentPosting((prev) => ({ ...prev, [taskId]: false }));
        }
    };

    const isOverdue = (dueDate, status) => {
        if (!dueDate || status === "Done") return false;
        return new Date(dueDate) < new Date();
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "No due date";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getFilteredTasks = () => {
        return tasks.filter((t) => {
            const matchStatus =
                statusFilter === "all" ||
                t.status.toLowerCase() === statusFilter.toLowerCase();
            const matchPriority =
                priorityFilter === "all" ||
                t.priority.toLowerCase() === priorityFilter.toLowerCase();
            const matchSearch =
                !searchQuery ||
                t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (t.project?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
            return matchStatus && matchPriority && matchSearch;
        });
    };

    if (loading) {
        return (
            <main className="page my-tasks-page-loading">
                <Loader text="Loading your tasks..." />
            </main>
        );
    }

    if (error) {
        return (
            <main className="page my-tasks-page">
                <div className="container">
                    <div className="form-error" style={{ maxWidth: 480, margin: "40px auto", textAlign: "center" }}>
                        <h3 style={{ marginBottom: 8 }}>Error Loading Tasks</h3>
                        <p>{error}</p>
                    </div>
                </div>
            </main>
        );
    }

    const filtered = getFilteredTasks();

    return (
        <main className="page my-tasks-page">
            <div className="container">
                {/* Header */}
                <header className="tasks-header">
                    <div>
                        <span className="badge">Inbox</span>
                        <h1 className="tasks-title">My Tasks</h1>
                        <p className="tasks-subtitle">
                            Tasks assigned to you across all project workspaces.
                        </p>
                    </div>

                    {/* Filters row */}
                    <div className="tasks-filter-bar">
                        {/* Search */}
                        <div className="tasks-search">
                            <Search size={15} className="tasks-search-icon" />
                            <input
                                type="text"
                                placeholder="Search by title or project..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="tasks-search-input"
                            />
                        </div>

                        {/* Status filter pills */}
                        <div className="tasks-filters card">
                            {["all", "Todo", "In Progress", "Done"].map((s) => (
                                <button
                                    key={s}
                                    className={`filter-btn ${statusFilter === s ? "active" : ""}`}
                                    onClick={() => setStatusFilter(s)}
                                >
                                    {s === "all" ? "All" : s}
                                </button>
                            ))}
                        </div>

                        {/* Priority filter */}
                        <div className="tasks-priority-filter">
                            <select
                                value={priorityFilter}
                                onChange={(e) => setPriorityFilter(e.target.value)}
                                className="priority-select"
                            >
                                <option value="all">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                            <ChevronDown size={14} className="priority-select-chevron" />
                        </div>
                    </div>
                </header>

                {/* Task count */}
                <div className="tasks-count-row">
                    <span className="tasks-count">
                        {filtered.length} task{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Task list */}
                <div className="tasks-list">
                    {filtered.length > 0 ? (
                        filtered.map((task) => (
                            <div key={task._id} className="task-row card">
                                <div className="task-row-main">
                                    <div className="task-row-title-area">
                                        <h3 className="task-row-title">{task.title}</h3>
                                        {task.project?.name && (
                                            <span className="task-row-project">{task.project.name}</span>
                                        )}
                                        {isOverdue(task.dueDate, task.status) && (
                                            <span className="badge-overdue">
                                                <AlertTriangle size={11} /> Overdue
                                            </span>
                                        )}
                                    </div>
                                    {task.description && (
                                        <p className="task-row-desc">{task.description}</p>
                                    )}
                                </div>

                                {/* Meta + Controls */}
                                <div className="task-row-meta">
                                    {/* Priority badge */}
                                    <span className={`badge-priority ${task.priority.toLowerCase()}`}>
                                        {task.priority}
                                    </span>

                                    {/* Status inline select */}
                                    <div className="task-meta-select-wrap">
                                        <select
                                            value={task.status}
                                            onChange={(e) =>
                                                handleUpdateTask(task._id, "status", e.target.value)
                                            }
                                            className={`task-status-select status-${task.status.replace(" ", "").toLowerCase()}`}
                                        >
                                            <option value="Todo">Todo</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Done">Done</option>
                                        </select>
                                    </div>

                                    {/* Due date */}
                                    <div className="task-meta-item">
                                        <Clock size={13} />
                                        <span>{formatDate(task.dueDate)}</span>
                                    </div>

                                    {/* Comments count */}
                                    {task.comments?.length > 0 && (
                                        <div className="task-meta-item">
                                            <MessageSquare size={13} />
                                            <span>{task.comments.length}</span>
                                        </div>
                                    )}

                                    {/* Created by */}
                                    {task.createdBy?.name && (
                                        <span className="task-row-creator">
                                            by {task.createdBy.name}
                                        </span>
                                    )}

                                    {/* Toggle comment box */}
                                    <button
                                        className="comment-toggle-btn"
                                        onClick={() =>
                                            setCommentBoxOpen((prev) => ({
                                                ...prev,
                                                [task._id]: !prev[task._id],
                                            }))
                                        }
                                    >
                                        <MessageSquare size={14} />
                                        <span>{commentBoxOpen[task._id] ? "Close" : "Comment"}</span>
                                    </button>
                                </div>

                                {/* Comment section */}
                                {commentBoxOpen[task._id] && (
                                    <div className="task-comment-section">
                                        {/* Existing comments */}
                                        {task.comments?.length > 0 && (
                                            <div className="task-comments-list">
                                                {task.comments.map((c, idx) => (
                                                    <div key={idx} className="task-comment-item">
                                                        <img
                                                            src={c.user?.avatar}
                                                            alt={c.user?.name}
                                                            className="comment-avatar"
                                                        />
                                                        <div className="comment-bubble">
                                                            <span className="comment-author">{c.user?.name}</span>
                                                            <p className="comment-text">{c.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {/* New comment input */}
                                        <div className="task-comment-input-row">
                                            <input
                                                type="text"
                                                placeholder="Write a comment..."
                                                value={commentText[task._id] || ""}
                                                onChange={(e) =>
                                                    setCommentText((prev) => ({
                                                        ...prev,
                                                        [task._id]: e.target.value,
                                                    }))
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") handlePostComment(task._id);
                                                }}
                                                className="comment-input"
                                            />
                                            <button
                                                onClick={() => handlePostComment(task._id)}
                                                disabled={commentPosting[task._id]}
                                                className="comment-send-btn"
                                            >
                                                <Send size={15} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-tasks-card card">
                            <Sparkles size={36} className="empty-icon" />
                            <h3>No tasks found</h3>
                            <p>
                                {tasks.length === 0
                                    ? "You have no tasks assigned to you yet."
                                    : "No tasks match your current filters."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default MyTasks;
