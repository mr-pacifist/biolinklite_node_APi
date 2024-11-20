// external imports
const { check, validationResult } = require("express-validator");


// custom link validator
const customLinkValidation = [
    check("name")
        .notEmpty()
        .withMessage("Link name is required")
        .isLength({ min:3},{max:20})
        .withMessage("Link name must be 3 chars long")
        .trim(),
      
    check("url")
        .notEmpty()
        .withMessage("Url is required")
        .isURL()
        .withMessage('Please enter a valid URL')
  ];


// custom link validation handler
const customLinkValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
      next();
    } else {
      res.status(401).json( {
        data: {
            name: req.body.name,
            url:req.body.name,
        },
        errors: mappedErrors,
      });
    }
  };

module.exports = {
    customLinkValidation,
    customLinkValidationHandler,
}