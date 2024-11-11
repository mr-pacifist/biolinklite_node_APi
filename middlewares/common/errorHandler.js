const createError = require("http-errors");


// 404 not found handler

function notfoundHandler(req,res,next){
    next(createError(404, "Your requested content was not found"));
}

// default error handler
function errorHandler(err,req,res){
    res.locals.error = {message: err.message};
    res.status(err.status || 500).json(res.locals.error);

}


module.exports ={
    notfoundHandler, 
    errorHandler
}