const express = require("express");
const {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addProjectMember,
    removeProjectMember,
} = require("../controllers/projectController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectById);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);
router.post("/:id/members", protect, addProjectMember);
router.delete("/:id/members/:memberId", protect, removeProjectMember);

module.exports = router;