// external imports
const { check, validationResult } = require("express-validator");


// socialmedia  validator
const socialMediaUrlValidation = [ 
     check("profileId")
        .notEmpty()
        .withMessage("Profile ID is missing")
        .trim(), 

    check("socialMediaId")
        .isNumeric()
        .withMessage("Only number acceptable")
        .isInt({ min: 1, max: 8 })
        .withMessage("Select social media between 1-8")
        .trim(),

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

// on update socialmedia  validator
const updateSocialMediaUrlValidation = [ 
 check("url")
     .notEmpty()
     .withMessage("Url is required")
     .isURL()
     .withMessage('Please enter a valid URL')
     .isLength({max:255})
     .withMessage("URL is too long")
     .trim().escape(),
];

 //on update social media validation handler
const updateSocialMediaUrlValidationHandler = function (req, res, next) {
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
    socialMediaUrlValidationHandler,
    updateSocialMediaUrlValidation,
    updateSocialMediaUrlValidationHandler
}