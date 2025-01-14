const createError = require("http-errors");


// 404 not found handler

function notfoundHandler(req,res,next){
    next(createError(404, "Not found"));
}

// default error handler
function errorHandler(err,req,res,next){
    if (err.message === 'Not found') {
        res.status(404).json({
            error:{
                common:{
                    msg:'Your requested content was not found',
                }
            }
         });
    } else {
        console.log(err);
              
        res.status(500).json({
            error:{
                common:{
                    msg:'An unexpected error occurred',
                }
            }
        });
    }
}


module.exports ={
    notfoundHandler, 
    errorHandler
}