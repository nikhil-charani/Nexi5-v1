
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
module.exports={performance}


