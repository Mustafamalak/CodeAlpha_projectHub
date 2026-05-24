const express = require("express");
const {
    createTask,
    getProjectTasks,
    getMyTasks,
    getDashboardSummary,
    updateTask,
    deleteTask,
    addTaskComment,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/my-tasks", protect, getMyTasks);
router.get("/dashboard/summary", protect, getDashboardSummary);
router.get("/project/:projectId", protect, getProjectTasks);
router.put("/:id", protect, updateTask);
router.delete("/:id", protect, deleteTask);
router.post("/:id/comments", protect, addTaskComment);

module.exports = router;