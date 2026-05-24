import { useState } from "react";
import { Clock, MessageSquare, Plus, AlertCircle, Sparkles } from "lucide-react";
import "./MyTasks.css";

const MyTasks = () => {
    // Premium mock tasks assigned to current user
    const initialTasks = [
        {
            id: "1",
            title: "Integrate Payment Gateway",
            description: "Connect Stripe checkout session flow and handle webhooks.",
            project: "Ecommerce Redesign",
            priority: "High",
            status: "Todo",
            dueDate: "June 10, 2026",
            createdBy: "Alice Smith",
            commentsCount: 0,
        },
        {
            id: "2",
            title: "Implement Product Catalog API",
            description: "Build query filters, sorting, and pagination in catalog controller.",
            project: "Ecommerce Redesign",
            priority: "High",
            status: "In Progress",
            dueDate: "June 05, 2026",
            createdBy: "Alice Smith",
            commentsCount: 1,
        },
        {
            id: "3",
            title: "Style Product Detail Page",
            description: "Style product views, review sections, and related items slider.",
            project: "Ecommerce Redesign",
            priority: "Medium",
            status: "In Progress",
            dueDate: "June 04, 2026",
            createdBy: "Alice Smith",
            commentsCount: 0,
        },
    ];

    const [tasks] = useState(initialTasks);
    const [filter, setFilter] = useState("all");

    const getFilteredTasks = () => {
        if (filter === "all") return tasks;
        return tasks.filter((t) => t.status.toLowerCase() === filter.toLowerCase());
    };

    return (
        <main className="page my-tasks-page">
            <div className="container">
                <header className="tasks-header">
                    <div>
                        <span className="badge">Inbox</span>
                        <h1 className="tasks-title">My Tasks</h1>
                        <p className="tasks-subtitle">
                            Tasks assigned directly to you across all project spaces.
                        </p>
                    </div>

                    {/* Filter buttons */}
                    <div className="tasks-filters card">
                        <button
                            className={`filter-btn ${filter === "all" ? "active" : ""}`}
                            onClick={() => setFilter("all")}
                        >
                            All Tasks
                        </button>
                        <button
                            className={`filter-btn ${filter === "todo" ? "active" : ""}`}
                            onClick={() => setFilter("todo")}
                        >
                            To Do
                        </button>
                        <button
                            className={`filter-btn ${filter === "in progress" ? "active" : ""}`}
                            onClick={() => setFilter("in progress")}
                        >
                            In Progress
                        </button>
                        <button
                            className={`filter-btn ${filter === "done" ? "active" : ""}`}
                            onClick={() => setFilter("done")}
                        >
                            Done
                        </button>
                    </div>
                </header>

                <div className="tasks-list">
                    {getFilteredTasks().length > 0 ? (
                        getFilteredTasks().map((task) => (
                            <div key={task.id} className="task-row card">
                                <div className="task-row-main">
                                    <div className="task-row-title-area">
                                        <h3 className="task-row-title">{task.title}</h3>
                                        <span className="task-row-project">{task.project}</span>
                                    </div>
                                    <p className="task-row-desc">{task.description}</p>
                                </div>

                                <div className="task-row-meta">
                                    <span className={`badge-priority ${task.priority.toLowerCase()}`}>
                                        {task.priority}
                                    </span>

                                    <div className="task-meta-item">
                                        <Clock size={14} />
                                        <span>{task.dueDate}</span>
                                    </div>

                                    {task.commentsCount > 0 && (
                                        <div className="task-meta-item">
                                            <MessageSquare size={14} />
                                            <span>{task.commentsCount} Comments</span>
                                        </div>
                                    )}

                                    <span className="task-row-creator">
                                        Created by {task.createdBy}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-tasks-card card">
                            <Sparkles size={36} className="empty-icon" />
                            <h3>No tasks found</h3>
                            <p>You have no tasks matching this status filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default MyTasks;
