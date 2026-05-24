import { Link } from "react-router-dom";
import { Calendar, Users, ShieldAlert, ArrowRight, User } from "lucide-react";
import "./ProjectCard.css";

const ProjectCard = ({ project }) => {
    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    return (
        <div className="project-card card">
            <div className="project-card-header">
                <span className="project-category">{project.category || "General"}</span>
                <span className={`badge-priority ${project.priority.toLowerCase()}`}>
                    {project.priority}
                </span>
            </div>

            <h3 className="project-card-title">{project.name}</h3>
            <p className="project-card-desc">{project.description}</p>

            <div className="project-card-meta">
                <div className="meta-item">
                    <User size={14} />
                    <span>Owner: <strong>{project.owner?.name || "Unknown"}</strong></span>
                </div>
                <div className="meta-item">
                    <Users size={14} />
                    <span>{project.members?.length || 0} Members</span>
                </div>
                <div className="meta-item">
                    <Calendar size={14} />
                    <span>Due: {formatDate(project.deadline)}</span>
                </div>
                <div className="meta-item created-date">
                    <span>Created: {formatDate(project.createdAt)}</span>
                </div>
            </div>

            <Link to={`/projects/${project._id}`} className="btn btn-primary project-btn">
                <span>Open Workspace</span>
                <ArrowRight size={14} />
            </Link>
        </div>
    );
};

export default ProjectCard;
