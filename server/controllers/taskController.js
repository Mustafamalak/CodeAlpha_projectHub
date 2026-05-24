const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");
const { isProjectMember, isProjectOwner } = require("../middleware/authMiddleware");

// POST /api/tasks - Create task
const createTask = async (req, res) => {
    try {
        const { title, description, project, assignedTo, status, priority, dueDate } = req.body;

        if (!title || !project || !dueDate) {
            return res.status(400).json({
                message: "Please provide task title, project and due date",
            });
        }

        if (!mongoose.Types.ObjectId.isValid(project)) {
            return res.status(400).json({
                message: "Invalid project ID format",
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

        // If assignedTo is provided, it must be a valid project member
        if (assignedTo) {
            if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                return res.status(400).json({
                    message: "Invalid assignedTo ID format",
                });
            }
            if (!isProjectMember(targetProject, assignedTo)) {
                return res.status(400).json({
                    message: "Assigned user must be a member of the project",
                });
            }
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

// GET /api/tasks/project/:projectId - Get all tasks for a project
const getProjectTasks = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
            return res.status(400).json({
                message: "Invalid project ID format",
            });
        }

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

// GET /api/tasks/my-tasks - Get tasks assigned to logged-in user
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate("project", "name category priority deadline")
            .populate("assignedTo", "name email avatar position")
            .populate("createdBy", "name email avatar position")
            .sort({ dueDate: 1, createdAt: -1 });

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

// GET /api/tasks/dashboard/summary - Get dashboard summary metrics for logged-in user
const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        // Total projects where user is a member
        const totalProjects = await Project.countDocuments({ members: userId });

        // Task metrics for tasks assigned to the user
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const todoTasks = await Task.countDocuments({ assignedTo: userId, status: "Todo" });
        const inProgressTasks = await Task.countDocuments({ assignedTo: userId, status: "In Progress" });
        const doneTasks = await Task.countDocuments({ assignedTo: userId, status: "Done" });
        const highPriorityTasks = await Task.countDocuments({ assignedTo: userId, priority: "High" });

        // Overdue tasks: assigned to user, status is not "Done", and dueDate in the past
        const overdueTasks = await Task.countDocuments({
            assignedTo: userId,
            status: { $ne: "Done" },
            dueDate: { $lt: new Date() }
        });

        // Recent tasks assigned to the user (limit 5)
        const recentTasks = await Task.find({ assignedTo: userId })
            .populate("project", "name category priority deadline")
            .populate("assignedTo", "name email avatar position")
            .populate("createdBy", "name email avatar position")
            .sort({ createdAt: -1 })
            .limit(5);

        // Recent projects where the user is a member (limit 5)
        const recentProjects = await Project.find({ members: userId })
            .populate("owner", "name email avatar position")
            .populate("members", "name email avatar position")
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            totalProjects,
            totalTasks,
            todoTasks,
            inProgressTasks,
            doneTasks,
            highPriorityTasks,
            overdueTasks,
            recentTasks,
            recentProjects,
        });
    } catch (error) {
        res.status(500).json({
            message: "Could not fetch dashboard summary",
            error: error.message,
        });
    }
};

// PUT /api/tasks/:id - Update task
const updateTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID format",
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
                message: "You cannot update this task",
            });
        }

        const { title, description, assignedTo, status, priority, dueDate } = req.body;

        // If assignedTo is updated, it must be a project member
        if (assignedTo !== undefined) {
            if (assignedTo !== null) {
                if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
                    return res.status(400).json({
                        message: "Invalid assignedTo ID format",
                    });
                }
                if (!isProjectMember(project, assignedTo)) {
                    return res.status(400).json({
                        message: "Assigned user must be a member of the project",
                    });
                }
                task.assignedTo = assignedTo;
            } else {
                task.assignedTo = null;
            }
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;

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

// DELETE /api/tasks/:id - Delete task (creator or project owner only)
const deleteTask = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID format",
            });
        }

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({
                message: "Associated project not found",
            });
        }

        const isCreator = task.createdBy.toString() === req.user._id.toString();
        const isOwner = isProjectOwner(project, req.user._id);

        if (!isCreator && !isOwner) {
            return res.status(403).json({
                message: "Only task creator or project owner can delete this task",
            });
        }

        await Task.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Task deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Task deletion failed",
            error: error.message,
        });
    }
};

// POST /api/tasks/:id/comments - Comment on task
const addTaskComment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid task ID format",
            });
        }

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
    getDashboardSummary,
    updateTask,
    deleteTask,
    addTaskComment,
};