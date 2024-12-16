// external imports
const bcrypt = require("bcrypt");
const createError = require("http-errors");

// internal imports
const Prisma = require("../prisma/prismaClient");

// do login
async function login(req, res,next) {
  try {
    // find a user who has this email/username
    const user = await Prisma.user.findFirst({
        where: {
          OR: [
            { email: req.body.userName },
            { userName: req.body.userName },
          ],
        },
      });

    if (user && user.id) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (isValidPassword) {
        // prepare the user object to generate token
        const userObject = {
          userId: user.id,
          displayName: user.firstName + " " + user.lastName,
          userName: user.userName,
          login:true, 
      }
        req.dataShare = userObject;
        next();
      } else {
        throw createError("Login failed! Please try with correct username and password");
      }
    } else {
      throw createError("Login failed! Please try with correct username and password");
    }
  } catch (err) {
    res.status(400).json({
      data: {
        userName: req.body.userName,
      },
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
}

// do logout
function logout(req, res) {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).json({message:"logged out"});
}

module.exports = {
  login,
  logout,
};