const { auth, db } = require("../config/firebase");

// Exact Role Definitions matched with Frontend Dashboard.jsx
const VALID_ROLES = ["Admin", "HR Head", "HR Accountant", "HR Recruiter", "Manager", "BDE", "Employee"];

// Roles that are allowed to self-register
const SELF_REGISTER_ROLES = ["Admin", "HR Head", "HR Accountant", "HR Recruiter", "Manager", "BDE"];

// Map each role to a frontend dashboard path
const ROLE_DASHBOARD_MAP = {
    "Admin":          "/dashboard",
    "HR Head":        "/dashboard",
    "HR Accountant":  "/dashboard",
    "HR Recruiter":   "/dashboard",
    "Manager":        "/dashboard",
    "BDE":            "/dashboard",
    "Employee":       "/dashboard",
};

/**
 * Register a user.
 * Expects: { name, email, password, role }
 * 
 * RULES:
 *  - Role "employee" is BLOCKED from self-registration.
 *    Employees are created by HR via the Add Employee form (employeecontroller.js).
 *  - All other roles (Admin, HR, Manager, BDE, etc.) are allowed.
 */
const register = async (req, res, next) => {
    try {
        const { name = "", email, password, role = "" } = req.body;

        if (!email || !password || !name || !role) {
            return res.status(400).json({
                success: false,
                error: "Name, email, password and role are required",
            });
        }
        console.log("All fields are entered")
        const roleLower = role.toLowerCase().trim();
        const roleIndex = VALID_ROLES.findIndex(r => r.toLowerCase() === roleLower);
        
        if (roleIndex === -1) {
            return res.status(400).json({
                success: false,
                error: `Invalid role. Allowed roles: ${VALID_ROLES.join(", ")}`,
            });
        }
        
        const properRole = VALID_ROLES[roleIndex];

        // BLOCK employee self-registration
        if (properRole === "Employee") {
            return res.status(403).json({
                success: false,
                error: "Employees cannot self-register. Please contact HR to get your account created.",
            });
        }

        if (!SELF_REGISTER_ROLES.includes(properRole)) {
            return res.status(400).json({
                success: false,
                error: `Self-registration is not allowed for this role.`,
            });
        }

        // Split name
        const parts = name.trim().split(/\s+/);
        const firstName = parts[0] || "";
        const lastName  = parts.slice(1).join(" ") || "";

        // 1. Create Firebase Auth user
        let userRecord;
        try {
            userRecord = await auth.createUser({ email, password, displayName: name });
        } catch (authError) {
            if (authError.code === "auth/email-already-exists") {
                return res.status(409).json({
                    success: false,
                    error: "An account with this email already exists. Please login.",
                });
            }
            throw authError;
        }

        // 2. Set role as Firebase custom claim
        await auth.setCustomUserClaims(userRecord.uid, { role: properRole });

        // 3. Determine collection based on role
        const staffId = `STAFF-${Date.now()}`;
        const profileData = {
            staffId,
            uid: userRecord.uid,
            name,
            firstName,
            lastName,
            email,
            role: properRole,
            status: "active",
            createdAt: new Date().toISOString(),
        };

        // Store in a "Staff" collection for non-employee roles
        await db.collection("Staff").doc(userRecord.uid).set(profileData);

        return res.status(201).json({
            success: true,
            message: `${properRole} account created successfully. You can now login.`,
            uid: userRecord.uid,
            role: properRole,
        });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ success: false, error: error.message, stack: error.stack });
    }
};

/**
 * Login a user.
 * Expects: { email, password }
 * 
 * Returns:
 *  - user profile with role
 *  - dashboardPath: the frontend route to redirect to after login
 *
 * NOTE: Firebase Admin SDK cannot verify passwords server-side.
 * This endpoint looks up the user profile. The actual password verification
 * is done by Firebase Client SDK on the frontend (signInWithEmailAndPassword).
 * This route is used as a "get profile after auth" endpoint.
 */
const login = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: "Email is required" });
        }

        // Look up Firebase Auth record
        let userRecord;
        try {
            userRecord = await auth.getUserByEmail(email);
        } catch (err) {
            if (err.code === "auth/user-not-found") {
                return res.status(401).json({
                    success: false,
                    error: "No account found with this email. Please register first.",
                });
            }
            throw err;
        }

        const role = userRecord.customClaims?.role || "Employee";

        // Fetch profile from appropriate collection
        let profileData = {};
        if (role === "Employee" || role === "employee") {
            const empDoc = await db.collection("employees").doc(userRecord.uid).get();
            if (empDoc.exists) {
                profileData = empDoc.data()?.employeeData || {};
            }
        } else {
            const staffDoc = await db.collection("Staff").doc(userRecord.uid).get();
            if (staffDoc.exists) {
                profileData = staffDoc.data() || {};
            }
        }

        const dashboardPath = ROLE_DASHBOARD_MAP[role] || "/dashboard";

        return res.json({
            success: true,
            user: {
                uid: userRecord.uid,
                email: userRecord.email,
                name: userRecord.displayName || profileData.name || "",
                role,
                dashboardPath,
                ...profileData,
            },
            token: `dev-token-${userRecord.uid}`,
            dashboardPath,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
