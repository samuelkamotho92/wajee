//global error handling middlware
module.exports = (err,req,resp,next)=>{
    //send back error response
    err.status = err.status || "error";
    err.statusCode = err.statusCode || 500;
    resp.status(err.statusCode).json({
        status:err.status,
        message:err.message
    })
    }