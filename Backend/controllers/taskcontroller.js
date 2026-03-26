const {db }= require("../config/firebase")

const createtask = async (req,res) => {
    const {title,description,assignedto,deadline,priority}=req.body;
   const task= await db.collection("tasks").add({
        title,
        description,
        assignedto,
        deadline,
        priority,
        status:"pending",
         createdat:new Date()

    })
    res.json({
        message:"task created succesfully",
        taskId:task.id
    })

}
const gettasks= async (req,res) => {
    try {
        const tasksSnapshot = await db.collection("tasks").get();
        const tasks = tasksSnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data()
        }));
        res.json({
            success: true,
            tasks: tasks
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}


const updatetaskstatus = async (req,res) => {
    // extract the id parameter from the route
    const { uid, id, status } = req.body;
    const taskId = uid || id;

    // ensure we got an id
    if (!taskId) {
        return res.status(400).json({ error: "missing task id" });
    }

    await db.collection("tasks").doc(taskId).update({
        status: status
    });

    res.json({
        message: "task status updated successfully"
    });

}



module.exports={createtask,gettasks,updatetaskstatus}

