const { db } = require("../config/firebase");

/**
 * POST /api/concerns
 * Create a new concern/grievance
 */
const createConcern = async (req, res, next) => {
    try {
        const { uid, role } = req.user;
        const { title, category, priority, description, anonymous, againstHr } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, error: "Title and description are required" });
        }

        // Fetch user name from Firestore if not anonymous
        let submittedByName = "Employee";
        if (!anonymous) {
            try {
                // Check Staff first
                const staffDoc = await db.collection("Staff").doc(uid).get();
                if (staffDoc.exists) {
                    submittedByName = staffDoc.data().name || "Staff Member";
                } else {
                    // Check employees
                    const empDoc = await db.collection("employees").doc(uid).get();
                    if (empDoc.exists) {
                        submittedByName = empDoc.data().employeeData?.name || empDoc.data().name || "Employee";
                    }
                }
            } catch (e) {
                console.warn("Could not fetch name for concern:", e.message);
            }
        }

        // Determine targetRole based on business logic
        let targetRole = "HR";
        const userRoleLower = (role || "").toLowerCase().trim();

        // Strict Routing Logic
        if (userRoleLower.includes("admin")) {
            // Admin reports go to HR
            targetRole = "HR";
        } else if (userRoleLower.includes("hr")) {
            // HR reports go to Admin
            targetRole = "ADMIN";
        } else {
            // Employees (and others) go to HR by default, or Admin if "againstHr" is checked
            targetRole = againstHr ? "ADMIN" : "HR";
        }

        console.log(`[Concerns] Routing concern from role "${role}" (againstHr: ${againstHr}) to target: "${targetRole}"`);
        const concernData = {
            title,
            category: category || "Other",
            priority: priority || "Medium",
            description,
            anonymous: !!anonymous,
            submittedBy: anonymous ? "Anonymous" : submittedByName,
            submittedById: uid,
            targetRole,
            againstHr: !!againstHr,
            status: "Open",
            isCancelled: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const docRef = await db.collection("concerns").add(concernData);
        
        res.status(201).json({
            success: true,
            message: "Concern submitted successfully",
            data: { id: docRef.id, ...concernData }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/concerns
 * Fetch concerns based on user role and visibility rules
 */
const getConcerns = async (req, res, next) => {
    try {
        const { uid, role } = req.user;
        const userRoleLower = (role || "").toLowerCase();
        
        let query = db.collection("concerns").where("isCancelled", "==", false);

        // RBAC Filtering
        const snapshot = await query.get();
        let concerns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Filter in memory to satisfy complex visibility rules (targetRole OR submittedById)
        concerns = concerns.filter(c => {
            const isCreator = c.submittedById === uid;
            const isTargetAdmin = c.targetRole === "ADMIN";
            const isTargetHR = c.targetRole === "HR";

            const isAdminUser = userRoleLower.includes("admin");
            const isHRUser = userRoleLower.includes("hr");

            if (isCreator) {
                console.log(`[Concerns] Showing concern "${c.title}" to user ${uid} because they are the OWNER.`);
                return true;
            }

            if (isAdminUser && isTargetAdmin) {
                console.log(`[Concerns] Showing concern "${c.title}" to user ${uid} because they are an ADMIN.`);
                return true;
            }

            if (isHRUser && isTargetHR) {
                console.log(`[Concerns] Showing concern "${c.title}" to user ${uid} because they are HR.`);
                return true;
            }

            return false;
        });

        console.log(`[Concerns] Visibility check for User: ${uid} (Role: ${role}). Found ${concerns.length} visible concerns.`);

        // Sort by createdAt desc
        concerns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json({ success: true, data: concerns });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/concerns/:id/status
 * Update the status of a concern (HR/Admin only)
 */
const updateStatus = async (req, res, next) => {
    try {
        const { role } = req.user;
        const { id } = req.params;
        const { status } = req.body;

        const userRoleLower = (role || "").toLowerCase();
        const isAdminOrHR = userRoleLower === "admin" || userRoleLower.includes("hr");

        if (!isAdminOrHR) {
            return res.status(403).json({ success: false, error: "Unauthorized. Only HR or Admin can update status." });
        }

        const validStatuses = ["Open", "In Progress", "Resolved"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: "Invalid status" });
        }

        const concernRef = db.collection("concerns").doc(id);
        const doc = await concernRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: "Concern not found" });
        }

        await concernRef.update({
            status,
            updatedAt: new Date().toISOString()
        });

        res.json({ success: true, message: `Status updated to ${status}` });
    } catch (error) {
        next(error);
    }
};

/**
 * PUT /api/concerns/:id/cancel
 * Cancel a concern (Creator only)
 */
const cancelConcern = async (req, res, next) => {
    try {
        const { uid } = req.user;
        const { id } = req.params;

        const concernRef = db.collection("concerns").doc(id);
        const doc = await concernRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, error: "Concern not found" });
        }

        if (doc.data().submittedById !== uid) {
            return res.status(403).json({ success: false, error: "Unauthorized. Only the creator can cancel this concern." });
        }

        await concernRef.delete();

        res.json({ success: true, message: "Concern deleted successfully from database" });
    } catch (error) {
        next(error);
    }
};

const getAllConcerns = async (req, res, next) => {
    try {
        const snapshot = await db.collection("concerns").where("isCancelled", "==", false).get();
        const concerns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        concerns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        res.json({ success: true, data: concerns });
    } catch (error) {
        next(error);
    }
};

module.exports = { createConcern, getConcerns, updateStatus, cancelConcern, getAllConcerns };
