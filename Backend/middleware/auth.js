const {admin, db} = require("../config/firebase")

const verifyToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        
        // Block access if auth header is missing/invalid.
        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, error: "Unauthorized" });
        }

        const token = header.split(" ")[1];
        
        // Development Token Bypass
        if (token.startsWith("dev-token-")) {
            const uid = token.replace("dev-token-", "");
            console.log("Using Development Token for UID:", uid);
            
            try {
                const userRecord = await admin.auth().getUser(uid);
                // Look up role from Staff collection (correct collection for non-employees)
                let role = userRecord.customClaims?.role || "Employee";
                const staffDoc = await db.collection("Staff").doc(uid).get();
                if (staffDoc.exists && staffDoc.data()?.role) {
                    role = staffDoc.data().role;
                } else {
                    const empDoc = await db.collection("employees").doc(uid).get();
                    if (empDoc.exists) {
                        role = empDoc.data()?.employeeData?.role || empDoc.data()?.role || role;
                    }
                }
                console.log(`Dev token auth OK: uid=${uid}, role=${role}`);
                req.user = {
                    uid: userRecord.uid,
                    id: userRecord.uid,
                    email: userRecord.email,
                    role
                };
            } catch (err) {
                console.error("Dev token auth error:", err.message);
                req.user = { uid, id: uid, email: "unknown@example.com", role: "Employee" };
            }
            return next();
        }

        console.log(`Verifying token for ${req.path}...`);
        const decodedToken = await admin.auth().verifyIdToken(token);
        const uid = decodedToken.uid;

        // Look up role from Firestore (non-employees stored in 'Staff', employees in 'employees')
        let role = decodedToken.customClaims?.role || "Employee";
        try {
            // First try 'Staff' collection (for Admin, HR Head, Manager etc.)
            const staffDoc = await db.collection("Staff").doc(uid).get();
            if (staffDoc.exists && staffDoc.data()?.role) {
                role = staffDoc.data().role;
            } else {
                // Fallback: check 'employees' collection
                const empDoc = await db.collection("employees").doc(uid).get();
                if (empDoc.exists) {
                    role = empDoc.data()?.employeeData?.role || empDoc.data()?.role || role;
                }
            }
        } catch (e) {
            console.warn("Could not fetch user role from Firestore:", e.message);
        }

        req.user = {
            uid,
            id: uid,
            email: decodedToken.email,
            role
        };
        console.log(`Auth OK: uid=${uid}, role=${role}`);
        next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error.message);
<<<<<<< Lokesh
        // Fallback user even on error to prevent blocking the request during development
        req.user = {
            uid: "dev-user-error",
            id: "dev-user-error",
            email: "dev@example.com",
            role: "Admin"
        };
        next();
=======
        return res.status(401).json({ success: false, error: "Unauthorized" });
>>>>>>> main
    }
}

module.exports={verifyToken}
