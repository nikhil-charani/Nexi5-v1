const { auth, db } = require("../config/firebase");
const https = require("https");

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
 * Firebase Admin SDK can't verify passwords.
 * We validate email/password using Firebase Identity Toolkit REST API.
 */
const verifyFirebasePassword = async (email, password) => {
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!apiKey) {
        throw new Error("FIREBASE_WEB_API_KEY is not configured on the backend.");
    }

    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`;
    const body = JSON.stringify({ email, password, returnSecureToken: true });

    return new Promise((resolve, reject) => {
        const req = https.request(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Content-Length": Buffer.byteLength(body),
                },
            },
            (resp) => {
                let raw = "";
                resp.on("data", (chunk) => (raw += chunk));
                resp.on("end", () => {
                    let parsed = null;
                    try {
                        parsed = raw ? JSON.parse(raw) : null;
                    } catch (_) {
                        parsed = null;
                    }

                    // Treat success only when Firebase returned an idToken.
                    if (resp.statusCode >= 200 && resp.statusCode < 300 && parsed?.idToken) {
                        return resolve({ success: true });
                    }

                    const errorMessage = parsed?.error?.message || "UNKNOWN";
                    const invalid =
                        errorMessage === "INVALID_PASSWORD" ||
                        errorMessage === "EMAIL_NOT_FOUND" ||
                        errorMessage === "INVALID_LOGIN_CREDENTIALS" ||
                        errorMessage === "USER_NOT_FOUND";

                    return resolve({
                        success: false,
                        reason: invalid ? "INVALID_CREDENTIALS" : errorMessage,
                    });
                });
            }
        );

        req.on("error", reject);
        req.write(body);
        req.end();
    });
};

// Look up employee email based on employeeId/username typed in UI.
const resolveEmployeeByEmployeeIdOrUsername = async (inputRaw) => {
    const input = String(inputRaw ?? "").trim();
    if (!input) return { email: null, employeeDocData: null };

    // Accept EMP- vs Emp- vs emp-
    const normalizedInputs = [input];
    if (input.toLowerCase().startsWith("emp-")) {
        normalizedInputs.push(`EMP-${input.slice(4)}`);
    }

    const inputsLower = normalizedInputs.map((v) => v.toLowerCase());

    // 1) Try indexed Firestore queries first
    for (const candidate of normalizedInputs) {
        const usernameSnap = await db
            .collection("employees")
            .where("employeeData.username", "==", candidate)
            .limit(1)
            .get();
        if (!usernameSnap.empty) {
            const data = usernameSnap.docs[0].data();
            return { email: data?.employeeData?.email, employeeDocData: data };
        }

        const empIdSnap = await db
            .collection("employees")
            .where("employeeData.employeeId", "==", candidate)
            .limit(1)
            .get();
        if (!empIdSnap.empty) {
            const data = empIdSnap.docs[0].data();
            return { email: data?.employeeData?.email, employeeDocData: data };
        }
    }

    // 2) Last-resort scan for older records + type/casing mismatch.
    const scanSnap = await db.collection("employees").limit(500).get();
    for (const doc of scanSnap.docs) {
        const data = doc.data() || {};
        const empData = data.employeeData || {};

        const candidates = [
            empData.username,
            empData.employeeId,
            data.username,
            data.employeeId,
        ].map((v) => String(v ?? "").trim().toLowerCase());

        const match = candidates.some((c) => c && inputsLower.includes(c));
        if (match) {
            return {
                email: empData.email || data?.email || null,
                employeeDocData: data,
            };
        }
    }

    // 3) If input is email-like, allow direct email login
    if (input.includes("@")) {
        return { email: input, employeeDocData: null };
    }

    return { email: null, employeeDocData: null };
};

const getEmployeeRequiresPasswordChange = (employeeDocData) => {
    if (!employeeDocData) return false;
    // Check root and nested locations. Coerce to boolean.
    const flag = !!(employeeDocData.mustChangePassword || (employeeDocData.employeeData && employeeDocData.employeeData.mustChangePassword));
    return flag;
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
        let { email, username, password } = req.body;

        if (!email && !username) {
            return res.status(400).json({ success: false, error: "Email or username is required" });
        }
        if (!password) {
            return res.status(400).json({ success: false, error: "Password is required" });
        }

        // Employee login: frontend sends `username` (employeeId/username) + password.
        let employeeDocData = null;
        if (username && !email) {
            const resolved = await resolveEmployeeByEmployeeIdOrUsername(username);
            email = resolved.email;
            employeeDocData = resolved.employeeDocData;

            if (!email) {
                return res.status(401).json({
                    success: false,
                    error: "No employee found with this username. Please check your username or contact HR.",
                });
            }
        }

        // Verify password BEFORE returning success.
        const authResult = await verifyFirebasePassword(email, password);
        if (!authResult.success) {
            return res.status(401).json({
                success: false,
                error: "Invalid username/email or password.",
            });
        }

        // Look up Firebase Auth record
        const userRecord = await auth.getUserByEmail(email);

        let role = userRecord.customClaims?.role || "Employee";
        role = String(role);
        if (role.toLowerCase() === "employee") role = "Employee";

        const dashboardPath = ROLE_DASHBOARD_MAP[role] || "/dashboard";

        // Fetch profile + password-change flag from Firestore
        let profileData = {};
        let requiresPasswordChange = false;

        if (role === "Employee") {
            if (employeeDocData) {
                profileData = employeeDocData.employeeData || {};
                requiresPasswordChange = getEmployeeRequiresPasswordChange(employeeDocData);
                console.log(`[AUTH] Login as employee via ID match. ${email}. requiresPasswordChange=${requiresPasswordChange}`);
            } else {
                const empDoc = await db.collection("employees").doc(userRecord.uid).get();
                if (empDoc.exists) {
                    const data = empDoc.data();
                    profileData = data?.employeeData || {};
                    requiresPasswordChange = getEmployeeRequiresPasswordChange(data);
                    console.log(`[AUTH] Login as employee via UID lookup. ${email}. requiresPasswordChange=${requiresPasswordChange}`);
                }
            }
        } else {
            const staffDoc = await db.collection("Staff").doc(userRecord.uid).get();
            if (staffDoc.exists) {
                const data = staffDoc.data();
                profileData = data || {};
                requiresPasswordChange = !!data?.mustChangePassword;
                console.log(`[AUTH] Login as staff role: ${role}. ${email}. requiresPasswordChange=${requiresPasswordChange}`);
            }
        }

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
            requiresPasswordChange,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Change user password.
 * Expects: { uid?, email?, newPassword }
 */
const changePassword = async (req, res, next) => {
    try {
        const { uid, email, newPassword } = req.body;

        if ((!uid && !email) || !newPassword) {
            return res.status(400).json({ success: false, error: "UID/Email and new password are required" });
        }

        let targetUid = uid;
        if (!targetUid && email) {
            const userRecord = await auth.getUserByEmail(email);
            targetUid = userRecord.uid;
        }

        await auth.updateUser(targetUid, { password: newPassword });

        // Clear mustChangePassword flag in Firestore
        const empRef = db.collection("employees").doc(targetUid);
        const empDoc = await empRef.get();

        if (empDoc.exists) {
            console.log(`[AUTH] Clearing mustChangePassword for employee: ${targetUid}`);
            await empRef.update({
                mustChangePassword: false,
                "employeeData.mustChangePassword": false,
            });
        } else {
            const staffRef = db.collection("Staff").doc(targetUid);
            const staffDoc = await staffRef.get();
            if (staffDoc.exists) {
                await staffRef.update({ mustChangePassword: false });
            }
        }

        return res.json({
            success: true,
            message: "Password updated successfully. You can now login with your new password.",
        });
    } catch (error) {
        console.error("Change Password Error:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { register, login, changePassword };
