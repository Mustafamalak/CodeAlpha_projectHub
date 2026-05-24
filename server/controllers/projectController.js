const mongoose = require("mongoose");
const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const { isProjectMember, isProjectOwner } = require("../middleware/authMiddleware");

// POST /api/projects - Create project
const createProject = async (req, res) => {
    try {
        const { name, description, category, priority, deadline } = req.body;

        if (!name || !description || !deadline) {
            return res.status(400).json({
                message: "Please provide project name, description and deadline",
            });
        }

        const project = await Project.create({
            name,
            description,
            category,
            priority,
            deadline,
            owner: req.user._id,
            members: [req.user._id],
        });

        const populatedProject = await Project.findById(project._id)
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position");

        res.status(201).json({
            message: "Project created successfully",
            project: populatedProject,
        });
    } catch (error) {
        res.status(500).json({
            message: "Project creation failed",
            error: error.message,
        });
    }
};

// GET /api/projects - Get all projects where user is a member
const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({
            members: req.user._id,
        })
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: projects.length,
            projects,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch projects",
            error: error.message,
        });
    }
};

// GET /api/projects/:id - Get single project by id
const getProjectById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid project ID format",
            });
        }

        const project = await Project.findById(req.params.id)
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (!isProjectMember(project, req.user._id)) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        res.status(200).json({
            project,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch project",
            error: error.message,
        });
    }
};

// PUT /api/projects/:id - Update project
const updateProject = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid project ID format",
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (!isProjectOwner(project, req.user._id)) {
            return res.status(403).json({
                message: "Only project owner can update this project",
            });
        }

        const { name, description, category, priority, deadline } = req.body;

        if (name !== undefined) project.name = name;
        if (description !== undefined) project.description = description;
        if (category !== undefined) project.category = category;
        if (priority !== undefined) project.priority = priority;
        if (deadline !== undefined) project.deadline = deadline;

        await project.save();

        const updatedProject = await Project.findById(project._id)
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position");

        res.status(200).json({
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not update project",
            error: error.message,
        });
    }
};

// DELETE /api/projects/:id - Delete project and all its tasks
const deleteProject = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid project ID format",
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (!isProjectOwner(project, req.user._id)) {
            return res.status(403).json({
                message: "Only project owner can delete this project",
            });
        }

        // Delete all tasks associated with this project
        await Task.deleteMany({ project: req.params.id });

        // Delete the project
        await Project.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Project and all associated tasks deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not delete project",
            error: error.message,
        });
    }
};

// POST /api/projects/:id/members - Add member to project by email
const addProjectMember = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid project ID format",
            });
        }

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Please provide member email",
            });
        }

        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (!isProjectOwner(project, req.user._id)) {
            return res.status(403).json({
                message: "Only project owner can add members",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: "No user found with this email",
            });
        }

        if (isProjectMember(project, user._id)) {
            return res.status(400).json({
                message: "User is already a project member",
            });
        }

        project.members.push(user._id);
        await project.save();

        const updatedProject = await Project.findById(project._id)
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position");

        res.status(200).json({
            message: "Member added successfully",
            project: updatedProject,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not add member",
            error: error.message,
        });
    }
};

// DELETE /api/projects/:id/members/:memberId - Remove member from project
const removeProjectMember = async (req, res) => {
    try {
        const { id, memberId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(memberId)) {
            return res.status(400).json({
                message: "Invalid project or member ID format",
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (!isProjectOwner(project, req.user._id)) {
            return res.status(403).json({
                message: "Only project owner can remove members",
            });
        }

        if (memberId.toString() === project.owner.toString()) {
            return res.status(400).json({
                message: "Owner cannot remove themselves from the project",
            });
        }

        if (!isProjectMember(project, memberId)) {
            return res.status(400).json({
                message: "User is not a member of this project",
            });
        }

        // Remove user from project members
        project.members = project.members.filter(
            (mId) => mId.toString() !== memberId.toString()
        );
        await project.save();

        // Unassign member from project tasks (set assignedTo to null)
        await Task.updateMany(
            { project: id, assignedTo: memberId },
            { $set: { assignedTo: null } }
        );

        const updatedProject = await Project.findById(id)
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position");

        res.status(200).json({
            message: "Member removed and unassigned from tasks successfully",
            project: updatedProject,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not remove member",
            error: error.message,
        });
    }
};

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
};