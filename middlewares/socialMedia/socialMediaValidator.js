const { check, validationResult, body } = require('express-validator');

// social media validator
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
        
    body("url")
        .custom((value, { req }) => {
            const socialMediaId = parseInt(req.body.socialMediaId, 10);
            if ([1, 5].includes(socialMediaId)) {
                if(!value){
                    throw new Error("This field is required");
                }else{
                    return true;
                }  
            }
            if (!value) {
                throw new Error("Url is required");
            }
            if (!/^(ftp|http|https):\/\/[^ "]+$/.test(value)) {
                throw new Error("Please enter a valid URL example=https://www.example.com");
            }
            if (value.length > 255) {
                throw new Error("URL is too long");
            }
            return true;
        })
        
        
        .trim().escape()
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
  body("url")
        .custom((value, { req }) => {
            const socialMediaId = parseInt(req.body.socialMediaId, 10);
            if ([1, 5].includes(socialMediaId)) {
                return true;
            }
            if (!value) {
                throw new Error("Url is required");
            }
            if (!/^(ftp|http|https):\/\/[^ "]+$/.test(value)) {
                throw new Error("Please enter a valid URL");
            }
            if (value.length > 255) {
                throw new Error("URL is too long");
            }
            return true;
        })
        .withMessage("Url validation failed")
        .trim().escape()
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