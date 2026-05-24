import { Link } from "react-router-dom";
import { Folder, MoreVertical, Layers, Calendar, Users } from "lucide-react";
import "./Projects.css";

const Projects = () => {
    // Premium mock projects data
    const projectsList = [
        {
            id: "1",
            name: "Ecommerce Redesign",
            description: "Overhaul of the main consumer store frontend and checkout system.",
            category: "Web Development",
            priority: "High",
            membersCount: 4,
            tasksCount: 5,
            deadline: "June 24, 2026",
        },
        {
            id: "2",
            name: "AI Meeting Summarizer",
            description: "Transcription and automated action items microservice.",
            category: "Artificial Intelligence",
            priority: "High",
            membersCount: 4,
            tasksCount: 5,
            deadline: "June 10, 2026",
        },
        {
            id: "3",
            name: "Campus Team Finder",
            description: "Social matchmaking portal for hackathons and group studies.",
            category: "Mobile App",
            priority: "Medium",
            membersCount: 4,
            tasksCount: 5,
            deadline: "July 15, 2026",
        },
        {
            id: "4",
            name: "Marketing Dashboard",
            description: "Aggregating metrics from social channels and AdWords campaigns.",
            category: "Analytics",
            priority: "Low",
            membersCount: 4,
            tasksCount: 5,
            deadline: "July 30, 2026",
        },
    ];

    return (
        <main className="page projects-page">
            <div className="container">
                <header className="projects-header">
                    <div>
                        <span className="badge">Workspaces</span>
                        <h1 className="projects-title">All Projects</h1>
                        <p className="projects-subtitle">
                            List of active projects you have access to.
                        </p>
                    </div>
                </header>

                <div className="projects-grid">
                    {projectsList.map((project) => (
                        <div key={project.id} className="project-card card">
                            <div className="project-card-header">
                                <span className="project-category">{project.category}</span>
                                <span className={`badge-priority ${project.priority.toLowerCase()}`}>
                                    {project.priority}
                                </span>
                            </div>

                            <h3 className="project-card-title">{project.name}</h3>
                            <p className="project-card-desc">{project.description}</p>

                            <div className="project-card-meta">
                                <div className="meta-item">
                                    <Users size={15} />
                                    <span>{project.membersCount} Members</span>
                                </div>
                                <div className="meta-item">
                                    <Layers size={15} />
                                    <span>{project.tasksCount} Tasks</span>
                                </div>
                                <div className="meta-item">
                                    <Calendar size={15} />
                                    <span>Due {project.deadline}</span>
                                </div>
                            </div>

                            <Link to={`/projects/${project.id}`} className="btn btn-primary project-btn">
                                Open Workspace
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default Projects;
