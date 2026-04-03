const express=require("express")

const {db}= require("../config/firebase")


const checkin = async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    const { location, notes } = req.body || {};
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const docId = `${uid}_${today}`;
    
    // 1. Structural Deduplication (One record per day)
    const existing = await db.collection("attendance").doc(docId).get();
    if (existing.exists && existing.data()?.checkin) {
      return res.status(400).json({
        success: false,
        message: "Already checked in today",
        clockInTime: existing.data().checkin,
      });
    }

    // Fetch employee details for dual-write
    let name = "Unknown";
    let department = "Unknown";
    try {
      const empDoc = await db.collection("employees").doc(uid).get();
      if (empDoc.exists) {
        const empData = empDoc.data()?.employeeData || empDoc.data();
        name = empData.firstName ? `${empData.firstName} ${empData.lastName}`.trim() : empData.name || "Unknown";
        department = empData.department || "Unknown";
      }
    } catch (e) {
      console.warn("Failed to fetch employee details for checkin:", e);
    }

    // 2. Late Logic (after 09:30 AM)
    const hour = now.getHours();
    const minute = now.getMinutes();
    const isLate = hour > 9 || (hour === 9 && minute > 30);
    const status = isLate ? "late" : "present";

    const attendanceData = {
      employeeId: uid,
      name: name,
      role: req.user?.role || "Employee",
      department: department,
      date: today,
      month: today.slice(0, 7),
      checkin: now.toISOString(),
      checkout: null,
      totalHours: 0,
      status: status,
      isLate: isLate,
      isHalfDay: false,
      location: location || "office",
      notes: notes || "",
      createdAt: now.toISOString(),
    };

    await db.collection("attendance").doc(docId).set(attendanceData);

    // Dual-write strategy
    try {
      await db.collection("daily_attendance").doc(docId).set(attendanceData);
    } catch (e) {
      console.error("Failed to write to daily_attendance collection:", e);
    }

    // 3. Real-time Bridge
    const io = req.app.get("io");
    if (io) {
      io.emit("attendance:update", { 
        type: "checkin", 
        uid, 
        name: req.user?.name || "Employee",
        status: status 
      });
    }

    res.status(201).json({
      success: true,
      message: "Check-in successful",
      data: attendanceData,
    });
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const docId = `${uid}_${today}`;
    const attendanceRef = db.collection("attendance").doc(docId);
    const doc = await attendanceRef.get();
      
    if (!doc.exists || !doc.data()?.checkin) {
      return res.status(400).json({ success: false, message: "No check-in record found for today" });
    }

    if (doc.data()?.checkout) {
      return res.status(400).json({ success: false, message: "Already checked out today" });
    }

    const checkinTime = new Date(doc.data().checkin);
    const checkoutTime = now;
    const totalMs = checkoutTime.getTime() - checkinTime.getTime();
    const totalHours = parseFloat((totalMs / (1000 * 60 * 60)).toFixed(2));
    
    // Half-day logic (< 4 hours)
    const isHalfDay = totalHours < 4;
    const currentStatus = doc.data().status;
    let finalStatus = currentStatus;
    if (isHalfDay) finalStatus = "half-day";

    const updateData = {
      checkout: checkoutTime.toISOString(),
      totalHours: totalHours,
      isHalfDay: isHalfDay,
      status: finalStatus,
      updatedAt: checkoutTime.toISOString()
    };

    await attendanceRef.update(updateData);

    // Dual-write strategy
    try {
      await db.collection("daily_attendance").doc(docId).update(updateData);
    } catch (e) {
      console.error("Failed to update daily_attendance collection:", e);
    }

    // Real-time Bridge
    const io = req.app.get("io");
    if (io) {
      io.emit("attendance:update", { 
        type: "checkout", 
        uid, 
        name: req.user?.name || "Employee",
        totalHours,
        status: finalStatus
      });
    }

    res.status(200).json({
      success: true,
      message: "Check-out successful",
      data: { ...doc.data(), ...updateData }
    });
  } catch (error) {
    next(error);
  }
};

const applyleave = async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const { startDate, endDate, reason, employeeName, department } = req.body;
        
        const leaveData = {
            uid,
            employeeId: uid,
            employeeName: employeeName || "Unknown",
            department: department || "",
            startDate,
            endDate,
            reason,
            status: "Pending",
            appliedOn: new Date().toISOString().split("T")[0]
        };
        await db.collection("leaves").add(leaveData);
        res.status(201).json({ success: true, message: "Applied successfully" });
    } catch (error) { 
        console.error("applyleave Error:", error);
        next(error); 
    }
}

const approveleave = async (req, res, next) => {
    try {
        const { role } = req.user;
        if (role !== "Admin" && role !== "HR Head" && role !== "HR" && role !== "HR Accountant" && role !== "HR Recruiter") {
            return res.status(403).json({ error: "Unauthorized" });
        }
        
        const { leaveId } = req.params;
        const leaveRef = db.collection("leaves").doc(leaveId);
        const leaveDoc = await leaveRef.get();

        if (!leaveDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        await leaveRef.update({
            status: "Approved",
            updatedAt: new Date().toISOString()
        });

        const updatedDoc = await leaveRef.get();
        res.json({
            success: true,
            message: "Leave approved successfully",
            data: {
                id: updatedDoc.id,
                ...updatedDoc.data()
            }
        });
    } catch (error) {
        console.error("approveleave Error:", error);
        next(error);
    }
}


const rejectleave = async (req, res, next) => {
    try {
        const { role } = req.user;
        if (role !== "Admin" && role !== "HR Head" && role !== "HR" && role !== "HR Accountant" && role !== "HR Recruiter") {
            return res.status(403).json({ error: "Unauthorized" });
        }
        
        const { leaveId } = req.params;
        const leaveRef = db.collection("leaves").doc(leaveId);
        const leaveDoc = await leaveRef.get();

        if (!leaveDoc.exists) {
            return res.status(404).json({
                success: false,
                message: "Leave request not found"
            });
        }

        await leaveRef.update({
            status: "Rejected",
            updatedAt: new Date().toISOString()
        });

        const updatedDoc = await leaveRef.get();
        res.json({
            success: true,
            message: "Leave rejected successfully",
            data: {
                id: updatedDoc.id,
                ...updatedDoc.data()
            }
        });
    } catch (error) {
        console.error("rejectleave Error:", error);
        next(error);
    }
};

const getLeaves = async (req, res, next) => {
    try {
        const uid = req.user.uid;
        const leaves = await db.collection("leaves").where("uid", "==", uid).get();
        const data = leaves.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

const getPendingLeaves = async (req, res, next) => {
    try {
        const leaves = await db.collection("leaves").where("status", "==", "pending").get();
        const data = await Promise.all(leaves.docs.map(async (doc) => {
            const leaveData = doc.data();
            const employeeDoc = await db.collection("employees").doc(leaveData.uid).get();
            const employeeData = employeeDoc.exists ? employeeDoc.data().employeeData : null;
            return {
                id: doc.id,
                ...leaveData,
                applicant: employeeData ? `${employeeData.firstName} ${employeeData.lastName}` : "Unknown"
            };
        }));
        res.json({
            success: true,
            data
        });
    } catch (error) {
        next(error);
    }
};

const getAttendanceStatus = async (req, res, next) => {
  try {
    console.log("Fetching attendance status for UID:", req.user?.uid);
    if (!req.user?.uid) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const today = new Date().toISOString().split("T")[0];
    const docId = `${req.user.uid}_${today}`;
    const doc = await db.collection("attendance").doc(docId).get();

    if (!doc.exists) {
      return res.json({
        success: true,
        isCheckedIn: false,
        data: null
      });
    }

    const data = doc.data();
    res.json({
      success: true,
      isCheckedIn: !!data.checkin && !data.checkout,
      data: data
    });
  } catch (error) {
    console.error("getAttendanceStatus Error:", error);
    next(error);
  }
};

const getAttendanceHistory = async (req, res, next) => {
  try {
    console.log("Fetching attendance history for UID:", req.user?.uid);
    const uid = req.user.uid;
    const snapshot = await db.collection("attendance")
      .where("employeeId", "==", uid)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    data.sort((a, b) => b.date.localeCompare(a.date));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("getAttendanceHistory Error:", error);
    next(error);
  }
};

const getAttendanceHistoryByUid = async (req, res, next) => {
  try {
    const { uid } = req.params;
    console.log("Fetching attendance history for target UID:", uid);
    
    const snapshot = await db.collection("attendance")
      .where("employeeId", "==", uid)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    data.sort((a, b) => b.date.localeCompare(a.date));

    res.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error("getAttendanceHistoryByUid Error:", error);
    next(error);
  }
};

const getAllAttendance = async (req, res, next) => {
  try {
    const snapshot = await db.collection("attendance").get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error("getAllAttendance Error:", error);
    res.status(500).json({ success: false, message: "Error fetching attendance" });
  }
};

module.exports = { checkin, checkout, applyleave, approveleave, rejectleave, getLeaves, getPendingLeaves, getAttendanceStatus, getAttendanceHistory, getAttendanceHistoryByUid, getAllAttendance };



