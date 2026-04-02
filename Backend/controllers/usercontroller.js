const { db } = require("../config/firebase");

/**
 * Get all users from both 'Staff' and 'employees' collections.
 * Normalize the response for unified consumption.
 */
const getAllUsers = async (req, res, next) => {
    try {
        // 1. Fetch from 'Staff' collection
        const staffDocs = await db.collection("Staff").get();
        const staff = staffDocs.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                type: 'Staff',
                ...data
            };
        });

        // 2. Fetch from 'employees' collection
        const employeeDocs = await db.collection("employees").get();
        const employees = employeeDocs.docs.map(doc => {
            const data = doc.data();
            return {
                uid: doc.id,
                type: 'Employee',
                ...data,
                ...(data.employeeData || {}) // Flatten employeeData if it exists
            };
        });

        // 3. Combine and return
        res.json({
            success: true,
            count: staff.length + employees.length,
            data: [...staff, ...employees]
        });
    } catch (error) {
        console.error("Error fetching all users:", error);
        next(error);
    }
};

module.exports = { getAllUsers };
