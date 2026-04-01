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
        console.error("[AUTH] 🔥 FIREBASE_WEB_API_KEY is missing from environment variables!");
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

                    const errorMessage = parsed?.error?.message || "UNKNOWN";
                    
                    // DIAGNOSTIC LOG: This will tell us the EXACT reason for failure
                    console.log(`[AUTH] Firebase Verify Response: Status=${resp.statusCode}, Error="${errorMessage}", Email="${email}"`);

                    // Treat success only when Firebase returned an idToken.
                    if (resp.statusCode >= 200 && resp.statusCode < 300 && parsed?.idToken) {
                        return resolve({ success: true });
                    }

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

        req.on("error", (err) => {
            console.error("[AUTH] 🚨 Network error verifying Firebase password:", err.message);
            reject(err);
        });
        req.write(body);
        req.end();
    });
};

// Look up employee email based on employeeId/username typed in UI.
const resolveEmployeeByEmployeeIdOrUsername = async (inputRaw) => {
    const input = String(inputRaw ?? "").trim();
    if (!input) return { email: null, employeeDocData: null };

    // Accept any prefix by adding the input as-is.
    // The previous logic was hardcoded to "EMP-", now we just use the input.
    // Smart matching: include input with and without common prefix patterns
    const normalizedInputs = [
        input, 
        input.toUpperCase(), 
        input.toLowerCase(),
        input.includes("-") ? input.replace("-", "") : null, // If input is "NEX-12345", also check "NEX12345"
    ].filter(Boolean);
    
    const inputsLower = normalizedInputs.map((v) => v.toLowerCase());

    // 1) Try indexed Firestore queries first 
    for (const candidate of normalizedInputs) {
        console.log(`[AUTH] Resolving Employee ID: "${candidate}"`);
        
        // Exact match on employeeData.employeeId
        const empIdSnap = await db.collection("employees").where("employeeData.employeeId", "==", candidate).limit(1).get();
        if (!empIdSnap.empty) {
            const data = empIdSnap.docs[0].data();
            const foundEmail = data?.employeeData?.email || data?.email;
            console.log(`[AUTH] ✅ Match found in employeeData. Email: ${foundEmail}`);
            return { email: foundEmail, employeeDocData: data };
        }

        // Exact match on root-level employeeId
        const rootIdSnap = await db.collection("employees").where("employeeId", "==", candidate).limit(1).get();
        if (!rootIdSnap.empty) {
            const data = rootIdSnap.docs[0].data();
            const foundEmail = data?.email || data?.employeeData?.email;
            console.log(`[AUTH] ✅ Match found at root level. Email: ${foundEmail}`);
            return { email: foundEmail, employeeDocData: data };
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

    // 3) If input is email-like, search for an employee record with this email
    if (input.includes("@")) {
        const inputLower = input.toLowerCase();
        console.log(`[AUTH] Resolving by email: "${inputLower}"`);
        
        // Search in employeeData.email
        const emailSnap = await db.collection("employees").where("employeeData.email", "==", inputLower).limit(1).get();
        if (!emailSnap.empty) {
            const data = emailSnap.docs[0].data();
            console.log(`[AUTH] ✅ Found employee by email in employeeData.`);
            return { email: inputLower, employeeDocData: data };
        }

        // Search in root email
        const rootEmailSnap = await db.collection("employees").where("email", "==", inputLower).limit(1).get();
        if (!rootEmailSnap.empty) {
            const data = rootEmailSnap.docs[0].data();
            console.log(`[AUTH] ✅ Found employee by email at root level.`);
            return { email: inputLower, employeeDocData: data };
        }

        return { email: inputLower, employeeDocData: null };
    }

    console.log(`[AUTH] ❌ No employee record found for identifier: "${input}"`);
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
        // employeeId can be sent as 'username' or 'employeeId' from frontend
        let { email, username, employeeId: empIdBody, password } = req.body;
        
        // Clean up inputs
        email = String(email || "").trim().toLowerCase();
        const employeeIdentifier = String(username || empIdBody || "").trim();

        if (!email && !employeeIdentifier) {
            return res.status(400).json({ success: false, error: "Email or Employee ID is required" });
        }
        if (!password) {
            return res.status(400).json({ success: false, error: "Password is required" });
        }

        // Employee login: resolve identifier (Email or ID) to ensure they exist in our DB
        let employeeDocData = null;
        const resolved = await resolveEmployeeByEmployeeIdOrUsername(email || employeeIdentifier);
        
        // Update email from resolution if needed
        if (resolved.email) email = resolved.email;
        employeeDocData = resolved.employeeDocData;

        // If it's an Employee-only identifier and we found nothing, block immediately.
        if (!email) {
            return res.status(401).json({
                success: false,
                error: "No employee found with this ID. Please check your credentials or contact HR.",
            });
        }

        // Verify password BEFORE returning success.
        const authResult = await verifyFirebasePassword(email, password);
        if (!authResult.success) {
            const errorMsg = authResult.reason === "INVALID_CREDENTIALS" 
                ? "Invalid Email/Employee ID or password." 
                : `Authentication Error: ${authResult.reason}`;
            
            return res.status(401).json({
                success: false,
                error: errorMsg,
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
            // STRICT CHECK: An employee MUST have a document in the 'employees' collection
            if (!employeeDocData) {
                // Fallback 1: Check by UID as document ID
                const empDoc = await db.collection("employees").doc(userRecord.uid).get();
                if (empDoc.exists) {
                    employeeDocData = empDoc.data();
                } else {
                    // Fallback 2: Scan by uid field inside document (handles older records)
                    const uidSnap = await db.collection("employees")
                        .where("employeeData.uid", "==", userRecord.uid)
                        .limit(1).get();
                    if (!uidSnap.empty) {
                        employeeDocData = uidSnap.docs[0].data();
                        console.log(`[AUTH] ✅ Found employee by UID field in employeeData.`);
                    } else {
                        const rootUidSnap = await db.collection("employees")
                            .where("uid", "==", userRecord.uid)
                            .limit(1).get();
                        if (!rootUidSnap.empty) {
                            employeeDocData = rootUidSnap.docs[0].data();
                            console.log(`[AUTH] ✅ Found employee by UID field at root level.`);
                        }
                    }
                }
                if (!employeeDocData) {
                    console.error(`[AUTH] ❌ Blocked login: Firebase user ${email} (${userRecord.uid}) has role 'Employee' but no record in Firestore 'employees' collection.`);
                    return res.status(403).json({
                        success: false,
                        error: "Account record not found. Please contact HR.",
                    });
                }
            }
            
            profileData = employeeDocData.employeeData || employeeDocData || {};
            requiresPasswordChange = getEmployeeRequiresPasswordChange(employeeDocData);
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