const { db } = require("../config/firebase");
const { startOfMonth, endOfMonth, format, parseISO, differenceInHours } = require("date-fns");

/**
 * Normalizes user data and adds project info.
 */
const normalizeUser = (doc, projectMap = {}) => {
    const data = doc.data();
    const ed = data.employeeData || {};
    const uid = doc.id;
    return {
        uid,
        name: data.name || ed.name || data.employeeName || "Anonymous",
        email: data.email || ed.email || "",
        role: data.role || ed.role || "Employee",
        department: data.department || ed.department || "General",
        projects: projectMap[uid] || ["Unassigned"],
        designation: data.designation || ed.designation || "Staff",
        avatarUrl: data.avatarUrl || ed.avatarUrl || ""
    };
};

/**
 * Project Join Helper: Maps users to their assigned projects.
 */
const getProjectMap = async () => {
    const projectSnap = await db.collection("projects").get();
    const map = {};
    projectSnap.forEach(doc => {
        const data = doc.data();
        const projectName = data.name;
        const modules = data.modules || [];
        modules.forEach(m => {
            if (m.assignedToId) {
                if (!map[m.assignedToId]) map[m.assignedToId] = new Set();
                map[m.assignedToId].add(projectName);
            }
        });
    });
    // Convert Sets to Arrays
    Object.keys(map).forEach(uid => {
        map[uid] = Array.from(map[uid]);
    });
    return map;
};

/**
 * Late logic: Check if checkin is after 09:30 AM.
 */
const getStatus = (checkin, totalHours = 0) => {
    if (!checkin) return "absent";
    const checkinDate = new Date(checkin);
    const hour = checkinDate.getHours();
    const minute = checkinDate.getMinutes();
    
    let status = "present";
    if (hour > 9 || (hour === 9 && minute > 30)) {
        status = "late";
    }
    
    // Half-day logic
    if (totalHours > 0 && totalHours < 4) {
        status = "half-day";
    }

    return status;
};

/**
 * GET /api/attendance/advanced/summary
 */
const getAttendanceSummary = async (req, res, next) => {
    try {
        const userRoleLower = (req.user.role || "").toLowerCase();
        const isAdminOrManager = userRoleLower === "admin" || userRoleLower === "manager";
        if (!isAdminOrManager && !userRoleLower.startsWith("hr")) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const today = new Date().toISOString().split("T")[0];
        const [empSnap, staffSnap, attendanceSnap] = await Promise.all([
            db.collection("employees").get(),
            db.collection("Staff").get(),
            db.collection("attendance").where("date", "==", today).get()
        ]);
        const totalEmployees = empSnap.size + staffSnap.size;
        const presentToday = attendanceSnap.size;
        
        let lateToday = 0;
        attendanceSnap.forEach(doc => {
            const data = doc.data();
            if (getStatus(data.checkin, data.totalHours) === "late") lateToday++;
        });

        const attendancePercentage = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

        res.json({
            success: true,
            data: {
                totalEmployees,
                presentToday,
                absentToday: totalEmployees - presentToday,
                lateToday,
                attendancePercentage,
                trend: "+2.5%"
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/attendance/advanced/daily
 */
const getAttendanceDaily = async (req, res, next) => {
    try {
        const userRoleLower = (req.user.role || "").toLowerCase();
        const isAdminOrManager = userRoleLower === "admin" || userRoleLower === "manager";
        if (!isAdminOrManager && !userRoleLower.startsWith("hr")) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const date = req.query.date || format(new Date(), "yyyy-MM-dd");
        const [empSnap, staffSnap, projectMap, attendanceSnap] = await Promise.all([
            db.collection("employees").get(),
            db.collection("Staff").get(),
            getProjectMap(),
            db.collection("attendance").where("date", "==", date).get()
        ]);

        const attendanceMap = {};
        attendanceSnap.forEach(doc => {
            attendanceMap[doc.data().employeeId] = doc.data();
        });

        const rawUsers = [
            ...empSnap.docs.map(doc => normalizeUser(doc, projectMap)),
            ...staffSnap.docs.map(doc => normalizeUser(doc, projectMap))
        ];

        // Deduplicate by UID
        const users = Array.from(new Map(rawUsers.map(u => [u.uid, u])).values());

        const result = users.map(user => {
            const att = attendanceMap[user.uid];
            const checkIn = att?.checkin || null;
            const checkOut = att?.checkout || null;
            const hours = att?.totalHours || 0;
            const status = getStatus(checkIn, hours);

            return {
                ...user,
                checkIn: checkIn ? format(new Date(checkIn), "HH:mm") : null,
                checkOut: checkOut ? format(new Date(checkOut), "HH:mm") : (checkIn ? "In-Progress" : null),
                workingHours: hours,
                status,
                late: status === "late"
            };
        });

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/attendance/advanced/monthly
 */
const getMonthlyAttendance = async (req, res, next) => {
    try {
        const userRoleLower = (req.user.role || "").toLowerCase();
        const isAdminOrManager = userRoleLower === "admin" || userRoleLower === "manager";
        if (!isAdminOrManager && !userRoleLower.startsWith("hr")) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const monthStr = req.query.month || format(new Date(), "yyyy-MM");
        const startDate = `${monthStr}-01`;
        const endDate = `${monthStr}-31`; 

        const [empSnap, staffSnap, projectMap, attendanceSnap] = await Promise.all([
            db.collection("employees").get(),
            db.collection("Staff").get(),
            getProjectMap(),
            db.collection("attendance").where("date", ">=", startDate).where("date", "<=", endDate).get()
        ]);

        const rawUsers = [
            ...empSnap.docs.map(doc => normalizeUser(doc, projectMap)),
            ...staffSnap.docs.map(doc => normalizeUser(doc, projectMap))
        ];

        // Deduplicate by UID
        const users = Array.from(new Map(rawUsers.map(u => [u.uid, u])).values());

        const userStats = {};
        users.forEach(u => {
            userStats[u.uid] = { 
                ...u, 
                presentDays: 0, 
                lateDays: 0, 
                absentDays: 22, 
                totalHours: 0
            };
        });

        attendanceSnap.forEach(doc => {
            const data = doc.data();
            const uid = data.employeeId;
            if (userStats[uid]) {
                const status = getStatus(data.checkin, data.totalHours);
                userStats[uid].presentDays++;
                userStats[uid].absentDays = Math.max(0, userStats[uid].absentDays - 1);
                if (status === "late") userStats[uid].lateDays++;
                userStats[uid].totalHours += (data.totalHours || 0);
            }
        });

        const result = Object.values(userStats).map(u => {
            const attendancePercentage = Math.round((u.presentDays / totalWorkingDays) * 100);
            const avgWorkingHours = u.presentDays > 0 ? (u.totalHours / u.presentDays).toFixed(1) : 0;
            
            // Productivity Score = (Attendance% * 0.6) + (AvgHoursScore * 0.4)
            // AvgHoursScore: 8 hours = 100%
            const hourScore = Math.min(100, (parseFloat(avgWorkingHours) / 8) * 100);
            const productivityScore = Math.round((attendancePercentage * 0.6) + (hourScore * 0.4));

            const insights = [];
            if (u.lateDays > 5) insights.push("Frequent Late");
            if (attendancePercentage < 75) insights.push("Low Attendance");
            if (attendancePercentage >= 95 && parseFloat(avgWorkingHours) >= 8) insights.push("High Performer");

            return {
                ...u,
                totalDays: totalWorkingDays,
                attendancePercentage,
                avgWorkingHours: parseFloat(avgWorkingHours),
                productivityScore,
                insights
            };
        });

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/attendance/advanced/project-summary
 */
const getProjectSummary = async (req, res, next) => {
    try {
        const userRoleLower = (req.user.role || "").toLowerCase();
        const isAdminOrManager = userRoleLower === "admin" || userRoleLower === "manager";
        if (!isAdminOrManager && !userRoleLower.startsWith("hr")) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        const monthStr = req.query.month || format(new Date(), "yyyy-MM");
        const startDate = `${monthStr}-01`;
        const endDate = `${monthStr}-31`;

        const [empSnap, staffSnap, projectMap, attendanceSnap] = await Promise.all([
            db.collection("employees").get(),
            db.collection("Staff").get(),
            getProjectMap(),
            db.collection("attendance").where("date", ">=", startDate).where("date", "<=", endDate).get()
        ]);

        const rawUsers = [
            ...empSnap.docs.map(doc => normalizeUser(doc, projectMap)),
            ...staffSnap.docs.map(doc => normalizeUser(doc, projectMap))
        ];

        // Deduplicate by UID
        const users = Array.from(new Map(rawUsers.map(u => [u.uid, u])).values());

        const projectStats = {};
        const allProjects = new Set();
        Object.values(projectMap).flat().forEach(p => allProjects.add(p));
        allProjects.add("Unassigned");
        allProjects.add("Multi-Project");

        allProjects.forEach(p => {
            projectStats[p] = { project: p, teamSize: 0, totalAttendance: 0, totalHours: 0, totalLate: 0, userCount: 0 };
        });

        users.forEach(u => {
            if (u.projects && u.projects.length > 1) {
                if (projectStats["Multi-Project"]) projectStats["Multi-Project"].teamSize++;
            } else {
                const p = u.projects[0] || "Unassigned";
                if (projectStats[p]) projectStats[p].teamSize++;
            }
        });

        const userMonthly = {};
        attendanceSnap.forEach(doc => {
            const data = doc.data();
            const uid = data.employeeId;
            if (!userMonthly[uid]) userMonthly[uid] = { present: 0, hours: 0, late: 0 };
            const status = getStatus(data.checkin, data.totalHours);
            userMonthly[uid].present++;
            userMonthly[uid].hours += (data.totalHours || 0);
            if (status === "late") userMonthly[uid].late++;
        });

        users.forEach(u => {
            const stats = userMonthly[u.uid] || { present: 0, hours: 0, late: 0 };
            const attP = Math.round((stats.present / 22) * 100);
            const avgH = stats.present > 0 ? stats.hours / stats.present : 0;

            if (u.projects && u.projects.length > 1) {
                const p = "Multi-Project";
                if (projectStats[p]) {
                    projectStats[p].totalAttendance += attP;
                    projectStats[p].totalHours += avgH;
                    projectStats[p].totalLate += stats.late;
                    projectStats[p].userCount++;
                }
            } else {
                const p = u.projects[0] || "Unassigned";
                if (projectStats[p]) {
                    projectStats[p].totalAttendance += attP;
                    projectStats[p].totalHours += avgH;
                    projectStats[p].totalLate += stats.late;
                    projectStats[p].userCount++;
                }
            }
        });

        const result = Object.values(projectStats).map(p => ({
            ...p,
            avgAttendance: p.userCount > 0 ? Math.round(p.totalAttendance / p.userCount) : 0,
            avgHours: p.userCount > 0 ? parseFloat((p.totalHours / p.userCount).toFixed(1)) : 0
        })).filter(p => p.teamSize > 0);

        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { 
    getAttendanceSummary, 
    getAttendanceDaily, 
    getMonthlyAttendance, 
    getProjectSummary 
};
