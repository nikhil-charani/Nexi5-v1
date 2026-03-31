const express=require("express")

const {db}= require("../config/firebase")


const checkin = async (req, res, next) => {
  try {
    const uid = req.user?.uid;
    const { location, notes } = req.body;
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

    // 2. Late Logic (after 09:30 AM)
    const hour = now.getHours();
    const minute = now.getMinutes();
    const isLate = hour > 9 || (hour === 9 && minute > 30);
    const status = isLate ? "late" : "present";

    const attendanceData = {
      employeeId: uid,
      date: today,
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

const applyleave  = async (req,res,next) => {
    try{
        const uid= req.user.uid
        const {fromdate,todate,reason} = req.body
        if(!fromdate || !todate ||  !reason){
               return res.status(400).json({
                success: false,
                message:"all field are required"
               })
        }
      await db.collection("leaves").add({
        uid:req.user.uid,
        fromdate:fromdate,
        todate:todate,
        status:"pending",
        leaveapplieddate:new Date().toISOString().split("T")[0]
      })
      res.json({
        success: true,
        message:"leave applied succesfully"
      })
    }
    catch(error){
        console.error("applyleave Error:", error);
        next(error)
    }
}

const approveleave = async (req, res, next) => {
    try {
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
            status: "approved",
            updatedAt: new Date().toISOString()
        });

        res.json({
            success: true,
            message: "Leave approved successfully"
        });
    } catch (error) {
        console.error("approveleave Error:", error);
        next(error);
    }
}


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
    // Removed orderBy to avoid Firestore index requirement which often causes 500/400 errors if not set
    const snapshot = await db.collection("attendance")
      .where("employeeId", "==", uid)
      .get();

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Sort manually if needed, or leave to frontend
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


module.exports = { checkin, checkout, applyleave, approveleave, getLeaves, getPendingLeaves, getAttendanceStatus, getAttendanceHistory };



