// external imports
const express = require("express");
const router = express.Router();

// internal imports

const {registrationValidators,
    registrationValidationHandler,
    loignValidators,
    loignValidationHandler,
 } = require("../middlewares/users/userValidators"); // validation middleware

// email verification middlewar
const emailValidator = require("../utils/emailValidator")
; 
const { authorization, checkLogin} = require("../middlewares/common/authorization"); 
const setCookies = require("../middlewares/common/setcookies"); 

const {addUser} = require("../controllers/registrationController");

const {login, logout} = require("../controllers/loginController");

// new user registation
router.post("/register",
    registrationValidators, 
    registrationValidationHandler,
    emailValidator, 
    addUser,
    setCookies,
);

// user login
router.post("/login",
    checkLogin,
    loignValidators,
    loignValidationHandler,
    login,
    setCookies,
);

// user logout
router.delete("/logout", logout);


module.exports = router;