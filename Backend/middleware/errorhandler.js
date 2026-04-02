const errorhandler = (err,req,res,next) => {
    console.log(err.stack);
     res.status(500).json({ message: "Server error" }); //global handleer
}


const asynchandler =  (fn) => (req,res,next) => {
    Promise.resolve(fn(req,res,next)).catch(next);
}



//pagination utility
const paginate = async(query,page=1,limit=10) => {
    page=parseInt(page)
    limit=parseInt(limit)
    const offset = (page-1) * limit;
    const snapshot = await query.get();
    const total = snapshot.size;


}
module.exports={errorhandler,asynchandler,paginate}
