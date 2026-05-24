import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { KanbanSquare, ChevronLeft, Plus, MessageSquare, Clock, UserPlus } from "lucide-react";
import "./ProjectDetails.css";

const ProjectDetails = () => {
    const { id } = useParams();

    // Premium mock project details
    const project = {
        id,
        name: id === "2" ? "AI Meeting Summarizer" : id === "3" ? "Campus Team Finder" : "Ecommerce Redesign",
        description: "Complete overhaul of the main consumer store frontend and checkout system.",
        category: "Web Development",
        priority: "High",
        deadline: "June 24, 2026",
        owner: { name: "Alice Smith", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
        members: [
            { id: "1", name: "Alice Smith", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330" },
            { id: "3", name: "Charlie Brown", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
            { id: "4", name: "Diana Prince", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
            { id: "5", name: "Ethan Hunt", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
        ],
    };

    // Premium mock tasks distributed across board columns
    const initialTasks = [
        {
            id: "101",
            title: "Integrate Payment Gateway",
            description: "Connect Stripe API checkout endpoints and webhook handlers.",
            status: "Todo",
            priority: "High",
            dueDate: "June 10, 2026",
            assignee: { name: "Charlie Brown", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
            commentsCount: 0,
        },
        {
            id: "102",
            title: "Implement Product Catalog API",
            description: "Backend filters, categories, and pagination endpoints.",
            status: "In Progress",
            priority: "High",
            dueDate: "June 05, 2026",
            assignee: { name: "Charlie Brown", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
            commentsCount: 1,
        },
        {
            id: "103",
            title: "Style Product Detail Page",
            description: "Implement responsive layout, reviews, and related carousel.",
            status: "In Progress",
            priority: "Medium",
            dueDate: "June 04, 2026",
            assignee: { name: "Charlie Brown", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
            commentsCount: 0,
        },
        {
            id: "104",
            title: "Design Homepage Layout",
            description: "Finalize Figma wireframes and gather client feedback.",
            status: "Done",
            priority: "High",
            dueDate: "May 22, 2026",
            assignee: { name: "Diana Prince", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80" },
            commentsCount: 2,
        },
        {
            id: "105",
            title: "Write Unit Tests for Auth",
            description: "Cover signup, login, and validation helpers in authController.",
            status: "Done",
            priority: "Medium",
            dueDate: "May 23, 2026",
            assignee: { name: "Ethan Hunt", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
            commentsCount: 1,
        },
    ];

    const [tasks] = useState(initialTasks);

    const getColumnTasks = (status) => {
        return tasks.filter((t) => t.status === status);
    };

    return (
        <main className="page project-details-page">
            <div className="container">
                {/* Back Link */}
                <Link to="/projects" className="back-link">
                    <ChevronLeft size={16} />
                    <span>Back to Projects</span>
                </Link>

                {/* Workspace Header */}
                <header className="project-detail-header">
                    <div>
                        <div className="project-badges">
                            <span className="badge">{project.category}</span>
                            <span className={`badge-priority ${project.priority.toLowerCase()}`}>
                                {project.priority} Priority
                            </span>
                        </div>
                        <h1 className="project-detail-title">{project.name}</h1>
                        <p className="project-detail-desc">{project.description}</p>
                    </div>

                    {/* Members Area */}
                    <div className="members-section">
                        <span className="members-title">Project Members</span>
                        <div className="members-avatars">
                            {project.members.map((member) => (
                                <img
                                    key={member.id}
                                    src={member.avatar}
                                    alt={member.name}
                                    title={member.name}
                                    className="member-avatar-item"
                                />
                            ))}
                            <button className="add-member-btn" title="Add Member">
                                <UserPlus size={14} />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Kanban Board */}
                <div className="kanban-board">
                    {/* Todo Column */}
                    <div className="kanban-column">
                        <div className="column-header">
                            <div className="column-title-wrapper">
                                <span className="column-indicator todo"></span>
                                <h3 className="column-name">To Do</h3>
                                <span className="column-count">{getColumnTasks("Todo").length}</span>
                            </div>
                            <button className="column-add-btn">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="column-tasks">
                            {getColumnTasks("Todo").map((task) => (
                                <div key={task.id} className="task-card-inner card">
                                    <span className={`task-priority-dot ${task.priority.toLowerCase()}`} title={`${task.priority} Priority`}></span>
                                    <h4 className="task-card-title-inner">{task.title}</h4>
                                    <p className="task-card-desc-inner">{task.description}</p>
                                    <div className="task-card-footer-inner">
                                        <div className="task-date">
                                            <Clock size={12} />
                                            <span>{task.dueDate}</span>
                                        </div>
                                        <div className="task-footer-right">
                                            {task.commentsCount > 0 && (
                                                <div className="task-comments-count">
                                                    <MessageSquare size={12} />
                                                    <span>{task.commentsCount}</span>
                                                </div>
                                            )}
                                            <img
                                                src={task.assignee.avatar}
                                                alt={task.assignee.name}
                                                title={`Assigned to ${task.assignee.name}`}
                                                className="task-assignee-avatar"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* In Progress Column */}
                    <div className="kanban-column">
                        <div className="column-header">
                            <div className="column-title-wrapper">
                                <span className="column-indicator progress"></span>
                                <h3 className="column-name">In Progress</h3>
                                <span className="column-count">{getColumnTasks("In Progress").length}</span>
                            </div>
                            <button className="column-add-btn">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="column-tasks">
                            {getColumnTasks("In Progress").map((task) => (
                                <div key={task.id} className="task-card-inner card">
                                    <span className={`task-priority-dot ${task.priority.toLowerCase()}`} title={`${task.priority} Priority`}></span>
                                    <h4 className="task-card-title-inner">{task.title}</h4>
                                    <p className="task-card-desc-inner">{task.description}</p>
                                    <div className="task-card-footer-inner">
                                        <div className="task-date">
                                            <Clock size={12} />
                                            <span>{task.dueDate}</span>
                                        </div>
                                        <div className="task-footer-right">
                                            {task.commentsCount > 0 && (
                                                <div className="task-comments-count">
                                                    <MessageSquare size={12} />
                                                    <span>{task.commentsCount}</span>
                                                </div>
                                            )}
                                            <img
                                                src={task.assignee.avatar}
                                                alt={task.assignee.name}
                                                title={`Assigned to ${task.assignee.name}`}
                                                className="task-assignee-avatar"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Done Column */}
                    <div className="kanban-column">
                        <div className="column-header">
                            <div className="column-title-wrapper">
                                <span className="column-indicator done"></span>
                                <h3 className="column-name">Done</h3>
                                <span className="column-count">{getColumnTasks("Done").length}</span>
                            </div>
                        </div>
                        <div className="column-tasks">
                            {getColumnTasks("Done").map((task) => (
                                <div key={task.id} className="task-card-inner card done">
                                    <h4 className="task-card-title-inner">{task.title}</h4>
                                    <p className="task-card-desc-inner">{task.description}</p>
                                    <div className="task-card-footer-inner">
                                        <div className="task-date">
                                            <Clock size={12} />
                                            <span>{task.dueDate}</span>
                                        </div>
                                        <div className="task-footer-right">
                                            {task.commentsCount > 0 && (
                                                <div className="task-comments-count">
                                                    <MessageSquare size={12} />
                                                    <span>{task.commentsCount}</span>
                                                </div>
                                            )}
                                            <img
                                                src={task.assignee.avatar}
                                                alt={task.assignee.name}
                                                title={`Assigned to ${task.assignee.name}`}
                                                className="task-assignee-avatar"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ProjectDetails;
