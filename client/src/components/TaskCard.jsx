import { useState } from "react";
import { Clock, MessageSquare, Trash2, Send, User, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import "./TaskCard.css";

const TaskCard = ({
    task,
    projectMembers,
    onUpdate,
    onDelete,
    onAddComment,
    currentUserId,
    projectOwnerId
}) => {
    const [newComment, setNewComment] = useState("");
    const [showComments, setShowComments] = useState(false);
    const [submittingComment, setSubmittingComment] = useState(false);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmittingComment(true);
        try {
            await onAddComment(task._id, newComment.trim());
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment:", err);
        } finally {
            setSubmittingComment(false);
        }
    };

    const handleStatusChange = (e) => {
        onUpdate(task._id, { status: e.target.value });
    };

    const handlePriorityChange = (e) => {
        onUpdate(task._id, { priority: e.target.value });
    };

    const handleAssigneeChange = (e) => {
        const val = e.target.value;
        onUpdate(task._id, { assignedTo: val === "unassigned" ? null : val });
    };

    // Determine if user can delete task
    const taskCreatorId = task.createdBy?._id || task.createdBy;
    const canDelete = taskCreatorId?.toString() === currentUserId?.toString() || projectOwnerId?.toString() === currentUserId?.toString();

    return (
        <div className="task-card-item card">
            {/* Top row priority & delete button */}
            <div className="task-card-header-inner">
                <span className={`badge-priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                </span>

                {canDelete && (
                    <button
                        className="task-delete-btn"
                        onClick={() => onDelete(task._id)}
                        title="Delete Task"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>

            {/* Task main info */}
            <h4 className="task-card-title-inner">{task.title}</h4>
            {task.description && <p className="task-card-desc-inner">{task.description}</p>}

            {/* Inline controls */}
            <div className="task-controls">
                {/* Status select */}
                <div className="control-group">
                    <span className="control-label">Status</span>
                    <select
                        className="control-select"
                        value={task.status}
                        onChange={handleStatusChange}
                    >
                        <option value="Todo">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                    </select>
                </div>

                {/* Priority select */}
                <div className="control-group">
                    <span className="control-label">Priority</span>
                    <select
                        className="control-select"
                        value={task.priority}
                        onChange={handlePriorityChange}
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                {/* Assignee select */}
                {projectMembers && projectMembers.length > 0 && (
                    <div className="control-group">
                        <span className="control-label">Assignee</span>
                        <select
                            className="control-select"
                            value={task.assignedTo?._id || task.assignedTo || "unassigned"}
                            onChange={handleAssigneeChange}
                        >
                            <option value="unassigned">Unassigned</option>
                            {projectMembers.map((member) => (
                                <option key={member._id} value={member._id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Task Card Footer */}
            <div className="task-card-footer-inner">
                <div className="task-date">
                    <Clock size={12} />
                    <span className={task.status !== "Done" && new Date(task.dueDate) < new Date() ? "text-overdue" : ""}>
                        Due: {formatDate(task.dueDate)}
                    </span>
                    {task.status !== "Done" && new Date(task.dueDate) < new Date() && (
                        <span className="badge-overdue">Overdue</span>
                    )}
                </div>

                <div className="task-footer-right">
                    <button
                        className="comments-toggle-btn"
                        onClick={() => setShowComments(!showComments)}
                    >
                        <MessageSquare size={13} />
                        <span>{task.comments?.length || 0}</span>
                        {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                    </button>

                    {task.assignedTo ? (
                        <div className="task-avatar-wrapper" title={`Assigned to ${task.assignedTo.name} (${task.assignedTo.position || "Member"})`}>
                            <img
                                src={task.assignedTo.avatar}
                                alt={task.assignedTo.name}
                                className="task-assignee-avatar"
                            />
                        </div>
                    ) : (
                        <div className="task-avatar-wrapper unassigned" title="Unassigned">
                            <User size={12} />
                        </div>
                    )}
                </div>
            </div>

            <div className="task-creator-info">
                <span>Created by {task.createdBy?.name || "Unknown"}</span>
            </div>

            {/* Comments Thread Section */}
            {showComments && (
                <div className="comments-section-wrapper">
                    <div className="comments-list">
                        {task.comments && task.comments.length > 0 ? (
                            task.comments.map((comment) => (
                                <div key={comment._id} className="comment-item">
                                    <img
                                        src={comment.user?.avatar || "https://images.unsplash.com/photo-1511367461989-f85a21fda167"}
                                        alt={comment.user?.name}
                                        className="comment-avatar"
                                    />
                                    <div className="comment-content">
                                        <div className="comment-header">
                                            <span className="comment-user-name">
                                                {comment.user?.name || "Unknown Team Member"}
                                            </span>
                                            <span className="comment-time">
                                                {formatDate(comment.createdAt)}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.text}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-comments-msg">No comments yet. Start the discussion!</p>
                        )}
                    </div>

                    <form className="comment-input-form" onSubmit={handleCommentSubmit}>
                        <input
                            type="text"
                            className="input comment-input-field"
                            placeholder="Add a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={submittingComment}
                            required
                        />
                        <button
                            type="submit"
                            className="comment-submit-btn"
                            disabled={submittingComment || !newComment.trim()}
                        >
                            <Send size={12} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TaskCard;
