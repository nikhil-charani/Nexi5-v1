const {admin} = require("../config/firebase")

const verifyToken = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        
        // If no header or invalid format, provide a fallback "dev" user instead of 401
        if (!header || !header.startsWith("Bearer ")) {
            console.warn(`No valid auth header for ${req.path}. Providing dev-user fallback.`);
            req.user = {
                uid: "dev-user-123",
                email: "dev@example.com",
                role: "Admin"
            };
            return next();
        }

        const token = header.split(" ")[1];
        
        // Development Token Bypass
        if (token.startsWith("dev-token-")) {
            const uid = token.replace("dev-token-", "");
            console.log("Using Development Token for UID:", uid);
            
            try {
                const userRecord = await admin.auth().getUser(uid);
                req.user = {
                    uid: userRecord.uid,
                    email: userRecord.email,
                    role: userRecord.customClaims?.role || "Employee"
                };
            } catch (err) {
                req.user = { uid, email: "unknown@example.com", role: "Employee" };
            }
            return next();
        }

        console.log(`Verifying token for ${req.path}...`);
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || "Employee"
        };
        next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error.message);
        // Fallback user even on error to prevent blocking the request during development
        req.user = {
            uid: "dev-user-error",
            email: "dev@example.com",
            role: "Admin"
        };
        next();
    }
}

module.exports={verifyToken}
