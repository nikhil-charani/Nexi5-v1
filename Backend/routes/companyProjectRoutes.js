const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject
} = require("../controllers/companyProjectController");

// All routes require authentication
router.use(verifyToken);

// GET    /api/company-projects         — All authenticated users
router.get("/", getAllProjects);

// POST   /api/company-projects         — Admin, HR Head, Manager only
router.post("/", createProject);

// PUT    /api/company-projects/:id     — Admin, HR Head, Manager only
router.put("/:id", updateProject);

// DELETE /api/company-projects/:id     — Admin, HR Head, Manager only
router.delete("/:id", deleteProject);

module.exports = router;
