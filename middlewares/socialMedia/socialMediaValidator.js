// external imports
const { check, validationResult, body } = require('express-validator');
const createError = require("http-errors");

// internal imports
const Prisma = require("../../prisma/prismaClient");

// social media validator
const socialMediaUrlValidation = [
    check("profileId")
        .notEmpty()
        .withMessage("Profile ID is missing")
        .custom(async (value) => {
          try {
            const profile = await Prisma.profile.findUnique({
                where: {
                  id: value,
                },
              })
            if (!profile) {
              throw createError("Invalid profile ID");
            }
          } catch (err) {
            throw createError(err.message);
          }
        })
        .trim(),
        
    check("socialMediaId")
        .isNumeric()
        .withMessage("Only number acceptable")
        .isInt({ min: 1, max: 8 })
        .withMessage("Select social media between 1-8")
        .trim(),
        
    body("url")
        .notEmpty()
        .withMessage("This field is required")
        .trim(),
        
];

// social media validation handler
const socialMediaUrlValidationHandler = function (req, res, next) {
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();
    if (Object.keys(mappedErrors).length === 0) {
        next();
    } else {
        res.status(401).json({
            errors: mappedErrors,
        });
    }
};


// on update socialmedia  validator
const updateSocialMediaUrlValidation = [ 
  
  check("socialMediaId")
        .isNumeric()
        .withMessage("Only number acceptable")
        .isInt({ min: 1, max: 8 })
        .withMessage("Select social media between 1-8")
        .trim(),
        
  body("url")
        .isEmpty()
        .withMessage("This field is required")
    
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