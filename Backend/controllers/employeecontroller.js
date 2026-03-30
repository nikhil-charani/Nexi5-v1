const { db, auth } = require("../config/firebase");
const { sendEmployeeCredentials } = require("../config/emailService");

/**
 * Generate a secure temporary password.
 * Format: Emp@XXXX (easy to read, meets most password policies)
 */
const generateTempPassword = () => {
    const suffix = Math.random().toString(36).slice(-6).toUpperCase();
    return `Emp@${suffix}`;
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
        } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, error: "Employee email is required" });
        }

        // Split name into first/last
        const parts = name.trim().split(/\s+/);
        const firstName = parts[0] || "";
        const lastName = parts.slice(1).join(" ") || "";

        // 1. Generate temp password
        const tempPassword = generateTempPassword();

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
                // Still continue — just fetch existing UID
                userRecord = await auth.getUserByEmail(email);
            } else {
                throw authError;
            }
        }

        // 3. Set role claim
        await auth.setCustomUserClaims(userRecord.uid, { role: "employee" });

        // 4. Generate Employee ID
        const employeeId = `EMP-${Date.now()}`;

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
            role: "employee",
            createdAt: new Date().toISOString(),
        };

        await db.collection("employees").doc(userRecord.uid).set({
            status: status.toLowerCase(),
            leaveBalance: { casual: 12, sick: 10, annual: 15 },
            employeeData,
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
        }).then(() => {
            console.log(`✅ Credentials email sent to ${email}`);
        }).catch((emailError) => {
            console.error(`⚠️ Failed to send credentials email to ${email}:`, emailError.message);
        });

        return res.status(201).json({
            success: true,
            message: `Employee added successfully. Credentials sent to ${email}.`,
            data: {
               ...employeeData,
               tempPassword, // Include for UI display
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
        const details = users.docs.map((doc) => {
            const data = doc.data();
            return {
                uid: doc.id,
                ...data,
                ...(data.employeeData || {})
            };
        });
        res.json({ success: true, data: details });
    } catch (error) {
        console.log(error);
        next(error);
    }
};

/**
 * Get employee by UID.
 */
const getemployeebyid = async (req, res, next) => {
    try {
        const { uid } = req.params;
        const user = await db.collection("employees").doc(uid).get();
        if (!user.exists) {
            return res.status(404).json({ success: false, error: "Employee not found" });
        }
        const data = user.data();
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
        await userRef.update({ "employeeData": { ...updatedata } });
        res.json({ success: true, message: "Employee updated successfully" });
    } catch (error) {
        next(error);
    }
};

module.exports = { createEmployee, getemployee, getemployeebyid, updateemployee };