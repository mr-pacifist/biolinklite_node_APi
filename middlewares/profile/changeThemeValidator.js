// external imports
const { check, validationResult } = require("express-validator");

// header title validator
const changeThemeValidation = [
    check("themeId")
        .isNumeric()
        .withMessage("Only number acceptable")
        .isInt({ min: 1, max: 6 })
        .withMessage("Select theme between 1-6")
        .trim(),
  ];

// header title validation handler
const changeThemeValidationHandler = function (req, res, next) {
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
    changeThemeValidation,
    changeThemeValidationHandler,
}