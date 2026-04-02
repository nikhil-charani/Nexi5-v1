
const {db} = require("../config/firebase")
const performance = async (req,res,next) => {
    try{
    const {uid,rating,feedback,taskscompleted}=req.body
    await db.collection("performance").add({
        uid,
        rating,
        feedback,
        taskscompleted
    })
    res.json({
        message:"Employee performance saved successfully"
    })
}
  catch(error){
    next(error);
}


}
const getPerformanceHistory = async (req,res) => {
    try {
        const { uid } = req.params;
        const snapshot = await db.collection("performance").where("uid", "==", uid).get();
        const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

module.exports={performance, getPerformanceHistory}


