const {db} = require("../config/firebase")
const createpay= async (req,res,next) => {
    try{
    const uid = req.body.uid || req.user?.uid;
    const { salary = 0, bonus = 0, deduction = 0 } = req.body;
    
    const netsalary = salary + bonus - deduction;
   const payroll=await db.collection("payroll").add({
        uid,
        salary,
        bonus,
        deduction,
        netsalary,
        status:"pending",
        createdAt:new Date().toISOString().split("T")[0]
    })
    res.json({
        message:"payroll created succesfully"
        ,payroll:payroll.id
    })
    }
    catch(error){
        next(error)
    }
}

const payslips = async (req,res) => {
    try{
    const uid = req.body.uid || req.user?.uid;
    const {
      month = new Date().getMonth() + 1,
      year = new Date().getFullYear(),
      basicSalary = 0,
      hra = 0,
      allowances = 0,
      deductions = 0
    } = req.body
    const grosssalary = basicSalary + hra + allowances;
    const netsalary = grosssalary - deductions
    const payslip = {
        uid,
        month,
        year,
        grosssalary,
        basicSalary,
        netsalary
    }
    const docref = await db.collection("payslips").add(payslip)
    res.json({
        message:"user payslips created succesful",
        uid:docref.id
    })
}
    catch(error){
        next(error);
    }

}


module.exports={createpay,payslips}