const Project = require("../models/Project");
const User = require("../models/User");

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

const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position");

        if (!project) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        const isMember = project.members.some(
            (member) => member._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
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

const addProjectMember = async (req, res) => {
    try {
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

        if (project.owner.toString() !== req.user._id.toString()) {
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

        const alreadyMember = project.members.some(
            (memberId) => memberId.toString() === user._id.toString()
        );

        if (alreadyMember) {
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

module.exports = {
    createProject,
    getProjects,
    getProjectById,
    addProjectMember,
};