// external imports
const { check, validationResult } = require("express-validator");


// header title validator
const headerValidation = [
    check("title")
        .notEmpty()
        .withMessage("Header title is required")
        .isLength({ min:3},{max:25})
        .withMessage("Link name must be 3-25 chars long")
        .toLowerCase()
        .trim(),
      
  ];


// header title validation handler
const headerValidationHandler = function (req, res, next) {
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
    headerValidation,
    headerValidationHandler,
}