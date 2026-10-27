const express = require("express");

const {
  getProjects,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

const { requireAdmin } = require("../middlewares/authmiddleware");

const { verifyCsrfToken } = require("../middlewares/csrfProtection");

const router = express.Router();

// Public: published projects only
router.get("/", getProjects);

// Admin: all projects, including unpublished
router.get("/admin", requireAdmin, getAdminProjects);

// Admin: protected write operations
router.post("/", requireAdmin, verifyCsrfToken, createProject);

router.patch("/:id", requireAdmin, verifyCsrfToken, updateProject);

router.delete("/:id", requireAdmin, verifyCsrfToken, deleteProject);

module.exports = router;
