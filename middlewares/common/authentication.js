const jwt = require("jsonwebtoken");

// auth guard to protect routes that need authentication
const authencitation = (req, res, next) => {

  const token = req.headers['authorization']; 
  if (!token) return res.status(403).json({ 
    error:{
        common:{
            msg:'No token provided.', 
          }  
    }
  }); 
  jwt.verify(token,process.env.JWT_SECRET, (err, decoded) => { 
    if (err) return res.status(401).json({ 
      error:{
        common:{
            msg:'Failed to authenticate token.',
        }
    }
      
    }); 
    req.user = decoded; 
    next(); 
  });
  
};

// redirect already logged in user to inbox pabe
const checkLogin = function (req, res, next) {
  const token = req.headers['authorization']; 

  if (!token) {
    next();
  } else {
    res.json({
      message:"You are already logged in!"
    });
  }
};


module.exports = {
  authencitation,
  checkLogin,
};