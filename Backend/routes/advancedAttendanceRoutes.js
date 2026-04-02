const express = require("express")
const router = express.Router();
const { 
    getAttendanceSummary, 
    getAttendanceDaily, 
    getMonthlyAttendance, 
    getProjectSummary 
} = require("../controllers/advancedAttendanceController");
const { verifyToken, isAdminOrHR } = require("../middleware/auth");

// All advanced analytics routes are protected
router.use(verifyToken);

// Routes
router.get("/summary", getAttendanceSummary);
router.get("/daily", getAttendanceDaily);
router.get("/monthly", getMonthlyAttendance);
router.get("/project-summary", getProjectSummary);

module.exports = router;
