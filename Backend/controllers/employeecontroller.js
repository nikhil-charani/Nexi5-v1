const { db, auth } = require("../config/firebase");
const { sendEmployeeCredentials } = require("../config/emailService");

/**
 * Derive a 3-character prefix from company name.
 * Example: "Wipro" -> "WIP", "Amazon India" -> "AMZ", default -> "EMP"
 */
const getCompanyPrefix = (companyName) => {
    if (!companyName || typeof companyName !== "string") return "EMP";
    const clean = companyName.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
    return clean.slice(0, 3) || "EMP";
};

/**
 * Generate a secure temporary password.
 * Format: [PREFIX]@XXXX (easy to read, meets most password policies)
 */
const generateTempPassword = (prefix = "EMP") => {
    const suffix = Math.random().toString(36).slice(-6).toUpperCase();
    return `${prefix}@${suffix}`;
};

/**
 * HR adds a new employee.
 * Frontend (EmployeeDrawer) sends:
 *   { name, email, department, designation, manager, joiningDate, status, basicSalary, allowances }
 *
 * Backend will:
 *  1. Generate a temporary password
 *  2. Create a Firebase Auth user (with email + temp password)
 *  3. Save full employee profile to Firestore
 *  4. Send credentials email to the employee's email address
 */
const createEmployee = async (req, res, next) => {
    try {
        const {
            name = "",
            email,
            department = "General",
            designation = "Employee",
            manager = "",
            joiningDate = new Date().toISOString().split("T")[0],
            status = "Active",
            basicSalary = 0,
            allowances = 0,
            phone = "",
            dob = "",
            gender = "",
            address = "",
            employeeType = "Full-time",
            company = "Nexi5",
        } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: "Employee email is required" });
        }

        // Split name into first/last
        const parts = name.trim().split(/\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        // 0. Determine Prefix
        const prefix = getCompanyPrefix(company);

        // 1. Generate temp password
        const tempPassword = generateTempPassword(prefix);

        // 2. Create Firebase Auth user
        let userRecord;
        try {
            userRecord = await auth.createUser({
                email,
                password: tempPassword,
                displayName: name,
            });
        } catch (authError) {
            if (authError.code === "auth/email-already-exists") {
                return res.status(409).json({ success: false, error: "An account with this email already exists in the authentication system." });
            }
            throw authError;
        }

        // 3. Set role claim
        await auth.setCustomUserClaims(userRecord.uid, { role: "employee" });

        // 4. Generate Employee ID (Prefix-XXXXX)
        let numericPart;
        if (company.toLowerCase() === "charani") {
            const charaniSnap = await db.collection("employees").get();
            let maxSeq = 0;
            charaniSnap.docs.forEach(doc => {
                const empData = doc.data().employeeData || {};
                const comp = (empData.company || "").toLowerCase();
                if (comp === "charani") {
                    const eid = empData.employeeId || "";
                    const match = eid.match(/738(\d+)/);
                    if (match) {
                        const seq = parseInt(match[1], 10);
                        if (seq > maxSeq) maxSeq = seq;
                    }
                }
            });
            const nextSeq = (maxSeq + 1).toString().padStart(2, "0");
            numericPart = `738${nextSeq}`;
        } else {
            numericPart = Math.floor(10000 + Math.random() * 90000).toString(); // random 5-digit number
        }

        const employeeId = `${prefix}-${numericPart}`;

        // 5. Save to Firestore
        const employeeData = {
            employeeId,
            uid: userRecord.uid,
            name,
            firstName,
            lastName,
            email,
            phone,
            dob,
            gender,
            address,
            department,
            designation,
            manager,
            joiningDate,
            status,
            basicSalary: Number(basicSalary),
            allowances: Number(allowances),
            employeeType,
            company,
            role: "employee",
            createdAt: new Date().toISOString(),
        };

        await db.collection("employees").doc(userRecord.uid).set({
            status: status.toLowerCase(),
            mustChangePassword: true, // Force password change on first login
            leaveBalance: { casual: 12, sick: 10, annual: 15 },
            employeeData: {
                ...employeeData,
                mustChangePassword: true
            },
        });

        // 6. Send credentials email (Background)
        sendEmployeeCredentials({
            toEmail: email,
            fullName: name,
            employeeId,
            tempPassword,
            department,
            designation,
            joiningDate,
            company,
        }).then(() => {
            console.log(`✅ Credentials email sent to ${email}`);
        }).catch((emailError) => {
            console.error(`⚠️ Failed to send credentials email to ${email}:`, emailError.message);
        });

        return res.status(201).json({
            success: true,
            message: `Employee added successfully. Credentials sent to ${email}.`,
            data: {
               uid: userRecord.uid,
               ...employeeData,
               status: status.toLowerCase(),
               tempPassword, 
               leaveBalance: { casual: 12, sick: 10, annual: 15 }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all employees.
 */
const getemployee = async (req, res, next) => {
    try {
        const users = await db.collection("employees").get();
        
        // Fetch TODAY'S attendance for all employees
        const today = new Date().toISOString().split("T")[0];
        const attendanceSnapshot = await db.collection("attendance").where("date", "==", today).get();
        
        const attendanceMap = {};
        attendanceSnapshot.docs.forEach(doc => {
            const data = doc.data();
            attendanceMap[data.employeeId] = {
                checkin: data.checkin,
                checkout: data.checkout
            };
        });

        const details = users.docs.map((doc) => {
            const data = doc.data();
            const attendance = attendanceMap[doc.id] || null;
            
            let todayDuration = 0;
            if (attendance) {
                if (attendance.checkout) {
                    todayDuration = attendance.totalHours || 0;
                } else if (attendance.checkin) {
                    // LIVE Calculation for active sessions
                    const start = new Date(attendance.checkin).getTime();
                    const now = new Date().getTime();
                    todayDuration = parseFloat(((now - start) / (1000 * 60 * 60)).toFixed(2));
                }
            }

            const flattened = {
                uid: doc.id,
                ...data,
                ...(data.employeeData || {}),
                todayCheckIn: attendance?.checkin || null,
                todayCheckOut: attendance?.checkout || null,
                todayDuration: todayDuration,
                isActiveNow: !!(attendance?.checkin && !attendance?.checkout)
            };
            
            if (!flattened.employeeId) {
                flattened.employeeId = flattened.id || `EMP-${doc.id.slice(0, 8).toUpperCase()}`;
            }
            
            return flattened;
        });
        res.json({ success: true, data: details });
    } catch (error) {
        console.log("getemployee error:", error);
        next(error);
    }
};

/**
 * Get employee by UID.
 */
const getemployeebyid = async (req, res, next) => {
    try {
        const { uid } = req.params;
        let user = await db.collection("employees").doc(uid).get();
        let data = {};
        let exists = false;

        if (user.exists) {
            data = user.data();
            exists = true;
        } else {
            // Check Staff collection for HR/Admin profiles
            user = await db.collection("Staff").doc(uid).get();
            if (user.exists) {
                data = user.data();
                exists = true;
            }
        }

        if (!exists) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }

        res.json({ 
            success: true, 
            uid: user.id, 
            data: { 
                uid: user.id,
                ...data,
                ...(data.employeeData || {})
            } 
        });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

/**
 * Update employee.
 */
const updateemployee = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const updatedata = req.body;
        const userRef = db.collection("employees").doc(uid);
        
        // Fetch existing data to safely merge nested employeeData
        const existingDoc = await userRef.get();
        if (!existingDoc.exists) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        
        const existingData = existingDoc.data();
        const mergedEmployeeData = { 
            ...(existingData.employeeData || {}), 
            ...updatedata 
        };
        
        await userRef.update({ employeeData: mergedEmployeeData });
        
        // Return the full merged object for immediate frontend sync
        res.json({ 
            success: true, 
            message: "Employee updated successfully",
            data: {
                uid: existingDoc.id,
                ...existingData,
                ...mergedEmployeeData
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete employee.
 */
const deleteemployee = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const userRef = db.collection("employees").doc(uid);
        await userRef.delete();
        await auth.deleteUser(uid);
        res.json({ success: true, message: "Employee deleted successfully" });
    } catch (error) {
        next(error);
    }
};

/**
 * Get employee documents.
 */
const getEmployeeDocuments = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const snapshot = await db.collection("documents").where("uid", "==", uid).get();
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: docs });
    } catch (error) {
        next(error);
    }
};

/**
 * Get employee timeline.
 */
const getEmployeeTimeline = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const snapshot = await db.collection("timeline").where("uid", "==", uid).orderBy("date", "desc").get();
        let timeline = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        if (timeline.length === 0) {
            // Fallback: Generate onboarding event if timeline is empty
            const empDoc = await db.collection("employees").doc(uid).get();
            if (empDoc.exists) {
                const data = empDoc.data()?.employeeData || {};
                timeline = [{
                    event: "Company Onboarding",
                    date: data.joiningDate || new Date().toISOString().split("T")[0],
                    description: "Joined the organization and completed basic orientation.",
                    type: "milestone"
                }];
            }
        }
        
        res.json({ success: true, data: timeline });
    } catch (error) {
        next(error);
    }
};

module.exports = { createEmployee, getemployee, getemployeebyid, updateemployee, deleteemployee, getEmployeeDocuments, getEmployeeTimeline };