module.exports = (fn)=>{
    return(req,resp,next)=>{
        //call the async func which returns a promise and catches the error
    fn(req,resp,next).catch(err=>next(err))
    }
};