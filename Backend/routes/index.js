const express = require("express")
const router=express.Router();
const {admin,db} = require('../config/firebase')
const {verifyToken} = require('../middleware/auth')
<<<<<<< Lokesh
const { register: registerUser, login: loginUser } = require('../controllers/authcontroller')
const {createEmployee,getemployee,getemployeebyid,updateemployee} = require('../controllers/employeecontroller')
const {checkin,checkout,applyleave,approveleave,getLeaves,getPendingLeaves,getAttendanceStatus,getAttendanceHistory,getAllAttendance} = require('../controllers/attendancecontroller')
const {createpay,payslips}=require('../controllers/payrollcontroller')
const {performance} = require('../controllers/performancecontroller')
//employee routes
const {createtask,gettasks,updatetaskstatus} = require('../controllers/taskcontroller')
const {addEvent, getEvents, updateEvent, deleteEvent} = require('../controllers/calendarcontroller')
const { getAllUsers } = require('../controllers/usercontroller')
=======
const { register: registerUser, login: loginUser ,changePassword } = require('../controllers/authcontroller')
const {createEmployee,getemployee,getemployeebyid,updateemployee,deleteemployee,getEmployeeDocuments,getEmployeeTimeline} = require('../controllers/employeecontroller')
const {checkin,checkout,applyleave,approveleave,getLeaves,getPendingLeaves,getAttendanceStatus,getAttendanceHistory,getAttendanceHistoryByUid} = require('../controllers/attendancecontroller')
const {createpay,payslips,getPayrollHistory}=require('../controllers/payrollcontroller')
const {performance,getPerformanceHistory} = require('../controllers/performancecontroller')
//employee routes
const {createtask,gettasks,updatetaskstatus} = require('../controllers/taskcontroller')
const {addEvent, getEvents, updateEvent, deleteEvent} = require('../controllers/calendarcontroller')
>>>>>>> main

// Auth routes — matches frontend's { name, email, password, role }
router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/change-password", changePassword)

router.post("/employees",createEmployee)
<<<<<<< Lokesh
router.get("/employees", getemployee)
router.get("/emp", getemployee)
router.get("/users", getAllUsers)
=======
router.delete("/employees/:uid",verifyToken,deleteemployee)
>>>>>>> main
router.post("/getemp",verifyToken,getemployee)
router.post("/getempbyid/:uid",verifyToken,getemployeebyid)
router.put('/update/:uid',verifyToken,updateemployee)
router.post('/checkin',verifyToken,checkin)
router.put('/checkout',verifyToken,checkout)
router.post('/applyleave',verifyToken,applyleave)
router.post('/approveleave/:leaveId',verifyToken,approveleave)
router.post('/rejectleave/:leaveId',verifyToken,rejectleave)
router.get('/leaves',verifyToken,getLeaves)
router.get('/leaves/pending',verifyToken,getPendingLeaves)
router.get('/attendance/status',verifyToken,getAttendanceStatus)
router.get('/attendance/history',verifyToken,getAttendanceHistory)
<<<<<<< Lokesh
router.get('/attendance', getAllAttendance)
=======
router.get('/attendance/history/:uid',verifyToken,getAttendanceHistoryByUid)
>>>>>>> main
router.post('/payroll',createpay)
router.post('/payslips',payslips)
router.post('/createtask',createtask)
router.post('/gettask',gettasks)
router.post('/updatetaskstatus',updatetaskstatus)
router.post('/performance',performance)
<<<<<<< Lokesh
=======
router.get('/payroll/history/:uid',verifyToken,getPayrollHistory)
router.get('/performance/history/:uid',verifyToken,getPerformanceHistory)
router.get('/documents/:uid',verifyToken,getEmployeeDocuments)
router.get('/timeline/:uid',verifyToken,getEmployeeTimeline)
>>>>>>> main

// Calendar Routes
router.post('/calendar/add-event', verifyToken, addEvent)
router.get('/calendar/events', verifyToken, getEvents)
router.put('/calendar/update-event/:id', verifyToken, updateEvent)
router.delete('/calendar/delete-event/:id', verifyToken, deleteEvent)
<<<<<<< Lokesh

// Advanced Attendance Analytics
const advancedAttendanceRoutes = require('./advancedAttendanceRoutes')
router.use('/attendance/advanced', advancedAttendanceRoutes)

// Company Project Management (NEW — isolated module)
const companyProjectRoutes = require('./companyProjectRoutes')
router.use('/company-projects', companyProjectRoutes)

// Asset Management Routes
const assetRoutes = require("./assetRoutes");
router.use("/assets-mgmt", assetRoutes);

=======
>>>>>>> main
router.get('/me', verifyToken, (req, res) => {
    res.json({ success: true, user: req.user });
})

module.exports=router
///http -- get put post patch delete head options 