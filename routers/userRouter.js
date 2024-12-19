// external imports
const express = require("express");
const router = express.Router();

// internal imports

const {
    registrationValidators,
    registrationValidationHandler,
    loignValidators,
    loignValidationHandler,
 } = require("../middlewares/users/userValidators"); // validation middleware
const {
    updateUserValidation,
    updateUserValidationHandler,
 } = require("../middlewares/users/updateUserValidators"); // validation middleware
const {
    changePasswordValidation,
    changePasswordValidationHandler,
 } = require("../middlewares/users/changePasswordValidator"); // validation middleware

// email verification middlewar
// const emailValidator = require("../utils/emailValidator"); 

const { authencitation,checkLogin} = require("../middlewares/common/authentication"); 

const setCookies = require("../middlewares/common/setcookies"); 

const limiter = require("../middlewares/common/limiter");

const {addUser} = require("../controllers/registrationController");

const {login, logout} = require("../controllers/loginController");

const {
    getUser,
    updateUser,
    changePassword,
} = require("../controllers/userController");


/*==================================
    User authenctication route
===================================*/

// new user registation
router.post("/register",
    checkLogin,
    registrationValidators, 
    registrationValidationHandler, 
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

/*======================================
    User update and change password route
========================================*/


// get user 
router.get("/:id",
    limiter,
    authencitation,
    getUser,

);
// User update
router.patch("/update/:id",
    authencitation,
    updateUserValidation,
    updateUserValidationHandler,
    updateUser,
);

// password changing route
router.put("/change-password/:id",
    authencitation,
    changePasswordValidation,
    changePasswordValidationHandler,
    changePassword,
);


module.exports = router;