const Task = require("../models/Task");
const Project = require("../models/Project");

const isProjectMember = (project, userId) => {
    return project.members.some(
        (memberId) => memberId.toString() === userId.toString()
    );
};

const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, status, priority, dueDate } =
            req.body;

        if (!title || !project || !dueDate) {
            return res.status(400).json({
                message: "Please provide task title, project and due date",
            });
        }

        const targetProject = await Project.findById(project);

        if (!targetProject) {
            return res.status(404).json({
                message: "Project not found",
            });
        }

        if (!isProjectMember(targetProject, req.user._id)) {
            return res.status(403).json({
                message: "You are not a member of this project",
            });
        }

        const task = await Task.create({
            title,
            description,
            project,
            assignedTo: assignedTo || null,
            createdBy: req.user._id,
            status,
            priority,
            dueDate,
        });

        const populatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email avatar position")
            .populate("createdBy", "name email avatar position")
            .populate("comments.user", "name email avatar position");

        res.status(201).json({
            message: "Task created successfully",
            task: populatedTask,
        });
    } catch (error) {
        res.status(500).json({
            message: "Task creation failed",
            error: error.message,
        });
    }
};

const getProjectTasks = async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId);

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

        const tasks = await Task.find({ project: req.params.projectId })
            .populate("assignedTo", "name email avatar position")
            .populate("createdBy", "name email avatar position")
            .populate("comments.user", "name email avatar position")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch tasks",
            error: error.message,
        });
    }
};

const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate("project", "name category priority deadline")
            .populate("assignedTo", "name email avatar position")
            .populate("createdBy", "name email avatar position")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: tasks.length,
            tasks,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch your tasks",
            error: error.message,
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await Project.findById(task.project);

        if (!project || !isProjectMember(project, req.user._id)) {
            return res.status(403).json({
                message: "You cannot update this task",
            });
        }

        const allowedFields = [
            "title",
            "description",
            "assignedTo",
            "status",
            "priority",
            "dueDate",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                task[field] = req.body[field];
            }
        });

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email avatar position")
            .populate("createdBy", "name email avatar position")
            .populate("comments.user", "name email avatar position");

        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(500).json({
            message: "Task update failed",
            error: error.message,
        });
    }
};

const addTaskComment = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || text.trim().length === 0) {
            return res.status(400).json({
                message: "Comment text is required",
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await Project.findById(task.project);

        if (!project || !isProjectMember(project, req.user._id)) {
            return res.status(403).json({
                message: "You cannot comment on this task",
            });
        }

        task.comments.push({
            user: req.user._id,
            text,
        });

        await task.save();

        const updatedTask = await Task.findById(task._id)
            .populate("assignedTo", "name email avatar position")
            .populate("createdBy", "name email avatar position")
            .populate("comments.user", "name email avatar position");

        res.status(200).json({
            message: "Comment added successfully",
            task: updatedTask,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not add comment",
            error: error.message,
        });
    }
};

module.exports = {
    createTask,
    getProjectTasks,
    getMyTasks,
    updateTask,
    addTaskComment,
};