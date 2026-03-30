const express=require("express")

const {db}= require("../config/firebase")


const checkin = async (req, res, next) => {
  try {
    console.log("Processing check-in for UID:", req.user?.uid);
    const { location, notes } = req.body;
    const today = new Date().toISOString().split("T")[0];
    const docId = `${req.user.uid}_${today}`;
    
    console.log("Checking for existing check-in, docId:", docId);
    const existing = await db.collection("attendance").doc(docId).get();

    if (existing.exists && existing.data()?.checkin) {
      console.log("User already checked in today:", docId);
      return res.status(400).json({
        success: false,
        message: "Already check in today",
        clockInTime: existing.data().checkin,
      });
    }

    const attendanceData = {
      employeeId: req.user.uid,
      date: today,
      checkin: new Date().toISOString(),
      checkout: null,
      totalHours: null,
      status: "present",
      location: location || "office",
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    console.log("Saving new attendance record:", docId);
    await db.collection("attendance").doc(docId).set(attendanceData);

    res.status(201).json({
      success: true,
      message: "Checkin in successfully",
      data: {
        id: docId,
        employeeId: req.user.uid,
        date: today,
        checkin: attendanceData.checkin,
        location: attendanceData.location,
      },
    });

  } catch (error) {
    console.error("checkin Error:", error);
    next(error);
  }
};


const checkout  = async (req,res,next) => {
    try {
          const today = new Date().toISOString().split("T")[0]  
          const docid = `${req.user.uid}_${today}`
          const sri= db.collection("attendance").doc(docid)
          const person = await sri.get()
            
          if(!person.exists || !person.data()?.checkin){
            return res.json({
                message:"you have not checkin today",
                success:false
            })
          }
          if(person.data()?.checkout){
            return res.json({
                success:false,
                message:"employee already check out",
                checkout:person.data().checkout
            })
          }

          //calcualte total time
          const checkoutTime = new Date().toISOString()
          const totalms = new Date(checkoutTime).getTime()-new Date(person.data().checkin).getTime()
          const totalhours= parseFloat((totalms/(1000*60*60)).toFixed(2))
          await sri.update({
              checkout:checkoutTime,
              totalHours:totalhours,
              updatedAt:new Date().toISOString()
          })
          res.status(200).json({
            success:true,
            message:"successfully checkout",
            today:today,
            checkin:person.data().checkin,
            checkout:checkoutTime,
            totalhours:totalhours
          })
    }
    catch(error){
        console.error("checkout Error:", error);
        next(error)
    }
}

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


module.exports = { checkin, checkout, applyleave, approveleave, rejectleave, getLeaves, getPendingLeaves, getAttendanceStatus, getAttendanceHistory };



