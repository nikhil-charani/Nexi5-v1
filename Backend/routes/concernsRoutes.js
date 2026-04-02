const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { createConcern, getConcerns, updateStatus, cancelConcern, getAllConcerns } = require("../controllers/concernsController");

// MidTier route — accessible to all authenticated users
router.get("/", verifyToken, getConcerns);

// Public debug route — returns all data without filtering
router.get("/public", getAllConcerns);
router.post("/", verifyToken, createConcern);

// Status updates - restricted to Admin/HR internally via controller
router.put("/:id/status", verifyToken, updateStatus);

// Cancellation - restricted to Creator internally via controller
router.put("/:id/cancel", verifyToken, cancelConcern);

module.exports = router;
