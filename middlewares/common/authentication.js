const jwt = require("jsonwebtoken");

// auth guard to protect routes that need authentication
const authencitation = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      // pass user info to response locals
      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (err) {
      if (res.locals.html) {
        res.redirect("/");
      } else {
        res.status(401).json({
          error: {
            common: {
              msg: "Authentication failure!",
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.redirect("/");
    } else {
      res.status(401).json({
        error:{
          msg:"Authetication failure!",
        }
      });
    }
  }
};

// redirect already logged in user to inbox pabe
const checkLogin = function (req, res, next) {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (!cookies) {
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