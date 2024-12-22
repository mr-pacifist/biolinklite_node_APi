// external imports
const { check, validationResult } = require("express-validator");


// password update validation
const  changePasswordValidation= [
    check("currentPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 }, { max: 16 })
        .withMessage("Password must be 6-16 chars long")
        .trim(),
        
    check("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 6 }, { max: 16 })
        .withMessage("Password must be 6-16 chars long")
        .trim(),
        
    check("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .isLength({ min: 6 }, { max: 16 })
        .withMessage("Password must be 6-16 chars long")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
              throw new Error("Password  does not match");
            }
            return true;
          })
        .trim(),
      
  ];


// header title validation handler
const changePasswordValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.status(401).json( {
        errors: mappedErrors,
      });
    }
  };

module.exports = {
    changePasswordValidation,
    changePasswordValidationHandler,
}