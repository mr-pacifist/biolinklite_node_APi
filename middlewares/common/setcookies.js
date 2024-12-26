
const jwt = require("jsonwebtoken");


const setCookies = function(req,res){

  const userObject = req.dataShare;
  // generate web token
  const token = jwt.sign(userObject, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
  
  // set cookie
  res.cookie(process.env.COOKIE_NAME, token, {
    maxAge: process.env.JWT_EXPIRY,
    httpOnly: true,
    signed: true,
  });
  
  // set logged in user local identifier
  res.locals.loggedInUser = userObject;

  //user object check
  if(userObject.login){
    res.status(202).json({
      message:"Login successful!",
      userObject
    });
    
  }else{
    res.status(201).json({
      message:"User registation successful!",
      userObject
    });
  }
 
}

module.exports = setCookies;