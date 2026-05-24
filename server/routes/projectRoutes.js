const express = require("express");
const {
    createProject,
    getProjects,
    getProjectById,
    addProjectMember,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.post("/:id/members", protect, addProjectMember);

module.exports = router;