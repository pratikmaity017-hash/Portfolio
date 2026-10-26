const express = require("express");

const {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const { requireAdmin } = require("../middlewares/authmiddleware");

const router = express.Router();

// Public: view published projects
router.get("/", getProjects);

// Admin only: modify projects
router.post("/", requireAdmin, createProject);
router.patch("/:id", requireAdmin, updateProject);
router.delete("/:id", requireAdmin, deleteProject);

module.exports = router;
