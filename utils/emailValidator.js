// external imports
const EmailVerify = require("email-verify");


// email validation handler
const emailValidator= function(req,res,next) {
    if(req.body.email){
        const email = req.body.email;
        EmailVerify.verify(email, function(err, info) {
        if (err) {
            return res.status(500).json({ 
                error:{
                    email:{
                        msg:"Invalid email",
                    }
                } 
             });
        } else {
            if(info.success === false){
                return res.status(401).json({
                    error:{
                        email:{
                            msg:"Invalid email",
                        }
                    }                   
                });
            }
            next();
        }
      });
    }else{
        next();
    }
    
}

module.exports= emailValidator;