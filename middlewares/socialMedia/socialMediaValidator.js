// external imports
const { check, validationResult } = require("express-validator");


// socialmedia  validator
const socialMediaUrlValidation = [  
    check("url")
        .notEmpty()
        .withMessage("Url is required")
        .isURL()
        .withMessage('Please enter a valid URL')
        .isLength({max:255})
        .withMessage("URL is too long")
        .trim().escape(),
  ];


// social media validation handler
const socialMediaUrlValidationHandler = function (req, res, next) {
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
    socialMediaUrlValidation,
    socialMediaUrlValidationHandler
}