const express = require("express");
const {
    createTask,
    getProjectTasks,
    getMyTasks,
    updateTask,
    addTaskComment,
} = require("../controllers/taskController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createTask);
router.get("/my-tasks", protect, getMyTasks);
router.get("/project/:projectId", protect, getProjectTasks);
router.put("/:id", protect, updateTask);
router.post("/:id/comments", protect, addTaskComment);

module.exports = router;