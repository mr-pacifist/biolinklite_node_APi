
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
  
  // Split the token string by space
  const parts = token.split(' '); 

  // Extract the actual secret 
  const secret = parts[1]; 

  if(secret == process.env.JWT_SECRET){
    next();
  }
  else{
    return res.status(401).json({ 
      error:{
        common:{
            msg:'Failed to authenticate token.',
        }
      }
 
    }); 
    
  }
  
}

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