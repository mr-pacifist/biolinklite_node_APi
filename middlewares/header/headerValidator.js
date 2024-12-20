
// external imports
const { check, validationResult } = require("express-validator");
const createError = require("http-errors");


// internal imports
const Prisma = require("../../prisma/prismaClient");

// header title validator
const headerValidation = [
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