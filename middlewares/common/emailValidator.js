// external imports
const EmailVerify = require("email-verify");

async function emailValidation(req,res,next) {
    
const email = req.body.email;
    EmailVerify.verify(email, function(err, info) {
        if (err) {
            console.log(err);
            res.json(err)
        } else {
            console.log(info);
            res.json(info) 

        }
      });
}

module.exports={
    emailValidation,
}