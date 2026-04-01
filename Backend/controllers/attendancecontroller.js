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

module.exports = { checkin, checkout, applyleave, approveleave, getLeaves, getPendingLeaves, getAttendanceStatus, getAttendanceHistory, getAttendanceHistoryByUid };



