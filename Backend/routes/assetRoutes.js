const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const {
    getEmployeeByEmpId,
    createAsset,
    getAllAssets,
    updateAsset,
    deleteAsset,
    getMyAssets,
    createRequest,
    getMyRequests,
    getAllRequests,
    updateRequestStatus
} = require("../controllers/assetController");

/**
 * Middleware to check if user is HR or Admin.
 * Existing roles in the system: Admin, HR Head, HR Recruiter, HR Accountant, Manager, Employee, BDE.
 */
const isHRorAdmin = (req, res, next) => {
    const role = (req.user && req.user.role) || "Employee";
    const allowedRoles = ["Admin", "HR Head", "HR Recruiter", "HR Accountant"];
    
    if (allowedRoles.includes(role)) {
        return next();
    }
    
    return res.status(403).json({ success: false, error: "Access denied: HR or Admin privileges required." });
};

/**
 * ROUTES
 */

// Employee Lookup (by custom Employee ID)
router.get("/employee-lookup/:empId", verifyToken, isHRorAdmin, getEmployeeByEmpId);

// Public View for Debugging (View JSON in browser)
router.get("/public-view", getAllAssets);

// Assets (HR/Admin only)
router.post("/assets", verifyToken, isHRorAdmin, createAsset);
router.get("/assets", verifyToken, isHRorAdmin, getAllAssets);
router.put("/assets/:id", verifyToken, isHRorAdmin, updateAsset);
router.delete("/assets/:id", verifyToken, isHRorAdmin, deleteAsset);

// My Assets (Employee view)
router.get("/my-assets", verifyToken, getMyAssets);

// Requests (All authenticated users can create)
router.post("/requests", verifyToken, createRequest);
router.get("/my-requests", verifyToken, getMyRequests);

// Requests (HR/Admin only)
router.get("/requests", verifyToken, isHRorAdmin, getAllRequests);
router.put("/requests/:id", verifyToken, isHRorAdmin, updateRequestStatus);

module.exports = router;
